import {
  WallpaperProvider,
  WallpaperProviderMetadata,
} from "../models/wallpaper-provider";
import { Awww } from "../providers/wallpapers/awww";
import { MPVPaper } from "../providers/wallpapers/mpvpaper";

export const listProviders = (): WallpaperProviderMetadata[] => {
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
      name: "Custom (see preferences)",
      id: "custom",
      icon: "🔧",
    },
  ];
};

export const providerFromPref = (
  prefs: Preferences,
  overrideSelectedProvider?: Preferences.provider,
): WallpaperProvider => {
  const selected_provider: string = overrideSelectedProvider
    ? overrideSelectedProvider
    : prefs.provider;

  switch (selected_provider) {
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
    case "kde-plasma":
    case "custom": {
      throw new Error("Provider not yet implemented.");
    }
  }
};
