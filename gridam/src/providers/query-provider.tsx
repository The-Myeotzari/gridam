"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";

const QueryProvider = ({children}: PropsWithChildren)=> {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // 실패하면 재시도 X
          staleTime: 60000, // 캐시 유지 시간 1분
        },
      },
    }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default QueryProvider