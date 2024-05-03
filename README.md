# Tab Management Browser Plugin - v1.0.1

<p align="center" style="padding-top: 10px; padding-bottom: 10px">
    <img src="./img/brand/brand.png" width="15%" />
</p>

Tab manager plugin for Chromium browsers and Firefox. This release gives the user
a larger overview over active and archived tabs, as well the possibility
to arrange windows and tabs into folders - a convenient feature for those
who needs to launch different sessions for different purposes.

## Features

-   Create folders (either new, or by using history or session as presets)
-   Duplicate and merge folders
-   Launch folders in incognito
-   Launch folders as a collection/group (Chrome/Edge only)
-   Search through folders, history and current session
-   Simple sidepanel for core features
-   Options page for expanded overview and more features

## Screenshots

<p align="center">
    <img src="./img/screenshots/1.png" width="24%" /> <img src="./img/screenshots/2.png" width="24%" /> 
    <img src="./img/screenshots/3.png" width="24%" /> <img src="./img/screenshots/4.png" width="24%" /> 
    <img src="./img/screenshots/5.png" width="24%" /> <img src="./img/screenshots/6.png" width="24%" /> 
    <img src="./img/screenshots/7.png" width="24%" /> <img src="./img/screenshots/8.png" width="24%" /> 
    <img src="./img/screenshots/9.png" width="24%" /> 
</p>

## Programming and tools

HTML5, CSS3/SASS, Javascript/Typescript, React, Redux, JEST, Tailwind, Webextension API

## Usage

Once installed, you can pin this plugin to your browser's navigation bar. Both Chrome and Firefox has
a pussle icon at the top right border, from where you can pin the plugin.

<p align="center">
    <img src="./img/pussle_pos.png" />
</p>

Clicking the pinned icon will toggle sidepanel for quick use. Should you need more features or better overview, click the "Advanced" button at the bottom of the sidepanel.

<p align="center">
    <img src="./img/advanced_button_pos.png" />
</p>

## Development

### Thumb rules

Although not necessary, sticking to the following would help keeping components clean and
organized.

-   Try to avoid declaring components inside another component (JSX.Element).
-   Consider refactoring components if they become too big or clumsy to work with (e.g. move large functions to their own files).
-   Refactored/sub components should be placed in their own folders and follow a specific naming convention:

```
    ./src
        ...
        - components
            - utils
                - [my_component]
                    - [my_component].tsx
                    - functions
                        - a_component_specific_function.tsx
                        - a_event_handler.ts
                    - components
                        - child_component_a.tsx
                        - child_component_b.tsx
```

### Formatting

The ./src folder is formatted using [Prettier](https://prettier.io/), which may be used together with the [Prettier Code formatter](https://github.com/prettier/prettier-vscode) plugin for VSCode to e.g. enable auto-format when saving. Another option could be to just format the whole folder using the following command:

```
npm run format
```

## Build

### Prerequisites

This project was originally developed using a regular pc, with Windows 10 Home Edition as its operating system. There are really no
specific requirements, and the instructions below should be enough to set up the tools/libraries required to work with the project on any machine.

1. NPM (version 10.4.0 or higher) needs to be installed on your machine
2. Clone this repository to your local environment using the [repository's git file](https://github.com/Njugen/Tab-Manager-Browser-Plugin.git), or simply [download and extract the zip file](https://github.com/Njugen/Tab-Manager-Browser-Plugin/archive/refs/heads/master.zip) to an empty folder.
3. In your project's folder, run the following command in the command prompt or terminal to install all dependencies listed in ./package.json

```
npm install
```

From here on out, you're free to play around with the code however you like - and even make development or production builds (see instructiosn below) for private use if you wish. Just make sure to adhere to the conditions stated in the LICENSE.md file.

### Development build

These builds are meant to be loaded into browser's dev environment for manual testing. Retains all console.logs.
**Firefox**

```
npm run build-dev-firefox
```

_Output folder_:

-   ./dist-dev-firefox

_Output packages_:

-   firefox-dev-package.zip

_Load into browser_:

1. Open Firefox
2. Write _about:debugging_ into the address bar
3. Click _This Firefox_ in the left bar menu
4. Click _Load Temporary Add-on..._ button and head for the ./dist-dev-firefox folder
5. Click _manifest.json_ to load the unpackaged plugin into the browser

**Chrome**

```
npm run build-dev-chrome
```

_Output folder_:

-   ./dist-dev-chrome

_Output packages_:

-   chrome-dev-package.zip

_Load into browser_:

1. Open Chrome
2. Click the menu and head for _Extensions_ -> Manage Extensions\_
3. Enable developer mode
4. Click _Load unpacked_
5. Head for the ./dist-dev-chrome folder and load it into the browser

### Production build

**Firefox**

```
npm run build-prod-firefox
```

_Output folder_:

-   ./dist-prod-firefox

_Output packages_:

-   firefox-prod-package.zip

**Chrome**

```
npm run build-prod-chrome
```

_Output folder_:

-   ./dist-prod-chrome

_Output packages_:

-   chrome-prod-package.zip

## Test

```
npm run test
```

Run unit and integration tests (JEST). The tests are available in /src/\_\_tests\_\_/. The coverage is presented in ./coverage/Icov-report/index.html

Run this command after changing existing components (or when installing or updating dependencies), to check if anything related to user interaction gets broken. Add new tests when adding new components or features. Each test should have clear description and have a relevant purpose (mere coverage hunting does not count...)

# QA

### How do I open folders in incognito?

This feature is turned off by default, and needs to be manually enabled. Follow these steps:

**Firefox:**

1. Go to browser menu -> Add-ons and themes
2. Click "Extensions" in the right-hand bar
3. Click "Tab Management Browser Plugin" and allow it to run in private mode

**Chrome:**

1. Go to browser menu -> Extensions -> Manage Extensions
2. Click the "Details" button located in the "Tab Management Browser Plugin" section
3. Enable the "Allow in Incognito" option

Once done, the folders will show an "Open in incognito" option in their launch menus.

### Why can I not launch folders as tab groups in Firefox?

Firefox currently does not support this feature. Once the browser supports it, I'll make sure to add another launch option to the plugin.

### Is Microsoft Edge supported?

Yes, this plugin is compatible with Microsoft Edge. You may install the plugin in the same manner as in Chrome (use the Chrome package and install it in Edge).

### Why can I not find this plugin in Chrome Web Store/Firefox AMO?

For the time being, this plugin is meant for my own personal use and is also part of my portfolio. I will publish it to the stores at a later time. 

A A [verified package](https://github.com/Njugen/Tab-Manager-Browser-Plugin/releases/download/v1.0.1/firefox-prod-plugin.xpi) signed by Mozilla can be installed in Firefox for personal use from the Release page (v1.0.1). An equivalent package for Chrome/Edge does not exist at the moment, so consider installing the dev package in these browsers if you wish to use it.

### Will there be any updates/new features?

New features will be added as new ideas or feedback/suggestions for significant improvements come up. Smaller bug fixes and enhancements may be published from time to time, with no set schedule nor roadmap at this point.

# Contact information

Email: privat_thai_nguyen@hotmail.com

# Copyright &copy; Thai Nguyen

See LICENSE.md for more information.
