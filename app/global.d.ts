import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: unknown;  // The type from MetaMask
  }
}
