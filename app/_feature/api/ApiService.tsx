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
      console.error("API GET request failed:", error);
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
    formData?: HTMLFormElement;
    endpoint: string;
    api?: boolean;
    basicUrl?: string;
  }) {
    console.log("API POST request parameters:", {
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
      init.body = new FormData(formData);
    }
    if (!formData) {
      init.headers = {
        "Content-Type": "application/json",
        ...init.headers,
      };
    }
    try {
      const response = await fetch(url, init);
      const { data, ...rest } = await response.json();
      return {
        data,
        ...rest,
        status: response.status,
        success: response.ok,
      };
    } catch (error) {
      console.error("API POST request failed:", error);
      throw error;
    }
  }
}
if (!process.env.NEXT_PUBLIC_EXTERNAL_URL) {
  throw new Error(
    "NEXT_PUBLIC_EXTERNAL_URL environment variable is not defined",
  );
}
if (!process.env.NEXT_PUBLIC_BASIC_URL) {
  throw new Error("NEXT_PUBLIC_BASIC_URL environment variable is not defined");
}
export default new ApiService({
  basicUrl: process.env.NEXT_PUBLIC_EXTERNAL_URL,
  apiUrl: `${process.env.NEXT_PUBLIC_BASIC_URL}/api`,
});
