export interface ColorGenerator {
  setColor(wallpaperPath: string): Promise<void>;
}
