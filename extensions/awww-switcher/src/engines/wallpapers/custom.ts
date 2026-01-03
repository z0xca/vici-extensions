import { WindowManagement } from "@vicinae/api/dist";
import { WallpaperEngine } from "@models/wallpaper-engine";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class CustomEngine implements WallpaperEngine {
  command: string;

  constructor(command: string) {
    this.command = command;
  }

  serverIsRunning(): boolean {
    throw new Error("Method not implemented.");
  }

  async setWallpaper(
    path: string,
    monitor?: WindowManagement.Screen,
  ): Promise<void> {
    try {
      let final_command = this.command.replace("%p", path);
      if (monitor) final_command = final_command.replace("%d", monitor.name);

      await execAsync(final_command);

      return Promise.resolve();
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error.message);
      }

      return Promise.reject("An unknown error occured");
    }
  }
}
