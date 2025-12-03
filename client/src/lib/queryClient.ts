// import { QueryClient, QueryFunction } from "@tanstack/react-query";

// async function throwIfResNotOk(res: Response) {
//   if (!res.ok) {
//     const text = (await res.text()) || res.statusText;
//     throw new Error(`${res.status}: ${text}`);
//   }
// }

// export async function apiRequest(
//   url: string,
//   method: string,
//   data?: unknown | undefined,
// ): Promise<Response> {
//   const res = await fetch(url, {
//     method,
//     headers: data ? { "Content-Type": "application/json" } : {},
//     body: data ? JSON.stringify(data) : undefined,
//     credentials: "include",
//   });

//   await throwIfResNotOk(res);
//   return res;
// }

// type UnauthorizedBehavior = "returnNull" | "throw";
// export const getQueryFn: <T>(options: {
//   on401: UnauthorizedBehavior;
// }) => QueryFunction<T> =
//   ({ on401: unauthorizedBehavior }) =>
//   async ({ queryKey }) => {
//     const res = await fetch(queryKey[0] as string, {
//       credentials: "include",
//     });

//     if (unauthorizedBehavior === "returnNull" && res.status === 401) {
//       return null;
//     }

//     await throwIfResNotOk(res);
//     return await res.json();
//   };

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       queryFn: getQueryFn({ on401: "throw" }),
//       staleTime: process.env.NODE_ENV === 'development' ? 0 : 1000 * 60 * 5, // No cache in dev, 5 minutes in prod
//       cacheTime: process.env.NODE_ENV === 'development' ? 0 : 1000 * 60 * 10, // No cache in dev, 10 minutes in prod
//       retry: 1,
//       retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
//       refetchOnMount: true,
//       refetchOnWindowFocus: false,
//     },
//     mutations: {
//       retry: false,
//     },
//   },
// });










import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = any>(
  url: string,
  method: string,
  data?: unknown | undefined,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res.json() as Promise<T>; // 👈 now always returns parsed JSON
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null as T;
    }

    await throwIfResNotOk(res);
    return (await res.json()) as T;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      staleTime:
        process.env.NODE_ENV === "development" ? 0 : 1000 * 60 * 5, // No cache in dev, 5 minutes in prod
      cacheTime:
        process.env.NODE_ENV === "development" ? 0 : 1000 * 60 * 10, // No cache in dev, 10 minutes in prod
      retry: 1,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
