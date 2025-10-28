"use client";
import CONSTANTS from "@/domain/constans";
import {
  GetCurrentUserDocument,
  GetUserFragment,
  LoginDocument,
  LoginInput,
  RefreshJwtAuthTokenDocument,
} from "@/graphql/@generated/graphql";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type AuthContextType = {
  signIn: (data: LoginInput) => Promise<void>;
  signOut: () => void;
  refreshToken: () => Promise<string | null | undefined>;
  user?: GetUserFragment | null | undefined;
  setUser: Dispatch<GetUserFragment | undefined | null>;
  currentUser: () => void;
  getAccessToken: () => string | undefined;
  getRefreshToken: () => string | undefined;
};

const authContext = createContext({} as AuthContextType);

export const useAuth = () => {
  return useContext(authContext);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useProviderAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

const useProviderAuth = () => {
  const router = useRouter();
  const [signInMutation] = useMutation(LoginDocument);
  const [refreshTokenMutation] = useMutation(RefreshJwtAuthTokenDocument);
  const [fetchCurrentUser] = useLazyQuery(GetCurrentUserDocument);
  const [user, setUser] = useState<GetUserFragment | null>();

  const signOut = useCallback(() => {
    destroyCookie(undefined, CONSTANTS.Auth.accessToken);
    destroyCookie(undefined, CONSTANTS.Auth.refreshToken);
    setUser(undefined);
    router.push("/");
  }, [router]);

  const signIn = useCallback(
    async (input: LoginInput) => {
      const result = await signInMutation({ variables: { input } });

      const accessToken = result.data?.login?.authToken ?? "";
      const refreshToken = result.data?.login?.refreshToken ?? "";

      // **Recomendado**: use maxAge conforme o exp do JWT (ou curto, p.ex. 15 min)
      setCookie(undefined, CONSTANTS.Auth.accessToken, accessToken, {
        maxAge: 60 * 15, // 15 min (exemplo)
        path: "/",
      });

      // refresh costuma durar mais tempo
      setCookie(undefined, CONSTANTS.Auth.refreshToken, refreshToken, {
        maxAge: 60 * 60 * 24 * 7, // 7 dias (exemplo)
        path: "/",
      });

      setUser(result.data?.login?.user);
      router.push("/dashboard");
    },
    [router, signInMutation]
  );

  const refreshToken = async () => {
    const {data} = await refreshTokenMutation({variables: {input: { jwtRefreshToken: getRefreshToken() || ""}}});
    return data?.refreshJwtAuthToken?.authToken;
  }

  const currentUser = useCallback(async () => {
    const user = await fetchCurrentUser();
    setUser(user.data?.viewer);
    return user.data?.viewer;
  }, [fetchCurrentUser]);

  const getAccessToken = () => parseCookies()[CONSTANTS.Auth.accessToken];
  const getRefreshToken = () => parseCookies()[CONSTANTS.Auth.refreshToken];

  return {
    signIn,
    signOut,
    refreshToken,
    user,
    setUser,
    currentUser,
    getAccessToken,
    getRefreshToken,
  };
};
