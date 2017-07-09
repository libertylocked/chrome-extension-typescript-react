# Chrome Extension TypeScript React Starter Kit

Chrome Extension Starter Kit, for TypeScript and React.

## What is new
Forked from [chibat's original starter kit](https://github.com/chibat/chrome-extension-typescript-starter), this kit essentially adds *React* support for **popup** and **options** windows.

Plus a bunch of other improvements like source mapping and a better build setup!

---

## Includes the following
- TypeScript
- React
- Webpack
- TSLint
- Moment.js
- jQuery

## Project Structure
- `src`: TypeScript source files
- `public`: Chrome Extension manifest, icon, HTMLs
- `dist`: This is where the Chrome Extension will be built
  - `dist/build`: Generated JavaScript bundles with source mapping, and assets

## Development build
Runs webpack in watch mode, generates bundles with source mapping
```
npm start
```

## Production build
Runs webpack and generates the minified bundles
```
npm run build
```

## Load extension to chrome
- Build the extension
- Open Chrome and go to `chrome://extensions`
- Click `Load unpacked extension...`
- Load the `dist` directory

## Debugging your extension
- Click on the icon of your extension opens the **popup** window
- Right click and open DevTools
- In DevTools you can press Ctrl+R to reload
- Because source maps are generated, you can easily debug your ts code in DevTools
