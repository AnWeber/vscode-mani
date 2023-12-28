# Contributing to mani

From opening a bug report to creating a pull request: every contribution is appreciated and welcome. If you're planning to implement a new feature or change the api please create an issue first.

## Issues

If you just want some help or a detail question, please post
a issue to [](https://github.com/AnWeber/vscode-mani/issues/new). Questions
that include an example and/ or the full error message are more likely to receive responses.

**If you have discovered a bug or have a feature suggestion, please [create an issue on GitHub](https://github.com/AnWeber/vscode-mani/issues/new).**

## Submitting Changes

After getting some feedback, push to your fork and submit a pull request. We may suggest some changes or improvements or alternatives, but for small changes your pull request should be accepted quickly.
If there is no issue, an explanatory comment would be helpful.
The pull request executes [Github action `build`](https://github.com/anweber/vscode-mani/blob/main/.github/workflows/main.yml), which must pass successfully.

## Development Setup

This project uses [NodeJS LTS](https://nodejs.org/en/download/) and npm for development. As development editor I recommend VS Code

```sh
# install dependencies
npm i

# build
npm run build

# watch
npm start
```

## Debug

1. Open project in VS Code
2. Open http file, which should be used for Debugging
3. Start Debug Launch Configuration `launch` (`F5`). 
