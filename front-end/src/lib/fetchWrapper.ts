import { toast } from "sonner";

type request = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

export const fetchWrapper = async <T = unknown>(
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
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    });

    const jsonResponse = (await response.json()) as {
      statusCode: number;
      data?: T;
      message?: string;
      error?: string;
    };

    if (!response.ok) {
      toast.error(jsonResponse.message ?? "Erro inesperado, tente novamente");
      return;
    }

    return { data: jsonResponse.data };
  } catch (error) {
    console.log(error);
    return;
  }
};
