import { ColorGenerator } from "@models/colors";
import { execAsync } from "@utils/commons";

export class Matugen implements ColorGenerator {
  constructor(public colorScheme: string) {}

  async setColor(wallpaperPath: string): Promise<void> {
    try {
      await execAsync(
        `matugen image '${wallpaperPath}' --type ${this.colorScheme} --source-color-index 0`,
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
