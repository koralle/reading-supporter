import type { NextConfig } from "next";

const mermaidNodeStub = "./src/lib/mermaid-node-stub.ts";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  transpilePackages: ["shiki", "streamdown"],
  serverExternalPackages: ["langium", "@mermaid-js/parser"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "vscode-jsonrpc": mermaidNodeStub,
        langium: mermaidNodeStub,
      };
    }
    return config;
  },
  turbopack: {
    resolveAlias: {
      "vscode-jsonrpc": { browser: mermaidNodeStub },
      langium: { browser: mermaidNodeStub },
    },
  },
};

export default nextConfig;
