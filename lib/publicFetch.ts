type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type ApiFailure<E=unknown> = {
  ok: false;
  status: number;
  message: string;
  data?:E;
};

export type ApiResult<T,E=unknown> = ApiSuccess<T> | ApiFailure<E>;

function isApiError(error: unknown): error is { status: number; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}



const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";



export async function publicFetch<T>(
  endpoint: string,
  options: RequestInit = {},
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
        data,  
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
