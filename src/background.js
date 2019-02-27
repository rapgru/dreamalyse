import { app, protocol, BrowserWindow } from 'electron';
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';
import winston from 'winston';

const path = require('path');

const { combine, timestamp, printf } = winston.format;
const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const mainLogger = winston.createLogger({
  level: 'info',
  format: combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'log/info.log' }),
  ],
});
if (process.env.NODE_ENV !== 'production') {
  mainLogger.add(new winston.transports.Console({
    format: combine(
      timestamp(),
      printf(info => `${info.timestamp} - ${info.level} - [${info.thread}] ${info.message}`),
    ),
  }));
}

global.sharedObject = {
  mainLogger,
};

const logger = mainLogger.child({ thread: 'main' });

// Set AUMID for NSIS installer
app.setAppUserModelId('com.github.rapgru.dreamalyze');
logger.info('Set AUMID');
// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true });

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, icon: path.join(__static, 'icons/64x64.png') });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools();
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
