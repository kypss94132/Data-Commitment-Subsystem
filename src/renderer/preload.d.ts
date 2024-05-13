import { ElectronHandler, FileHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    file: FileHandler;
  }
}

export {};
