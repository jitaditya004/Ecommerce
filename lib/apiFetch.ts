const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apifetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(BASE_URL + endpoint, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return {
      error: true,
      message: data?.message || "Request failed",
      status: res.status,
    };
  }

  return res.json();
}
