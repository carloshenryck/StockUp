import { toast } from "sonner";

type request = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

export const fetchLocal = async <T = unknown>(
  route: string,
  requestType?: request,
  body?: object
) => {
  const baseUrl = "http://localhost:4000";
  const routeUrl = `${baseUrl}${route}`;

  try {
    const response = await fetch(routeUrl, {
      method: requestType,
      body: JSON.stringify(body),
      credentials: "include",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as {
        message?: string;
      };
      toast.error(errorData.message ?? "Erro inesperado, tente novamente");
      return;
    }

    const data = (await response.json()) as T;
    return data;
  } catch {
    toast.error("Erro inesperado, tente novamente");
    return;
  }
};
