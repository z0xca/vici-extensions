import { colorGeneratorFromPrefs, engineFromPref } from "./utils/gen-providers";
import { displayError } from "./utils/commons";
import { getImagesFromPath, Image } from "./utils/image";
import {
  WindowManagement as wm,
  showToast,
  Toast,
  getPreferenceValues,
} from "@vicinae/api";

export default async function RandomWallpaper() {
  const preferences = getPreferenceValues<Preferences>();
  console.log(preferences);
  let isWMSupported = false;

  const loader = await showToast({
    title: "Selecting random wallpaper...",
    style: Toast.Style.Animated,
  });

  let monitors: wm.Screen[] = [];

  wm.getScreens().then(
    (screens) => {
      monitors = screens;
      isWMSupported = true;
    },
    (err) => {
      isWMSupported = false;

      showToast({
        title:
          "Could not get monitors, monitor specific features will be disabled",
        message: err,
        style: Toast.Style.Failure,
      });
    },
  );

  const monitorNames = isWMSupported ? monitors.map((m) => m.name) : [];
  const wallpapers: Image[] = await getImagesFromPath(
    preferences.wallpaperPath,
    false,
  );

  if (wallpapers.length === 0) {
    await displayError(
      "Unable to switch wallper",
      `No images found in '${preferences.wallpaperPath}'`,
    );
    await showToast({
      title: `Failed changing wallpaper`,
      style: Toast.Style.Failure,
    });
    return;
  }

  // Randomly select an image
  const randomIndex = Math.floor(Math.random() * wallpapers.length);
  const selectedWallpaper = wallpapers[randomIndex];

  // Looks like typescript didn't get that there will always be an image in that array,
  // thanks to that guard statement earlier.
  if (!selectedWallpaper) return;

  // const isWide = selectedWallpaper.width / selectedWallpaper.height;

  // if (
  //   isWMSupported &&
  //   isWide > 1.8 &&
  //   monitorNames.includes(leftMonitorName) &&
  //   monitorNames.includes(rightMonitorName)
  // ) {
  //   omniCommand(
  //     selectedWallpaper.fullpath,
  //     `${leftMonitorName}|${rightMonitorName}`,
  //     awwwTransition,
  //     awwwSteps,
  //     awwwDuration,
  //     preferences.toggleVicinaeSetting,
  //     colorGen,
  //     postProduction,
  //     postCommandString,
  //     awwwFPS,
  //   );
  // } else {
  engineFromPref(preferences)
    .setWallpaper(selectedWallpaper.fullpath)
    .then(
      async () => {
        colorGeneratorFromPrefs(preferences)
          .setColor(selectedWallpaper.fullpath)
          .catch(async (err) => {
            await displayError(
              `Unable to call ${preferences.colorGenTool} !`,
              err,
            );
          });

        await showToast({
          title: `Choose '${selectedWallpaper.name}' as wallpaper`,
          message: `Set '${selectedWallpaper.name}' as wallpaper`,
          style: Toast.Style.Success,
        });
      },
      async (err) => {
        await displayError("Unable to set wallpaper !", err);
        await showToast({
          title: `Failed changing wallpaper`,
          style: Toast.Style.Failure,
        });
      },
    );
}
