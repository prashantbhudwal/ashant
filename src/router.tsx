import { routeTree } from "./routeTree.gen";
import type { ReactNode } from "react";
import { createRouter } from "@tanstack/react-router";
import type { TRPCRouter } from "~/server/routers/_router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import { TRPCProvider } from "~/client/trpc/react";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { DefaultCatchBoundary } from "./client/components/DefaultCatchBoundary";
import { NotFound } from "./client/components/NotFound";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    return `http://localhost:${process.env.PORT ?? 3000}`;
  })();
  return `${base}/api/trpc`;
}

export const trpcClient = createTRPCClient<TRPCRouter>({
  links: [
    httpBatchStreamLink({
      transformer: superjson,
      url: getUrl(),
    }),
  ],
});

export function Provider({
  children,
  queryClient,
}: {
  children: ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  });
  const serverHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient: queryClient,
  });
  const router = createRouter({
    routeTree,
    context: {
      queryClient,
      trpc: serverHelpers,
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    Wrap: ({ children }: { children: ReactNode }) => (
      <Provider queryClient={queryClient}>{children}</Provider>
    ),
  });
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    wrapQueryClient: false,
  });
  return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
