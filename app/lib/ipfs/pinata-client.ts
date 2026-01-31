/**
 * PINATA IPFS CLIENT
 *
 * Production-ready IPFS client using Pinata API
 * Features:
 * - Real IPFS uploads via Pinata
 * - Multi-gateway fallback for downloads
 * - Error handling and retries
 * - Type-safe interfaces
 */

interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface IPFSGateway {
  url: string;
  priority: number;
}

const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_UPLOAD_ENDPOINT = `${PINATA_API_URL}/pinning/pinJSONToIPFS`;

// Multiple gateways for redundancy
const IPFS_GATEWAYS: IPFSGateway[] = [
  { url: `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'}/ipfs`, priority: 1 },
  { url: `https://${process.env.NEXT_PUBLIC_IPFS_GATEWAY_1 || 'ipfs.io'}/ipfs`, priority: 2 },
  { url: `https://${process.env.NEXT_PUBLIC_IPFS_GATEWAY_2 || 'cloudflare-ipfs.com'}/ipfs`, priority: 3 },
];

/**
 * Upload encrypted vault data to IPFS via Pinata
 * Returns the IPFS CID
 * NO FALLBACK - Pure decentralized storage only
 */
export async function uploadToPinata(encryptedData: string): Promise<string> {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;

  // NO FALLBACK - Pinata JWT is required
  if (!jwt || jwt === 'your_pinata_jwt_token_here') {
    throw new Error('Pinata JWT not configured. Please add NEXT_PUBLIC_PINATA_JWT to .env.local');
  }

  const data = {
    pinataContent: {
      version: '1.0',
      encrypted: encryptedData,
      timestamp: Date.now(),
    },
    pinataMetadata: {
      name: `hidemypass-${Date.now()}`,
      keyvalues: {
        app: 'hidemypass',
        type: 'encrypted-vault',
      },
    },
    pinataOptions: {
      cidVersion: 1,
    },
  };

  const response = await fetch(PINATA_UPLOAD_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pinata upload failed: ${response.status} - ${errorText}`);
  }

  const result: PinataUploadResponse = await response.json();
  console.log(`✅ Uploaded to IPFS via Pinata: ${result.IpfsHash}`);

  return result.IpfsHash;
}

/**
 * Download encrypted vault data from IPFS
 * Uses multiple gateways with fallback
 * NO localStorage - Pure decentralized storage only
 */
export async function downloadFromIPFS(cid: string): Promise<string> {
  // Try each gateway in priority order
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const url = `${gateway.url}/${cid}`;
      console.log(`📥 Attempting download from: ${gateway.url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // 10 second timeout per gateway
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.warn(`Gateway ${gateway.url} returned ${response.status}`);
        continue;
      }

      const data = await response.json();

      if (!data.encrypted) {
        console.warn(`Invalid data format from ${gateway.url}`);
        continue;
      }

      console.log(`✅ Downloaded from ${gateway.url}`);
      return data.encrypted;
    } catch (error) {
      console.warn(`Failed to download from ${gateway.url}:`, error);
      // Continue to next gateway
    }
  }

  throw new Error(`Failed to download CID ${cid} from all IPFS gateways`);
}

/**
 * Check if Pinata is properly configured
 */
export function isPinataConfigured(): boolean {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
  return !!jwt && jwt !== 'your_pinata_jwt_token_here';
}

/**
 * Get current IPFS mode (production vs development)
 */
export function getIPFSMode(): 'production' | 'development' {
  return isPinataConfigured() ? 'production' : 'development';
}

// ============================================================================
// NO FALLBACK - Pure decentralized storage only (Blockchain + IPFS)
// localStorage removed completely for true decentralization
// ============================================================================
