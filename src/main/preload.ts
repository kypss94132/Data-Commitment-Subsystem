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

// Define the extended electronAPI for selecting and executing batch files
contextBridge.exposeInMainWorld('electronAPI', {
  // Select the BAT file
  selectBatFile: async () => {
    const result = await ipcRenderer.invoke('select-bat-file');
    return result;
  },

  // Run BAT file without arguments (legacy method)
  runBatFile: (filePath: string) => {
    ipcRenderer.send('run-bat-file', filePath);
  },

  // Listen for response from the main process after BAT file runs
  onBatFileResponse: (callback: (message: string) => void) =>
    ipcRenderer.on('bat-file-response', (event, message) => {
      callback(message);
    }),

  // NEW: Select input XML file
  selectInputFile: async () => {
    return await ipcRenderer.invoke('select-input-file');
  },

  // NEW: Select output TXT file
  selectOutputFile: async () => {
    return await ipcRenderer.invoke('select-output-file');
  },

  // NEW: Run BAT file with input and output arguments
  runBatWithArgs: async (data: { batPath: string; inputPath: string; outputPath: string }) => {
    return await ipcRenderer.invoke('run-bat-with-args', data);
  },
});

