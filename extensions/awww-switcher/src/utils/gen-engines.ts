import {
  WallpaperEngine,
  WallpaperEngineMetadata,
} from "../models/wallpaper-engine";
import { Awww } from "../engines/wallpapers/awww";
import { CustomEngine } from "../engines/wallpapers/custom";
import { Hyprpaper } from "../engines/wallpapers/hyprpaper";
import { MPVPaper } from "../engines/wallpapers/mpvpaper";
import { PlasmaWallpaper } from "../engines/wallpapers/plasma";

export const listEngines = (): WallpaperEngineMetadata[] => {
  return [
    {
      name: "AWWW Deamon",
      id: "awww",
      icon: { source: "engine-icons/LGFae.png" },
    },
    {
      name: "KDE Plasma",
      id: "kde-plasma",
      icon: { source: "engine-icons/kde.png" },
    },
    {
      name: "MPV Paper",
      id: "mpvpaper",
      icon: { source: "engine-icons/mpv.png" },
    },
    {
      name: "Hyprpaper",
      id: "hyprpaper",
      icon: { source: "engine-icons/hyprpaper.png" },
    },
    {
      name: "Custom (see preferences)",
      id: "custom",
      icon: "🔧",
    },
  ];
};

export const engineFromPref = (
  prefs: Preferences,
  overrideSelectedEngine?: Preferences.engine,
): WallpaperEngine => {
  const selected_engine: string = overrideSelectedEngine
    ? overrideSelectedEngine
    : prefs.engine;

  switch (selected_engine) {
    default:
    case "awww": {
      return new Awww(
        prefs.awwwtransitionFPS,
        prefs.awwwtransitionType,
        prefs.awwwtransitionStep,
        prefs.awwwtransitionDuration,
      );
    }
    case "mpvpaper": {
      return new MPVPaper(prefs.mpvpaperSocket);
    }
    case "hyprpaper": {
      return new Hyprpaper();
    }
    case "kde-plasma": {
      return new PlasmaWallpaper();
    }

    case "custom": {
      return new CustomEngine(prefs.customEngineCmd);
    }
  }
};
