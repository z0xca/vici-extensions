# Contributing to AWWW Switcher

Thank you for wanting to contribute to the AWWW Switcher extension ! We're so happy to have you on board with us, but before you start, there are a couple of things we need you to know. No worries, it's nothing more than just formalities :3

## Note regarding the usage of AI
> [!note]
> While we will not enforce those rules, we would like you to follow them in an effort to reduce maintainer fatigue, as we all have very limited time to work on the extension, and would appreciate it if we could spend it on making the experience better rather than babysitting AI.

Agentic coding, *as in directing an AI agent to code for you*, is **strongly discouraged**. This is not only because AI agents usually miss the mark, but also because *we need someone to be accountable* for the code they contribute. If you absolutely need AI to work for you, **please refrain from contributing code** and either ask for a feature request on the vicinae discord server, or open an issue for us to see with all relevant details (technical or not).

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
WIP
