import { ColorGenerator } from "@models/colors";
import { execAsync } from "@utils/commons";

export class ColorZ implements ColorGenerator {
  async setColor(wallpaperPath: string): Promise<void> {
    try {
      await execAsync(`colorz '${wallpaperPath}'`);
      return Promise.resolve();
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error.message);
      }

      return Promise.reject("An unknown error occured");
    }
  }
}
