import { WindowManagement } from "@vicinae/api/dist";
import { WallpaperEngine } from "../../models/wallpaper-engine";
import { exec, execSync } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class Hyprpaper implements WallpaperEngine {
  serverIsRunning(): boolean {
    try {
      execSync("hyprctl hyprpaper listloaded", { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }

  async setWallpaper(
    path: string,
    monitor?: WindowManagement.Screen
  ): Promise<void> {
    try {
      if (!monitor) {
        await execAsync("hyprctl hyprpaper unload all");
      } else {
        await execAsync(`hyprctl hyprpaper wallpaper "${monitor.name},"`);
      }

      await execAsync(`hyprctl hyprpaper preload "${path}"`);

      const target = `${monitor ? monitor.name : ""},${path}`;
      await execAsync(`hyprctl hyprpaper wallpaper "${target}"`);

      return Promise.resolve();
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error.message);
      }

      return Promise.reject("An unknown error occured");
    }
  }
}
