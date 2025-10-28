'use client';

import { ApolloProvider } from '@apollo/client/react';
import { ReactNode } from 'react';
import { apolloClient } from './apollo';

export default function ApolloProviderWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
