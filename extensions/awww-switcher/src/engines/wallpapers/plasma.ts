import { WindowManagement } from "@vicinae/api/dist";
import { WallpaperEngine } from "../../models/wallpaper-engine";
import { sessionBus, MessageBus, Variant } from "dbus-next";

interface PlasmaShellInterface {
  setWallpaper(
    pluginId: string,
    pluginOptions: {
      Image: Variant;
    },
    screenIndex: number,
  ): Promise<void>;
}

export class PlasmaWallpaper implements WallpaperEngine {
  bus: MessageBus;

  constructor() {
    this.bus = sessionBus();
  }

  serverIsRunning(): boolean {
    throw new Error("Method not implemented.");
  }

  async setWallpaper(
    path: string,

    //We do not yet support specifying the screen on kde plasma, as such this option will never be used
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _monitor?: WindowManagement.Screen,
  ): Promise<void> {
    try {
      const proxy = await this.bus.getProxyObject(
        "org.kde.plasmashell",
        "/PlasmaShell",
      );

      const shell = proxy.getInterface(
        "org.kde.PlasmaShell",
      ) as unknown as PlasmaShellInterface;

      await shell.setWallpaper(
        "org.kde.image",
        {
          Image: new Variant("s", path),
        },
        0,
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
