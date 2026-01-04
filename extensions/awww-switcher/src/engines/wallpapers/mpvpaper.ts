import { WindowManagement } from "@vicinae/api/dist";
import { WallpaperEngine } from "@models/wallpaper-engine";
import { execAsync } from "@utils/commons";

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
    // Disabled since mpvpaper doesn't seem to support selecting the display on the client side
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
