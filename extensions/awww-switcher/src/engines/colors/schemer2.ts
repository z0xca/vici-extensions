import { ColorGenerator } from "@models/colors";
import { execAsync } from "@utils/commons";

export class Schemer2 implements ColorGenerator {
  async setColor(wallpaperPath: string): Promise<void> {
    try {
      await execAsync(`schemer2 '${wallpaperPath}'`);
      return Promise.resolve();
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error.message);
      }

      return Promise.reject("An unknown error occured");
    }
  }
}
