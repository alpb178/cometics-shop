import { getFormattedDate } from "../utils";
import { fetcher } from "./fetcher";

export interface LogData {
  time: string;
  product: string;
  description: string;
}

export const createLog = async (logData: LogData) => {
  try {
    const response = await fetcher("/api/logs", {
      method: "POST",
      data: {
        data: logData
      }
    });
    return response;
  } catch {
    () => {};
  }
};

export const logsStrapi = async (productName: string, description: string) => {
  const logData: LogData = {
    time: getFormattedDate(),
    product: productName,
    description
  };

  try {
    await createLog(logData);
  } catch {
    () => {};
  }
};
