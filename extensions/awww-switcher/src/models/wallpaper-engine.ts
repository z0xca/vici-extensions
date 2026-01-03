import { ImageLike, WindowManagement as wm } from "@vicinae/api";

/**
 * Block of metadata to show the user what backend they are using in the search bar accessory
 */
export interface WallpaperEngineMetadata {
  /**
   * The name that will be displayed to the user in the search bar accessory
   */
  name: string;
  /**
   * Image object to serve as an icon. Will be displayed next to the backend the user selected
   */
  icon: ImageLike;
  /**
   * ID of the backend to use, should match the value field of the 'Wallpaper engine' object in the package.json
   */
  id: string;
}

/**
 * Basic interface abstracting changing wallpapers
 **/
export interface WallpaperEngine {
  /**
   * Change the user's wallpaper to the provided image file
   * @param path Path to the image file to set as wallpaper
   * @param monitor Optional monitor to set the wallpaper on, if undefined the wallpaper will be set on all monitors
   */
  setWallpaper(path: string, monitor?: wm.Screen): Promise<void>;

  /**
   * Check if the user's wallpaper backend is running
   *
   * Currently *unused* and only implemented by the hyrpaper backend
   */
  serverIsRunning(): boolean;
}
