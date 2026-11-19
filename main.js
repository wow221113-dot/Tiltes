const { app, BrowserWindow, Menu, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

if (!app.requestSingleInstanceLock()) app.quit();

const stateFile = () => path.join(app.getPath('userData'), 'window.json');
function loadSize() {
  try {
    const s = JSON.parse(fs.readFileSync(stateFile(), 'utf8'));
    if (s.width >= 380 && s.height >= 600) return { width: s.width, height: s.height };
  } catch (e) {}
  return { width: 520, height: 900 };
}

function createWindow() {
  const win = new BrowserWindow({
    ...loadSize(), minWidth: 380, minHeight: 600,
    title: 'Tilt',
    icon: path.join(__dirname, 'build', 'icon.png'),
    backgroundColor: '#0E0A26',
    autoHideMenuBar: true,
    show: false,
    webPreferences: { contextIsolation: true }
  });
  win.once('ready-to-show', () => win.show());
  win.on('close', () => {
    try { const b = win.getBounds(); fs.writeFileSync(stateFile(), JSON.stringify({ width: b.width, height: b.height })); } catch (e) {}
  });
  win.loadFile('index.html');
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
  if (app.isPackaged) autoUpdater.checkForUpdatesAndNotify();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
