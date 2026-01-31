/**
 * IPFS CLIENT INTERFACE
 *
 * Unified interface for IPFS operations
 * Automatically uses Pinata in production or localStorage in development
 */

import { uploadToPinata, downloadFromIPFS as downloadViaPinata, getIPFSMode } from './pinata-client';

export interface IPFSClient {
  upload: (data: string) => Promise<string>;
  download: (cid: string) => Promise<string>;
  getMode: () => 'production' | 'development';
}

/**
 * Upload encrypted data to IPFS
 * Returns the IPFS CID
 */
export async function uploadToIPFS(encryptedData: string): Promise<string> {
  return uploadToPinata(encryptedData);
}

/**
 * Download encrypted data from IPFS
 */
export async function downloadFromIPFS(cid: string): Promise<string> {
  return downloadViaPinata(cid);
}

/**
 * Create IPFS client instance
 */
export function createIPFSClient(): IPFSClient {
  return {
    upload: uploadToIPFS,
    download: downloadFromIPFS,
    getMode: getIPFSMode,
  };
}
