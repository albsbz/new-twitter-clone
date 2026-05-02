"use client";
class CookieStore {
  private has(name: string): boolean {
    if (typeof document === "undefined") {
      return false;
    }
    return document.cookie
      .split("; ")
      .some((row) => row.startsWith(name + "="));
  }

  get(name: string): string | undefined {
    if (typeof document === "undefined") {
      return undefined;
    }
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
    return value ? decodeURIComponent(value) : undefined;
  }

  set(name: string, value: string, options: { expires?: number | Date } = {}) {
    if (typeof document === "undefined") {
      return;
    }
    const isDelete =
      typeof options.expires === "number" && Number(options.expires) < 0;

    if (!isDelete && this.has(name)) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }

    let cookieString = `${name}=${encodeURIComponent(value)}`;
    if (options.expires) {
      if (typeof options.expires === "number") {
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 1000);
        cookieString += `; expires=${date.toUTCString()}`;
      } else {
        cookieString += `; expires=${options.expires.toUTCString()}`;
      }
    }
    document.cookie = cookieString;
  }

  delete(name: string) {
    this.set(name, "", { expires: -1 });
  }
}
const cookieStore = new CookieStore();
export default cookieStore;
