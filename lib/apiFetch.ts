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

export async function apifetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {

  try {
    const isFormData = options.body instanceof FormData;

    const res = await fetch(BASE_URL + endpoint, {
      credentials: "include",
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
    });

    const data: unknown = await res.json().catch(() => null);

    if (!res.ok) {
      throw {
        status: res.status,
        message:
          typeof data === "object" &&
          data !== null &&
          "message" in data
            ? String((data as { message: unknown }).message)
            : "Request failed",
      };
    }

    return {
      ok: true,
      data: data as T,
    };

  } catch (error: unknown) {

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
