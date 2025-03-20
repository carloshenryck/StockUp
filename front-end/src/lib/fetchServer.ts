"use server";
import { cookies } from "next/headers";

type request = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

export const fetchServer = async <T = unknown>(
  route: string,
  requestType?: request,
  body?: object
) => {
  const baseUrl = "http://localhost:4000";
  const routeUrl = `${baseUrl}${route}`;

  const cookieStore = await cookies();
  const acessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    const response = await fetch(routeUrl, {
      method: requestType,
      body: JSON.stringify(body),
      credentials: "include",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: `accessToken=${acessToken}; refreshToken=${refreshToken}`,
      }),
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as T;
    return data;
  } catch {
    return;
  }
};
