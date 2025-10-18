import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

console.log("httpLink => ", process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT);

// const authLink = setContext(async (_, { headers }) => {
//   const supabase = createClient();

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   const token = session?.access_token ?? null;

//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// });

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors) {
//     graphQLErrors.forEach(({ message, extensions }) => {
//       let errors: string[];

//       try {
//         errors = JSON.parse(message);
//       } catch {
//         errors = [...message];
//       }

//       console.log(handleStatusCode(extensions?.code as StatusCodeEnum));
//       console.log(errors);
//     });
//   }

//   if (networkError) {
//     console.log("Erro de rede");
//     console.log("Não foi possível fazer a busca.");
//   }
// });

const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  } else if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) =>
      console.log(
        `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
          extensions
        )}`
      )
    );
  } else {
    console.error(`[Network error]: ${error}`);
  }

  console.log("operation => ", operation);
});

const httpLinks = ApolloLink.from([errorLink, httpLink]);

const createApolloClient = () =>
  new ApolloClient({
    link: httpLinks,
    cache: new InMemoryCache(),
  });

const apolloClient = createApolloClient();

// const handleStatusCode = (code?: StatusCodeEnum) => {
//   const messages = {
//     [StatusCodeEnum.BAD_REQUEST]: "Requisição inválida",
//     [StatusCodeEnum.UNAUTHORIZED]: "Não autorizado",
//     [StatusCodeEnum.FORBIDDEN]: "Proibido",
//     [StatusCodeEnum.NOT_FOUND]: "Não encontrado",
//     [StatusCodeEnum.METHOD_NOT_ALLOWED]: "Método não permitido",
//     [StatusCodeEnum.CONFLICT]: "Conflito",
//     [StatusCodeEnum.TOO_MANY_REQUESTS]: "Muitas requisições",
//     [StatusCodeEnum.NOT_IMPLEMENTED]: "Não implementado",
//     [StatusCodeEnum.INTERNAL_SERVER_ERROR]: "Erro interno do servidor",
//   };

//   return (code && messages[code]) || "Erro interno do servidor";
// };

export { apolloClient, createApolloClient };

