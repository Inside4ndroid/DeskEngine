<h1>Contributing</h1>

This guide is for the people who are interested in contributing to DeskEngine. It is not a complete guide yet, but it should help you get started. If you have any questions or any suggestions, please open a [issue](https://github.com/Inside4ndroid/DeskEngine/issues).

<h2>Table of Contents</h2>

- [Prerequisites](#prerequisites)
  - [Cloning the repository](#cloning-the-repository)
  - [Project structure](#project-structure)
- [Writing a plugin](#Writing-a-plugin)
    - [Setting up the provider](#setting-up-the-provider)
- [Updating codebase](#updaing-codebase)
  - [Updating documentation](#updating-documentation)
  - [Adding A Plugin](#Adding-A-Plugin)
- [Commit message](#commit-message)


## Prerequisites
To contribute to Consumet code, you need to knowledge of the following:
   - [Nodejs](https://nodejs.org/)
   - [Javascript](https://www.javascript.com/)
   - [Electron](https://www.electronjs.org/)
   - [Html](https://html.com/)
   - [CSS](https://www.w3.org/Style/CSS/Overview.en.html)
   - [npm](https://www.npmjs.com/)
   - Recommended (not required)
       - [Visual Studio Code](https://code.visualstudio.com/)

### Cloning the repository
1. [Fork the repository](https://github.com/Inside4ndroid/DeskEngine/fork)
2. Clone your fork to your local machine using the following command **(make sure to change `<your_username>` to your GitHub username)**:
```sh
git clone https://github.com/<your-username>/DeskEngine.git
```
3. Create a new branch:
```sh
git checkout -b <new-branch-name>
```

### Project structure
I believe that project structure is needed to make it simple to contribute to DeskEngine.

***\<plugins>*** is the directory of the plugins package with Deskengine. For example, `Clock` (no special characters).\
***\<meters>*** is the directory of the api for the plugins. For example, `DateTime.js` (no special characters).\

```sh
> tree
main/
├── <meters>/
|   ├── ...
|   └── DateTime.js
├── mpv/
│   └── ... (advised to leave this alone it is a third party application for setting wallpapers)
├── weebp/
│   └── ... (advised to leave this alone it is a third party application for setting wallpapers)
├── app.js
├── config,ini
├── pluginManager.js
├── preload.js
├── wallpaperManager.js
│
public/
├── css/
|   ├── ...
|── images/
|   └── ...
├── js/
|   ├── config.ini
|   ├── dropdown.js
|   └── index.js
├── <plugins>/
|   └── ...
├── Wallpapers/
|   └── ...
├── index.html
└── package.json
```

## Writing a plugin
Each plugin becomes it own entity and is made up primarily of:
```sh
<PLUGINNAME>/index.html # the plugins main html file
<PLUGINNAME>/manifest.json # the plugin configuration file
<PLUGINNAME>/src/index.js # the renderer javascript for the html
<PLUGINNAME>/src/styles.css # the plugins styles
```
You are welcome to add anything to the the base application to allow an api for your plugin but any api must be located in the 'meters' folder. (For an example see DateTime.js for the Clock plugins api.).

## Updating codebase
### Updating documentation
1. Update the documentation.
2. Test your changes.
3. [Commit the changes](#commit-message).

### Adding A Plugin
1. Add the plugin code.
2. Test your changes.
3. [Commit the changes](#commit-message).

## Commit message
When you've made changes to one or more files, you have to *commit* that file. You also need a
*message* for that *commit*.

You should read [these](https://www.freecodecamp.org/news/writing-good-commit-messages-a-practical-guide/) guidelines, or that summarized:

- Short and detailed
- Prefix one of these commit types:
   - `plugin:` Adding new plugin, possibly improving an already existing plugin
   - `feat:` A feature, possibly improving something already existing
   - `fix:` A fix, for example of a bug
   - `refactor:` Refactoring a specific section of the codebase
   - `test:` Everything related to testing
   - `docs:` Everything related to documentation
   - `chore:` Code maintenance

Examples:
 - `plugin: Adding new plugin - CPU Monitor`
 - `feat: Speed up parsing with new technique`
 - `fix: Fix Clock Plugin UI typo`
 - `refactor: Reformat code at app.js`