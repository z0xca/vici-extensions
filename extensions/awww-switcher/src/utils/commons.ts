import { Clipboard, confirmAlert } from "@vicinae/api";
import { exec } from "child_process";
import { promisify } from "util";

export const displayError = async (title: string, message: string) => {
  await confirmAlert({
    title: title,
    message: message,
    primaryAction: {
      title: "Ok",
    },
    dismissAction: {
      title: "Copy error to clipboard",
      onAction: async () => {
        await Clipboard.copy(message);
      },
    },
  });
};

export const execAsync = promisify(exec);
