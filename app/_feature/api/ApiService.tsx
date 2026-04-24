class ApiService {
  private basicUrl: string;
  constructor({ basicUrl }: { basicUrl: string }) {
    this.basicUrl = basicUrl;
  }

  async get(endpoint: string) {
    try {
      const response = await fetch(`${this.basicUrl}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API GET request failed:", error);
      throw error;
    }
  }
}
if (!process.env.API_URL) {
  throw new Error("API_URL environment variable is not defined");
}
export default new ApiService({
  basicUrl: process.env.API_URL,
});
