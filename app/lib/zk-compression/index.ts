/**
 * Light Protocol ZK Compression Module
 *
 * Export all ZK compression functionality
 */

export {
  LightClient,
  getLightClient,
  resetLightClient,
  getConnectionFromLightRpc,
  type LightNetwork,
} from './light-client';

export {
  createCompressedVault,
  getCompressedVaults,
  updateCompressedVault,
  deleteCompressedVault,
  hasVault,
  getLatestVault,
  type CompressedVaultAccount,
} from './compressed-vault';
