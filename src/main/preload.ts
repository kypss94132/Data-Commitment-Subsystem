// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

const fileHandler = {
  on: (callback: (...arg: unknown[]) => void) =>
    ipcRenderer.on('fileMenu', (_event, ...value) => callback(...value)),
  save: (filePath: string, fileContent: string) =>
    ipcRenderer.send('fileContent', 'save', filePath, fileContent),
  open: (filePath: string) =>
    ipcRenderer.invoke('fileContent', 'open', filePath),
};

contextBridge.exposeInMainWorld('file', fileHandler);

export type ElectronHandler = typeof electronHandler;
export type FileHandler = typeof fileHandler;

// to execute parser.bat
// Define the type for the result passed to the callback

contextBridge.exposeInMainWorld('electronAPI', {
  selectBatFile: async () => {
    const result = await ipcRenderer.invoke('select-bat-file'); // Use `ipcRenderer.invoke` for async calls
    console.log('Selected file:', result);
    return result;
  },
  runBatFile: (filePath: string) => {
    console.log('Sending run-bat-file IPC event with file:', filePath);
    ipcRenderer.send('run-bat-file', filePath);
  },
  onBatFileResponse: (callback: (message: string) => void) =>
    ipcRenderer.on('bat-file-response', (event, message) => {
      console.log('Received response from main process:', message);
      callback(message);
    }),
});
