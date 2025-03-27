import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "https://rickandmortyapi.com/graphql",
    documents: ["src/**/*.tsx"],
    generates: {
        "./src/__generated__/": {
            preset: "client",
            presetConfig: {
                gqlTagName: "gql",
            },
        },
    },
};

export default config;