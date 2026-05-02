class ApiService {
  private basicUrl: string;
  private apiUrl: string;
  constructor({ basicUrl, apiUrl }: { basicUrl: string; apiUrl: string }) {
    this.basicUrl = basicUrl;
    this.apiUrl = apiUrl;
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
      const response = await fetch(url);
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
    const url = this.constructURL({ endpoint, api, basicUrl });
    const requestBody = body ? JSON.stringify(body) : JSON.stringify(params);
    let init;
    init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    };
    if (formData) {
      init = {
        method: "POST",
        body: new FormData(formData),
      };
    }
    try {
      const response = await fetch(url, init);
      return {
        data: await response.json(),
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
