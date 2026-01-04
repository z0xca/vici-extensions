import {
  WallpaperEngine,
  WallpaperEngineMetadata,
} from "../models/wallpaper-engine";
import { Awww } from "../engines/wallpapers/awww";
import { CustomEngine } from "../engines/wallpapers/custom";
import { Hyprpaper } from "../engines/wallpapers/hyprpaper";
import { MPVPaper } from "../engines/wallpapers/mpvpaper";
import { PlasmaWallpaper } from "../engines/wallpapers/plasma";
import { ColorGenerator } from "../models/colors";
import { DummyGenerator } from "../engines/colors/dummy";
import { Matugen } from "../engines/colors/matugen";
import { PyWal } from "../engines/colors/pywal";
import { WPGTK } from "../engines/colors/wpgtk";
import { Schemer2 } from "../engines/colors/schemer2";
import { ColorZ } from "../engines/colors/colorz";
import { Haishoku } from "../engines/colors/haishoku";
import { Wallust } from "../engines/colors/wallust";

export const listEngines = (): WallpaperEngineMetadata[] => {
  return [
    {
      name: "AWWW Deamon",
      id: "awww",
      icon: { source: "provider-icons/LGFae.png" },
    },
    {
      name: "KDE Plasma",
      id: "kde-plasma",
      icon: { source: "provider-icons/kde.png" },
    },
    {
      name: "MPV Paper",
      id: "mpvpaper",
      icon: { source: "provider-icons/mpv.png" },
    },
    {
      name: "Hyprpaper",
      id: "hyprpaper",
      icon: { source: "provider-icons/hyprpaper.png" },
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

export const colorGeneratorFromPrefs = (prefs: Preferences): ColorGenerator => {
  switch (prefs.colorGenTool) {
    default:
    case "none": {
      return new DummyGenerator();
    }
    case "matugen": {
      return new Matugen(prefs.matugenColorScheme);
    }
    case "pywal": {
      return new PyWal();
    }
    case "wpgtk": {
      return new WPGTK();
    }

    case "schemer2": {
      return new Schemer2();
    }
    case "colorz": {
      return new ColorZ();
    }
    case "haishoku": {
      return new Haishoku();
    }
    case "wallust": {
      return new Wallust();
    }
  }
};
