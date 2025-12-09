import {
  Action,
  ActionPanel,
  getPreferenceValues,
  Grid,
  Icon,
  showToast,
  Toast,
  WindowManagement as wm,
} from "@vicinae/api";
import { createHash } from "node:crypto";
import { useEffect, useState } from "react";
import { WallpaperProvider } from "./models/wallpaper-provider";
import { listProviders, providerFromPref } from "./utils/gen-providers";
import { getImagesFromPath, Image } from "./utils/image";

export default function DisplayGrid() {
  const [monitors, setMonitors] = useState<wm.Screen[]>([]);
  const [isWMSupported, setIsWMSupported] = useState<boolean>(true);
  const [wallpapers, setWallpapers] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const preferences = getPreferenceValues<Preferences>();
  const [selectedProvider, setSelectedProvider] = useState<WallpaperProvider>(
    providerFromPref(preferences),
  );

  const monitorNames = monitors.map((m) => m.name);

  // Adapted from https://stackoverflow.com/a/79452442 <3
  const hashMonitor = (monitor: wm.Screen): string => {
    return createHash("sha256")
      .update(JSON.stringify(monitor), "utf8")
      .digest("hex");
  };

  useEffect(() => {
    wm.getScreens().then(setMonitors, (err) => {
      setIsWMSupported(false);

      showToast({
        title:
          "Could not get monitors, monitor specific features will be disabled",
        message: err,
        style: Toast.Style.Failure,
      });
    });
    getImagesFromPath(preferences.wallpaperPath)
      .then((ws) => {
        setIsLoading(false);
        setWallpapers(ws);
      })
      .catch((e) => {
        showToast({
          title: e.message,
          style: Toast.Style.Failure,
        });
        setIsLoading(false);
      });
  }, []);

  return (
    <Grid
      searchBarPlaceholder="Filter wallpapers..."
      columns={preferences.gridRows * 1} // huhhhh, why does this not work unless I explicitely multiply it by 1?
      aspectRatio="16/9"
      fit={Grid.Fit.Fill}
      isLoading={false}
      searchBarAccessory={
        <Grid.Dropdown
          tooltip="Change Wallpaper Provider"
          storeValue={true}
          defaultValue={preferences.provider}
          onChange={(newProvider) => {
            setSelectedProvider(providerFromPref(preferences, newProvider));
          }}
        >
          {listProviders().map((p) => {
            return (
              <Grid.Dropdown.Item
                title={p.name}
                key={p.id}
                value={p.id}
                icon={p.icon}
              />
            );
          })}
        </Grid.Dropdown>
      }
    >
      <Grid.Section
        title={
          isLoading
            ? `Loading images in '${preferences.wallpaperPath}'...`
            : `Showing images from '${preferences.wallpaperPath}'`
        }
      >
        {isLoading
          ? Array.from({ length: preferences.gridRows * 3 }).map((_, i) => (
              <Grid.Item
                key={i}
                content={{ source: "loading.gif" }}
                title="Loading..."
                subtitle={
                  preferences.showImageDetails ? `480x270 • 79.5 KB` : undefined
                }
              />
            ))
          : wallpapers.map((w) => (
              <Grid.Item
                key={w.fullpath}
                content={{ source: w.fullpath }}
                title={w.name}
                {...(preferences.showImageDetails && {
                  subtitle: `${w.width}x${w.height} • ${w.size.toFixed(2)} MB`,
                  accessories: [
                    { text: `${w.width}x${w.height}` },
                    { text: `${w.size.toFixed(2)} MB` },
                  ],
                })}
                actions={
                  <ActionPanel>
                    <ActionPanel.Section title="Set on All Monitors">
                      <Action
                        title={`Set '${w.name}' on All`}
                        icon={Icon.Image}
                        onAction={() => {
                          selectedProvider
                            .setWallpaper(w.fullpath)
                            .catch((err) => {
                              showToast({
                                title: "Unable to set wallpaper !",
                                message: err, // Seems like this does not render anywhere?
                                style: Toast.Style.Failure,
                              });
                            });
                        }}
                      />
                    </ActionPanel.Section>

                    {isWMSupported && (
                      <>
                        {/*[TODO] Handle monitor splitting */}
                        {/*<ActionPanel.Section title="Split on Monitors">
                          {monitorNames.includes(leftMonitorName) && monitorNames.includes(rightMonitorName) && (
                            <Action
                              title={`Split wallpaper ${leftMonitorName} | ${rightMonitorName}`}
                              icon={Icon.ArrowsExpand}
                              onAction={() => {
                                omniCommand(
                                  w.fullpath,
                                  `${leftMonitorName}|${rightMonitorName}`,
                                  awwwTransition,
                                  awwwSteps,
                                  awwwDuration,
                                  preferences.toggleVicinaeSetting,
                                  colorGen,
                                  postProduction,
                                  postCommandString,
                                  awwwFPS,
                                );
                              }}
                            />
                          )}
                        </ActionPanel.Section>*/}

                        <ActionPanel.Section title="Set on Specific Monitor">
                          {monitors.map((monitor) => (
                            <Action
                              key={hashMonitor(monitor)} // This should be more resistant than simply using monitor.model, in case someone has the same monitor twice
                              title={`Set on ${monitor.name}`}
                              icon={Icon.Monitor}
                              onAction={() => {
                                selectedProvider
                                  .setWallpaper(w.fullpath, monitor)
                                  .catch((err) => {
                                    showToast({
                                      title: "Unable to set wallpaper !",
                                      message: err,
                                      style: Toast.Style.Failure,
                                    });
                                  });
                              }}
                            />
                          ))}
                        </ActionPanel.Section>
                      </>
                    )}
                  </ActionPanel>
                }
              />
            ))}
      </Grid.Section>
    </Grid>
  );
}
