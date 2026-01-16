type ApiError = {
  message: string;
  status: number;
};

type FetchOptions = RequestInit & {
  parseJson?: boolean;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apifetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {

  const {
    headers,
    parseJson = true,
    ...rest
  } = options;

  const res = await fetch(BASE_URL + endpoint, {
    credentials: "include", // important for cookies
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  });

  // Global error handler
  if (!res.ok) {
    let errorBody;

    try {
      errorBody = await res.json();
    } catch {
      errorBody = { message: res.statusText };
    }

    const error: ApiError = {
      message: errorBody.message || "Request failed",
      status: res.status,
    };

    throw error;
  }

  // Some endpoints may return empty response (204)
  if (!parseJson || res.status === 204) {
    return null as T;
  }

  return res.json();
}
