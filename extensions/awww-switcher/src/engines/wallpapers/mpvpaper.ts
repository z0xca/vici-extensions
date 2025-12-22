import { WindowManagement } from "@vicinae/api/dist";
import { WallpaperEngine } from "../../models/wallpaper-engine";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class MPVPaper implements WallpaperEngine {
  socket_url: string;

  constructor(socket_url?: string) {
    this.socket_url = socket_url ?? "/run/user/1000/mpvpaper.sock";
  }

  serverIsRunning(): boolean {
    throw new Error("Method not implemented.");
  }

  async setWallpaper(
    path: string,
    // Disabled since mpvpaper doesn't seem to support selectingthe display on the client side
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _monitor?: WindowManagement.Screen,
  ): Promise<void> {
    try {
      await execAsync(
        `echo 'loadfile "${path}" replace' | socat - "${this.socket_url}"`,
      );

      return Promise.resolve();
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error.message);
      }

      return Promise.reject("An unknown error occured");
    }
  }
}
