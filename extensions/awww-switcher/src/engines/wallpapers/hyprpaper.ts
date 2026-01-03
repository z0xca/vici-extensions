import { WindowManagement } from "@vicinae/api/dist";
import { WallpaperEngine } from "@models/wallpaper-engine";
import { execSync } from "child_process";
import { execAsync } from "@utils/commons";

export class Hyprpaper implements WallpaperEngine {
  serverIsRunning(): boolean {
    try {
      execSync("ps aux | grep '[h]yprpaper'", { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }

  async setWallpaper(
    path: string,
    monitor?: WindowManagement.Screen,
  ): Promise<void> {
    try {
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
