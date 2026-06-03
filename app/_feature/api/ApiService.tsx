import Logger from "@/app/_utils/logger";
import { publicEnv } from "@/app/lib/env";

const normalizeApiBaseUrl = (baseUrl: string): string => {
  const trimmedBaseUrl = baseUrl.trim();

  if (trimmedBaseUrl.startsWith("/")) {
    return `${trimmedBaseUrl.replace(/\/+$/, "")}/api`;
  }

  try {
    const parsedUrl = new URL(trimmedBaseUrl);
    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
      return `${trimmedBaseUrl.replace(/\/+$/, "")}/api`;
    }
  } catch {
    // Ignore invalid URLs and use the safe fallback below.
  }

  Logger.error(
    "Invalid NEXT_PUBLIC_BASIC_URL for HTTP requests, falling back to same-origin /api",
    trimmedBaseUrl,
  );
  return "/api";
};

class ApiService {
  private basicUrl: string;
  private apiUrl: string;
  private init: RequestInit;
  constructor({ basicUrl, apiUrl }: { basicUrl: string; apiUrl: string }) {
    this.basicUrl = basicUrl;
    this.apiUrl = apiUrl;
    this.init = {};
  }

  private constructURL({
    endpoint,
    api = false,
    basicUrl = this.basicUrl,
  }: {
    endpoint: string;
    api?: boolean;
    basicUrl?: string;
  }) {
    return api ? `${this.apiUrl}/${endpoint}` : `${basicUrl}/${endpoint}`;
  }

  async get({
    endpoint,
    api = false,
    basicUrl = this.basicUrl,
  }: {
    endpoint: string;
    api?: boolean;
    basicUrl?: string;
  }) {
    try {
      const url = this.constructURL({ endpoint, api, basicUrl });
      let init = { ...this.init, method: "GET" };
      const response = await fetch(url, api ? init : undefined);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      Logger.error("API GET request failed:", error);
      throw error;
    }
  }

  async post({
    params,
    body,
    formData,
    endpoint,
    api = false,
    basicUrl = this.basicUrl,
  }: {
    params?: any;
    body?: any;
    formData?: FormData;
    endpoint: string;
    api?: boolean;
    basicUrl?: string;
  }) {
    Logger.log("API POST request parameters:", {
      params,
      body,
      formData: formData ? "Provided" : "Not provided",
      endpoint,
      api,
      basicUrl,
    });
    const url = this.constructURL({ endpoint, api, basicUrl });
    const requestBody = body ? JSON.stringify(body) : JSON.stringify(params);
    const init: RequestInit = {
      ...this.init,
      method: "POST",
      body: requestBody,
    };
    if (formData) {
      init.body = formData;
    }
    if (!formData) {
      init.headers = {
        "Content-Type": "application/json",
        ...init.headers,
      };
    }
    try {
      const response = await fetch(url, init);
      if (!response.ok) {
        const errorText = await response.text();
        Logger.error(
          "API POST request failed with status:",
          response.status,
          "and response:",
          errorText,
        );
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`,
        );
      }
      const { data, ...rest } = await response.json();
      return {
        data,
        ...rest,
        status: response.status,
        success: response.ok,
      };
    } catch (error) {
      Logger.error("API POST request failed:", error);
      throw error;
    }
  }

  async patch({
    params,
    body,
    formData,
    endpoint,
    api = false,
    basicUrl = this.basicUrl,
  }: {
    params?: any;
    body?: any;
    formData?: FormData;
    endpoint: string;
    api?: boolean;
    basicUrl?: string;
  }) {
    Logger.log("API PATCH request parameters:", {
      params,
      body,
      formData: formData ? "Provided" : "Not provided",
      endpoint,
      api,
      basicUrl,
    });
    const url = this.constructURL({ endpoint, api, basicUrl });
    const requestBody = body ? JSON.stringify(body) : JSON.stringify(params);
    const init: RequestInit = {
      ...this.init,
      method: "PATCH",
      body: requestBody,
    };
    if (formData) {
      init.body = formData;
    }
    if (!formData) {
      init.headers = {
        "Content-Type": "application/json",
        ...init.headers,
      };
    }
    try {
      const response = await fetch(url, init);
      if (!response.ok) {
        const errorText = await response.text();
        Logger.error(
          "API PATCH request failed with status:",
          response.status,
          "and response:",
          errorText,
        );
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`,
        );
      }
      const { data, ...rest } = await response.json();
      return {
        data,
        ...rest,
        status: response.status,
        success: response.ok,
      };
    } catch (error) {
      Logger.error("API PATCH request failed:", error);
      throw error;
    }
  }
}

if (!publicEnv.NEXT_PUBLIC_EXTERNAL_URL) {
  throw new Error(
    "NEXT_PUBLIC_EXTERNAL_URL environment variable is not defined",
  );
}
if (!publicEnv.NEXT_PUBLIC_BASIC_URL) {
  throw new Error("NEXT_PUBLIC_BASIC_URL environment variable is not defined");
}
export default new ApiService({
  basicUrl: publicEnv.NEXT_PUBLIC_EXTERNAL_URL,
  apiUrl: normalizeApiBaseUrl(publicEnv.NEXT_PUBLIC_BASIC_URL),
});
