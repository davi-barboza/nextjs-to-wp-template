"use client";
import Medias from "@/components/Medias";
import { apolloClient } from "@/graphql/apollo";
import { ApolloProvider } from "@apollo/client/react";

export default function Home() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <h1 className="text-white">TESTE</h1>
          <Medias />
        </main>
      </div>
    </ApolloProvider>
  );
}
