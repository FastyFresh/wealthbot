
/// <reference types="vite/client" />

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: any;
    global: Window;
    solana?: {
      isPhantom?: boolean;
      connect(): Promise<{ publicKey: any }>;
      disconnect(): Promise<void>;
      on(event: string, callback: Function): void;
      request(params: any): Promise<any>;
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      VITE_APP_TITLE?: string;
      VITE_SOLANA_NETWORK?: string;
      VITE_SOLANA_RPC_URL?: string;
    }

    interface Process {
      browser: boolean;
      env: ProcessEnv;
    }
  }
}

declare module 'process' {
  global {
    namespace NodeJS {
      interface Process {
        browser: boolean;
      }
    }
  }
  export = process;
}

declare module 'buffer' {
  export const Buffer: {
    from(data: any, encoding?: string): Buffer;
    isBuffer(obj: any): boolean;
    alloc(size: number): Buffer;
    allocUnsafe(size: number): Buffer;
    allocUnsafeSlow(size: number): Buffer;
    isEncoding(encoding: string): boolean;
  };
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

// Ensure this file is treated as a module
export {};
