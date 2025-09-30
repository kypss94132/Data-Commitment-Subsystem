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

// Define electronAPI for ParserGenerator

contextBridge.exposeInMainWorld('electronAPI', {

  selectInput: async () => {
    const result = await ipcRenderer.invoke('select-input-file'); // go to main.ts for select dialog setting
    return result;
  },
 
  selectOutput: async () => {
    const result = await ipcRenderer.invoke('select-output-file'); // go to main.ts for output dialog setting
    return result;
  },

  selectBat: async () => {
    const result = await ipcRenderer.invoke('select-bat-file'); // go to main.ts for select dialog setting
    return result;
  },

  runBat: (opts: { batPath: string; inputPath: string; outputPath: string }) => {
    return ipcRenderer.invoke('run-bat-with-args', opts); // go to main.ts for execution setting
  },
});

