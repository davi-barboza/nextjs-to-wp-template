import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://stock.local/graphql",
  documents: ["src/**/*.{ts,tsx,graphql}", "!src/gql/**/*"],
  generates: {
    "./src/graphql/@generated/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false
      }
    },
    "./src/graphql/graphql-schema.json": {
      plugins: ["introspection"]
    }
  },
  ignoreNoDocuments: true
};

export default config;
