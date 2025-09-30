// This file tells TypeScript what exists on window
import { ElectronHandler, FileHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    file: FileHandler;
    // For ParserGenerator, connect with preload.ts
    electronAPI: {
      selectInput: () => Promise<{ canceled: boolean; filePaths: string[] }>;
      selectOutput: () => Promise<{ canceled: boolean; filePath: string }>;
      selectBat: () => Promise<{ canceled: boolean; filePath: string | null }>;
      runBat: (opts: {
        inputPath: string;
        outputPath: string;
        batPath: string;
      }) => Promise<{ message: string }>;
    };
  }
}

export {};
