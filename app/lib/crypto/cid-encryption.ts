/**
 * CID ENCRYPTION MODULE
 *
 * Encrypt/decrypt IPFS CIDs for privacy
 * Even the pointer to encrypted data is hidden on-chain
 */

/**
 * Encrypt CID using wallet-derived key
 */
export async function encryptCID(cid: string, encryptionKey: CryptoKey): Promise<string> {
  // Generate random nonce
  const nonce = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt CID
  const plaintext = new TextEncoder().encode(cid);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce },
    encryptionKey,
    plaintext
  );

  // Combine nonce + ciphertext and encode as base64
  const combined = new Uint8Array(nonce.length + ciphertext.byteLength);
  combined.set(nonce);
  combined.set(new Uint8Array(ciphertext), nonce.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt CID using wallet-derived key
 */
export async function decryptCID(encryptedCid: string, encryptionKey: CryptoKey): Promise<string> {
  try {
    // Safe base64 decode (cross-platform)
    const cleanBase64 = encryptedCid.trim().replace(/-/g, '+').replace(/_/g, '/');
    const binaryString = atob(cleanBase64);
    const combined = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      combined[i] = binaryString.charCodeAt(i);
    }

    // Extract nonce and ciphertext
    const nonce = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    // Decrypt
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: nonce },
      encryptionKey,
      ciphertext
    );

    return new TextDecoder().decode(plaintext);
  } catch (error) {
    throw new Error(`Failed to decrypt CID: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
