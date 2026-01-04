# Contributing to AWWW Switcher

Thank you for wanting to contribute to the AWWW Switcher extension ! We're so happy to have you on board with us, but before you start, there are a couple of things we need you to know. No worries, it's nothing more than just formalities :3

## Note regarding the usage of AI

> [!note]
> While we will not enforce those rules, we would like you to follow them in an effort to reduce maintainer fatigue, as we all have very limited time to work on the extension, and would appreciate it if we could spend it on making the experience better rather than babysitting AI.

Agentic coding, _as in directing an AI agent to code for you_, is **strongly discouraged**. This is not only because AI agents usually miss the mark, but also because _we need someone to be accountable_ for the code they contribute. If you absolutely need AI to work for you, **please refrain from contributing code** and either ask for a feature request on the vicinae discord server, or open an issue for us to see with all relevant details (technical or not).

If your contribution makes heavy use of AI code, **please disclose it** (along with the used model if known) in the pull request description to allow us maintainers to thoroughly review the code.

Consulting AI for tips and tricks, help with code quality and the like is accepted and does not require disclosure. The same reasoning applies to the usage of AI surrounding translation, in cases where English is not your primary language.

## Setting up your work environment

While the CI that will build the extension and publish it to the store uses npm to build the extension, I (Lyna) personaly use bun as a runtime, so both should work just as great.

> [!warning]
> The bun.lock file is ignored by git, as such please use npm to update the package.lock when editing the package.json, otherwise the CI will fail and the extension update get rejected.

1. Install the dependencies using your package manager of choice

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

> [!tip]
> In development mode, the extension will be automatically rebuilt and reloaded every time you do a change.

> [!caution]
> Make sure to back up your AWWW switcher settings, as the development extension WILL REPLACE your existing one, even after you kill the development process.

Learn more about extension development in the official [vicinae documentation](https://docs.vicinae.com/extensions/introduction).

You're all set 🎉 We're eager to see your next contribution !

#### Happy hacking !

##### Adding support for other engines and color generators

###### Wallpaper engines

> [!note]
> In the following document, the words "engine" and "backend" are used interchangibely

Adding support for other wallpaper engines is pretty easy with our new abstractions! All you have to do is create a new file in src/engines/wallpapers, this file will host the code that speaks to your wallpaper backend, and implement the `WallpaperEngine` class. Here's a template to get you started:

```ts
import { WindowManagement } from "@vicinae/api/dist";
import { WallpaperEngine } from "@models/wallpaper-engine";
import { execAsync } from "@utils/commons";

export class MyWallpaperEngine implements WallpaperEngine {
  serverIsRunning(): boolean {
    throw new Error("Method not implemented.");
  }

  async setWallpaper(
    path: string,
    monitor?: WindowManagement.Screen,
  ): Promise<void> {
    try {
      await execAsync(`command to change my wallpaper to ${path}`);

      return Promise.resolve();
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error.message);
      }

      return Promise.reject("An unknown error occured");
    }
  }
}
```

Need more examples? Take a look at the other implementations in [src/engines/wallpapers](https://github.com/0x4c756e61/vici-extensions/tree/refactor/awww-switcher/extensions/awww-switcher/src/engines/wallpapers)!

Once this is done, there's a couple more things you need to do to make sure the user can select your backend. First you need to add a new entry to the "engine" preference in the extension's package.json (you can add settngs to your backend here as well, just like we do for AWWW), after which you'll have to populate the `src/utils/gen-providers.ts` file with the relevant metadata for your engine, the `listEngines()` function will be used to show the user the selectable engines inside the search bar in the grid view, while the `engineFromPref()` function will generate the coresponding Backend instance following the user's extension preferences.

> [!tip]
> The `WallpaperEngineMetadata` used in `listEngines()` requires you to provide an Icon, this can be the name of a resource or an emoji. If your backend does not have it's own icon, we recommend you use the main project's icon (for example hyprpaper uses the hyprland logo) or the developer's profile picture

Now your user can use your engine congrats !!

###### Color generators

Adding support for a new color generator is even simpler !

All this requires you to do, is to create a new file in `src/engines/colors/` to host your code and implement the `ColorGenerator` Class, for which we provide a template:

```ts
import { ColorGenerator } from "@models/colors";
import { execAsync } from "@utils/commons";

export class MyColorGenerator implements ColorGenerator {
  async setColor(wallpaperPath: string): Promise<void> {
    try {
      await execAsync(
        `Command to change colors using a wallpaper '${wallpaperPath}' as source`,
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
```

Finally, you have to populate the `colorGeneratorFromPrefs` function in `src/utils/gen-providers.ts` and add a new entry to the "Color Generator" field in the package.json.

Everything is ready, your color generator can now be used!
