import { publicEnv } from "../lib/env";

class Logger {
  static log(...args: any[]) {
    if (publicEnv.NODE_ENV === "development") {
      console.info(...args);
    }
  }
  static error(...args: any[]) {
    if (publicEnv.NODE_ENV === "development") {
      console.info(...args);
    }
  }
  static info(...args: any[]) {
    if (publicEnv.NODE_ENV === "development") {
      console.info(...args);
    }
  }
}

export default Logger;
