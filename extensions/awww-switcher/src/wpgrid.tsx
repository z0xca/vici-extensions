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
import { WallpaperEngine } from "./models/wallpaper-engine";
import {
  listEngines,
  engineFromPref,
  colorGeneratorFromPrefs,
} from "./utils/gen-providers";
import { getImagesFromPath, Image } from "./utils/image";
import { displayError } from "./utils/commons";

export default function DisplayGrid() {
  const [monitors, setMonitors] = useState<wm.Screen[]>([]);
  const [isWMSupported, setIsWMSupported] = useState<boolean>(true);
  const [wallpapers, setWallpapers] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const preferences = getPreferenceValues<Preferences>();
  const [selectedEngine, setSelectedEngine] = useState<WallpaperEngine>(
    engineFromPref(preferences),
  );

  const monitorNames = monitors.map((m) => m.name);

  // Adapted from https://stackoverflow.com/a/79452442 <3
  const hashMonitor = (monitor: wm.Screen): string => {
    return createHash("sha256")
      .update(JSON.stringify(monitor), "utf8")
      .digest("hex");
  };

  useEffect(() => {
    wm.getScreens().then(setMonitors, (err: unknown) => {
      setIsWMSupported(false);

      showToast({
        title:
          "Could not get monitors, monitor specific features will be disabled",
        message: err,
        style: Toast.Style.Failure,
      });
    });
    getImagesFromPath(preferences.wallpaperPath, preferences.showImageDetails)
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
          tooltip="Change Wallpaper Engine"
          storeValue={true}
          defaultValue={preferences.engine}
          onChange={(newEngine) => {
            setSelectedEngine(engineFromPref(preferences, newEngine));
          }}
        >
          {listEngines().map((p) => {
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
                          selectedEngine
                            .setWallpaper(w.fullpath)
                            .catch(async (err) => {
                              await displayError(
                                "Unable to set wallpaper !",
                                err,
                              );
                            });

                          colorGeneratorFromPrefs(preferences)
                            .setColor(w.fullpath)
                            .catch(async (err) => {
                              await displayError(
                                "Color generation failed !",
                                err,
                              );
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
                                selectedEngine
                                  .setWallpaper(w.fullpath, monitor)
                                  .catch(async (err) => {
                                    await displayError(
                                      "Unable to set wallpaper !",
                                      err,
                                    );
                                  });

                                colorGeneratorFromPrefs(preferences)
                                  .setColor(w.fullpath)
                                  .catch(async (err) => {
                                    await displayError(
                                      "Color generation failed !",
                                      err,
                                    );
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
