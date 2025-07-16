 
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
/*
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-assembler';
import * as fs from 'node:fs/promises';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { ConsoleErrorListener } from 'antlr4ng';

import {exec} from 'child_process';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('fileContent', async (event, action, filePath, fileContent) => {
  if (action === 'save') {
    try {
      await fs.writeFile(filePath, fileContent);
      event.reply('file', 'save', 'success');
    } catch (error) {
      event.reply('file', 'save', 'error', error);
    }
  }
});

ipcMain.handle('fileContent', async (event, action, filePath) => {
  if (action === 'open') {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  return undefined;
});

// To run parser.bat file

ipcMain.handle('select-bat-file', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Select a Batch File',
    properties: ['openFile'], // Only allow files
    filters: [{ name: 'Batch Files', extensions: ['bat'] }], // Only show .bat files
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true, filePath: null }; // No file selected
  }

  return { canceled: false, filePath: result.filePaths[0] }; // Return the selected file
});

ipcMain.on('run-bat-file', (event, batFilePath) => {
  console.log(`RUN BAT File event triggered with file: ${batFilePath}`);

  exec(`cmd.exe /c "${batFilePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      event.reply('bat-file-response', `Error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Batch file stderr: ${stderr}`);
      event.reply('bat-file-response', `stderr: ${stderr}`);
      return;
    }

    console.log(`Batch file stdout: ${stdout}`);
    event.reply('bat-file-response', stdout || 'Batch file executed successfully.');
  });
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer');
//   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//   const extensions = ['REACT_DEVELOPER_TOOLS'];

//   return installer
//     .default(
//       extensions.map((name) => installer[name]),
//       forceDownload,
//     )
//     .catch(console.log);
// };

const createWindow = async () => {
  if (isDebug) {
    // await installExtensions();
    await installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};
*/
/**
 * Add event listeners...
 */
/*
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.commandLine.appendSwitch('--enable-features', 'OverlayScrollbar');

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);*/
  /* eslint global-require: off, no-console: off, promise/always-return: off */

import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-assembler';
import * as fs from 'node:fs/promises';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { exec, spawn } from 'child_process'; // ← Added `spawn`

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

/**
 * === EXISTING IPC HANDLERS
 */
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('fileContent', async (event, action, filePath, fileContent) => {
  if (action === 'save') {
    try {
      await fs.writeFile(filePath, fileContent);
      event.reply('file', 'save', 'success');
    } catch (error) {
      event.reply('file', 'save', 'error', error);
    }
  }
});

ipcMain.handle('fileContent', async (event, action, filePath) => {
  if (action === 'open') {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  return undefined;
});

/**
 * === BATCH FILE HANDLERS (EXISTING)
 */
ipcMain.handle('select-bat-file', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Select a Batch File',
    properties: ['openFile'],
    filters: [{ name: 'Batch Files', extensions: ['bat'] }],
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true, filePath: null };
  }

  return { canceled: false, filePath: result.filePaths[0] };
});

ipcMain.on('run-bat-file', (event, batFilePath) => {
  console.log(`RUN BAT File event triggered with file: ${batFilePath}`);

  exec(`cmd.exe /c "${batFilePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      event.reply('bat-file-response', `Error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Batch file stderr: ${stderr}`);
      event.reply('bat-file-response', `stderr: ${stderr}`);
      return;
    }

    console.log(`Batch file stdout: ${stdout}`);
    event.reply('bat-file-response', stdout || 'Batch file executed successfully.');
  });
});

/**
 * === NEW IPC HANDLERS
 */

// 1. Select input XML file
ipcMain.handle('select-input-file', async () => {
  return await dialog.showOpenDialog({
    title: 'Select Input XML File',
    filters: [{ name: 'XML Files', extensions: ['xml'] }],
    properties: ['openFile']
  });
});

// 2. Select output TXT file
ipcMain.handle('select-output-file', async () => {
  return await dialog.showSaveDialog({
    title: 'Choose Output File Name',
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
  });
});

// 3. Run BAT file with args
ipcMain.handle('run-bat-with-args', async (_event, { batPath, inputPath, outputPath }) => {
  return new Promise((resolve) => {
    const child = spawn('cmd.exe', ['/c', batPath, inputPath, outputPath]);

    let combinedOutput = '';

    child.stdout.on('data', (data) => {
      combinedOutput += data.toString();
    });

    child.stderr.on('data', (data) => {
      combinedOutput += data.toString();
    });

    child.on('exit', (code) => {
      resolve({
        message: `Process exited with code ${code}\n\n${combinedOutput}`,
      });
    });
  });
});

/**
 * === WINDOW BOOTSTRAP (UNCHANGED)
 */
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const createWindow = async () => {
  if (isDebug) {
    await installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  new AppUpdater();
};

/**
 * === APP EVENT HANDLING
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.commandLine.appendSwitch('--enable-features', 'OverlayScrollbar');

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

