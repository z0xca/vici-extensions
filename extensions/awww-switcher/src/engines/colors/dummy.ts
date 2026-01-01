import { ColorGenerator } from "../../models/colors";

export class DummyGenerator implements ColorGenerator {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  setColor(_wallpaperPath: string): Promise<void> {
    return Promise.resolve();
  }
}
