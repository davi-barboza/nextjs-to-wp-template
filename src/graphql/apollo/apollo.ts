import CONSTANTS from "@/domain/constans";
import { NotifySeverityEnum } from "@/domain/enums/notify-severity.enum";
import { StatusCodeEnum } from "@/domain/enums/status-code.enum";
import store from "@/store";
import { addNotification } from "@/store/notificationSlice";
import { ErrorLike } from "@apollo/client";
import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  gql,
  HttpLink,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { destroyCookie, parseCookies, setCookie } from "nookies";

const handleStatusCode = (code?: StatusCodeEnum) => {
  const messages = {
    [StatusCodeEnum.BAD_REQUEST]: "Requisição inválida",
    [StatusCodeEnum.UNAUTHORIZED]: "Não autorizado",
    [StatusCodeEnum.FORBIDDEN]: "Proibido",
    [StatusCodeEnum.NOT_FOUND]: "Não encontrado",
    [StatusCodeEnum.METHOD_NOT_ALLOWED]: "Método não permitido",
    [StatusCodeEnum.CONFLICT]: "Conflito",
    [StatusCodeEnum.TOO_MANY_REQUESTS]: "Muitas requisições",
    [StatusCodeEnum.NOT_IMPLEMENTED]: "Não implementado",
    [StatusCodeEnum.INTERNAL_SERVER_ERROR]: "Erro interno do servidor",
  };

  return (code && messages[code]) || "Erro interno do servidor";
};

const GQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string;

const refreshToken = async () => {
  const cookies = parseCookies();
  const rt = cookies[CONSTANTS.Auth.refreshToken];
  if (!rt) return null;

  const res = await fetch(GQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation RefreshJwtAuthToken($rt: String!) {
          refreshJwtAuthToken(input: { jwtRefreshToken: $rt }) {
            authToken
          }
        }`,
      variables: { rt },
    }),
  });

  const json = await res.json().catch(() => null);
  if (!json?.data?.refreshJwtAuthToken?.authToken) return null;

  const newToken = json?.data?.refreshJwtAuthToken?.authToken;
  if (newToken) {
    setCookie(undefined, CONSTANTS.Auth.accessToken, newToken, {
      maxAge: 60 * 15, // ajuste conforme o exp do seu JWT
      path: "/",
    });
  }
  return newToken;
};

const isAuthError = (error: CombinedGraphQLErrors): boolean => {
  if (!error || !error.errors) return false;

  const normalizedMessages = error.errors
    .map((e) => e.message?.toLowerCase() ?? "")
    .join(" ");

  // Cobre as mensagens mais comuns do WPGraphQL + JWT Auth
  return (
    normalizedMessages.includes("without authentication") ||
    normalizedMessages.includes("not logged in") ||
    normalizedMessages.includes("unauthorized")
    // normalizedMessages.includes("jwt") ||
    // normalizedMessages.includes("token") // fallback se erro for JWT related
  );
};


const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

const authLink = new SetContextLink(async (prevContext) => {
  const cookies = parseCookies();
  const token =
    typeof window !== "undefined" ? cookies[CONSTANTS.Auth.accessToken] : null;

  return {
    headers: {
      ...(prevContext.headers ?? {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error) && isAuthError(error)) {
    // Evita loop: não tenta refresh se for a própria mutation de refresh
    if (operation.operationName === "RefreshJwtAuthToken") return;

    // Evita tentar várias vezes a mesma operação
    const context = operation.getContext();
    // if (context._retry) return;

    return new Observable((observer) => {
      (async () => {
        const newToken = await refreshToken();
        if (!newToken) {
          destroyCookie(undefined, CONSTANTS.Auth.accessToken);
          destroyCookie(undefined, CONSTANTS.Auth.refreshToken);
          observer.error(error);
          return;
        }

        operation.setContext({
          ...context,
          _retry: true,
          headers: {
            ...context.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });

        forward(operation).subscribe(observer);
      })();
    });
  }

  // Continua tratando erros normais
  if (CombinedGraphQLErrors.is(error) || CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message }) => {
      store.dispatch(
        addNotification({
          title: "Erro",
          messages: [message],
          severity: NotifySeverityEnum.ERROR,
        })
      );
    });
  }
});


const httpLinks = ApolloLink.from([authLink, errorLink, httpLink]);

const createApolloClient = () =>
  new ApolloClient({
    link: httpLinks,
    cache: new InMemoryCache(),
  });

const apolloClient = createApolloClient();

export { apolloClient, createApolloClient };
