type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type ApiFailure = {
  ok: false;
  status: number;
  message: string;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

function isApiError(error: unknown): error is { status: number; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}



const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

let refreshPromise: Promise<void> | null = null;

export async function apifetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<ApiResult<T>> {

  try {
    const isFormData = options.body instanceof FormData;

    const res = await fetch(BASE_URL + endpoint, {
      
      ...options,
      credentials: "include",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
    });

    if (res.ok) {
      return {
        ok: true,
        data: await res.json() as T,
      };
    }

    if (
      res.status === 401 &&
      retry &&
      !endpoint.includes("/auth/")
    ) {

      if (!refreshPromise) {
        refreshPromise = fetch(BASE_URL + "/auth/refresh", {
          method: "POST",
          credentials: "include",
        }).then(r => {
          if (!r.ok) throw new Error("Refresh failed");
        }).finally(() => {
          refreshPromise = null;
        });
      }

      await refreshPromise;

      return apifetch<T>(endpoint, options, false);
    }

    const data = await res.json().catch(() => null);

    return {
      ok: false,
      status: res.status,
      message:
        typeof data === "object" &&
        data !== null &&
        "message" in data
          ? String((data as { message: unknown }).message)
          : "Request failed",
    };

  } catch(error: unknown) {
    if (isApiError(error)) {
      return {
        ok: false,
        status: error.status,
        message: error.message,
      };
    }
    return {
      ok: false,
      status: 500,
      message: "Network error",
    };
  }
}
