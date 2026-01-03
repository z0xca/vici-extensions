import { WindowManagement } from "@vicinae/api/dist";
import { WallpaperEngine } from "@models/wallpaper-engine";
import { execSync } from "child_process";
import { execAsync } from "@utils/commons";

const commandExists = (commandName: string): boolean => {
  try {
    execSync(`command -v ${commandName}`, { stdio: "pipe" });
    return true;
  } catch (error) {
    return false;
  }
};

const getWallpaperTool = (): "awww" | "swww" | null => {
  if (commandExists("awww")) {
    return "awww";
  }

  if (commandExists("swww")) {
    return "swww";
  }

  return null;
};

export type AwwwTransitionType =
  | "none"
  | "simple"
  | "fade"
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "wipe"
  | "wave"
  | "grow"
  | "center"
  | "any"
  | "outer"
  | "random";

export class Awww implements WallpaperEngine {
  fps: number = 60;
  type: AwwwTransitionType = "random";
  step: number = 90;
  duration: number = 1;

  constructor(
    fps: number,
    transitiontype: AwwwTransitionType,
    step: number,
    durationSeconds: number,
  ) {
    this.fps = fps;
    this.type = transitiontype;
    this.step = step;
    this.duration = durationSeconds;
  }

  serverIsRunning(): boolean {
    throw new Error("Method not implemented.");
  }

  async setWallpaper(
    path: string,
    monitor?: WindowManagement.Screen,
  ): Promise<void> {
    // I do not like this try catch syntax, hopefully i can later on find a better way to handle this. -Lyna
    try {
      await execAsync(
        `${getWallpaperTool()} img "${path}" -t ${this.type} --transition-step ${this.step} --transition-duration ${this.duration} --transition-fps ${this.fps} ${monitor ? `--output ${monitor.name}` : ""}`,
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
