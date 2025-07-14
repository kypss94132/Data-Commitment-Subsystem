import { ElectronHandler, FileHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    file: FileHandler;
    // for parser
    electronAPI: {
      selectBatFile: () => Promise<{ canceled: boolean; filePath: string | null }>;
      runBatFile: (filePath: string) => void;
      onBatFileResponse: (callback: (message: string) => void) => void;
  };
  }

}

export {};
