class Logger {
  static log(...args: any[]) {
    if (process.env.NODE_ENV === "development") {
      console.info(...args);
    }
  }
  static error(...args: any[]) {
    if (process.env.NODE_ENV === "development") {
      console.info(...args);
    }
  }
  static info(...args: any[]) {
    if (process.env.NODE_ENV === "development") {
      console.info(...args);
    }
  }
}

export default Logger;
