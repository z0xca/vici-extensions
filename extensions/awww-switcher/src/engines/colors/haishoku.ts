import { ColorGenerator } from "../../models/colors";
import { execAsync } from "../../utils/commons";

export class Haishoku implements ColorGenerator {
  async setColor(wallpaperPath: string): Promise<void> {
    try {
      await execAsync(
        `python -c "from haishoku.haishoku import Haishoku; Haishoku.loadHaishoku('${wallpaperPath}')"`,
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
