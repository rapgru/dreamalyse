import { app, protocol, BrowserWindow } from 'electron';
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';
import mainLogger from './logging/mainlogger';

const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';
let win;

global.mainLogger = mainLogger;
const logger = mainLogger.child({ thread: 'main' });


// Set AUMID for NSIS installer
app.setAppUserModelId('com.github.rapgru.dreamalyze');
// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true });

function createWindow() {
  logger.info('Starting Main Renderer Proccess', { process });
  win = new BrowserWindow({ width: 800, height: 600, icon: path.join(__static, 'icons/64x64.png') });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    logger.info('Destroying BrowserWindow');
    win = null;
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    logger.info('Closing application');
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    logger.info('Recreating new BrowserWindow as application is still running, but win is null');
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    logger.info('Installing Vue DevTools');
    try {
      await installVueDevtools();
    } catch (e) {
      logger.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        logger.info('Doing a clean development exit on Windows');
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      logger.info('Doing a clean development exit on UNIX');
      app.quit();
    });
  }
}
