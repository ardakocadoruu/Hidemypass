/**
 * Light Protocol ZK Compression API Route
 * 
 * This API handles Light Protocol operations server-side.
 * The SDK works properly in Node.js environment.
 * 
 * Security:
 * - Client encrypts data (encryption keys stay client-side)
 * - Client signs transactions (wallet keys never sent to server)
 * - Server only prepares unsigned transactions
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    createRpc,
    LightSystemProgram,
    buildTx,
    selectStateTreeInfo,
    Rpc,
} from '@lightprotocol/stateless.js';
import { PublicKey, ComputeBudgetProgram, TransactionInstruction } from '@solana/web3.js';

// Helius RPC with ZK Compression support
const HELIUS_RPC = `https://devnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, walletAddress, publicKey: pubKeyStr, cid } = body;

        const walletAddr = walletAddress || pubKeyStr;

        if (!walletAddr) {
            return NextResponse.json(
                { error: 'Missing walletAddress or publicKey' },
                { status: 400 }
            );
        }

        const publicKey = new PublicKey(walletAddr);

        console.log('📦 Light Protocol API called');
        console.log('📍 Action:', action);
        console.log('👛 Wallet:', walletAddr);

        // Create Light Protocol RPC connection
        const rpc: Rpc = createRpc(HELIUS_RPC, HELIUS_RPC);

        if (action === 'prepare-compress') {
            // Prepare a compress transaction for the client to sign
            return await prepareCompressTransaction(rpc, publicKey, cid);
        } else if (action === 'get-state-trees') {
            // Get available state trees
            return await getStateTrees(rpc);
        } else if (action === 'read') {
            // Read compressed account and extract CID
            return await readCompressedVault(rpc, publicKey);
        } else {
            return NextResponse.json(
                { error: 'Unknown action. Use: prepare-compress, get-state-trees, read' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('❌ Light Protocol API error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Internal server error',
                details: error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

/**
 * Prepare an unsigned compress transaction for the client to sign
 */
async function prepareCompressTransaction(
    rpc: Rpc,
    publicKey: PublicKey,
    cid: string | undefined
) {
    console.log('🔨 Preparing compress transaction...');

    try {
        // Get state tree info
        console.log('📡 Fetching state trees...');
        const stateTrees = await rpc.getStateTreeInfos();

        if (!stateTrees || stateTrees.length === 0) {
            throw new Error('No state trees available');
        }

        const stateTreeInfo = selectStateTreeInfo(stateTrees);
        console.log('✅ State tree selected:', stateTreeInfo.tree.toBase58());

        // Create compress instruction
        // Using 5000 lamports as a marker (very cheap: ~$0.0005)
        const compressInstruction = await LightSystemProgram.compress({
            payer: publicKey,
            toAddress: publicKey,
            lamports: 5000,
            outputStateTreeInfo: stateTreeInfo,
        });

        // Add compute budget
        const computeBudgetIx = ComputeBudgetProgram.setComputeUnitLimit({
            units: 1_000_000,
        });

        // Create memo instruction with CID (Solana native memo program)
        const instructions = [computeBudgetIx, compressInstruction];

        if (cid) {
            const memoInstruction = new TransactionInstruction({
                keys: [],
                programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
                data: Buffer.from(`HideMyPass-Encrypted:${cid}`, 'utf-8'),
            });
            instructions.push(memoInstruction);
            console.log('📝 Added memo with ENCRYPTED CID (privacy protected)');
        }

        // Get latest blockhash
        const { blockhash, lastValidBlockHeight } = await rpc.getLatestBlockhash();

        // Build unsigned transaction with memo
        const tx = buildTx(
            instructions,
            publicKey,
            blockhash
        );

        // Serialize the transaction for the client
        const serializedTx = Buffer.from(tx.serialize()).toString('base64');

        console.log('✅ Transaction prepared successfully');

        return NextResponse.json({
            success: true,
            transaction: serializedTx,
            blockhash,
            lastValidBlockHeight,
            stateTree: stateTreeInfo.tree.toBase58(),
            cid: cid || null,
        });
    } catch (error) {
        console.error('❌ Failed to prepare transaction:', error);
        throw error;
    }
}

/**
 * Read compressed vault data (CID from transaction signatures)
 */
async function readCompressedVault(rpc: Rpc, publicKey: PublicKey) {
    console.log('📖 Reading compressed vault for:', publicKey.toBase58());

    try {
        // Get recent transaction signatures for this wallet
        const signatures = await rpc.getSignaturesForAddress(publicKey, { limit: 10 });

        console.log('📦 Found signatures:', signatures?.length || 0);

        if (!signatures || signatures.length === 0) {
            return NextResponse.json({
                success: true,
                cid: null,
                message: 'No vault found on blockchain',
            });
        }

        // Search transactions for memo with CID
        for (const sigInfo of signatures) {
            try {
                const tx = await rpc.getTransaction(sigInfo.signature, {
                    maxSupportedTransactionVersion: 0,
                });

                if (tx?.meta?.logMessages) {
                    // Look for encrypted CID in memo
                    for (const log of tx.meta.logMessages) {
                        if (log.includes('HideMyPass-Encrypted:')) {
                            const encryptedCid = log.split('HideMyPass-Encrypted:')[1].trim();
                            console.log('✅ Found ENCRYPTED CID in memo (privacy protected)');

                            return NextResponse.json({
                                success: true,
                                cid: encryptedCid, // Return encrypted CID
                                signature: sigInfo.signature,
                            });
                        }
                    }
                }
            } catch (txError) {
                console.log('⚠️ Failed to parse transaction:', txError);
                continue;
            }
        }

        console.log('⚠️ No CID found in recent transactions');
        return NextResponse.json({
            success: true,
            cid: null,
            message: 'No vault found on blockchain',
        });
    } catch (error) {
        console.error('❌ Failed to read compressed vault:', error);
        return NextResponse.json({
            success: false,
            cid: null,
            error: error instanceof Error ? error.message : 'Failed to read vault',
        });
    }
}

/**
 * Get available state trees
 */
async function getStateTrees(rpc: Rpc) {
    console.log('📡 Fetching state trees...');

    try {
        const stateTrees = await rpc.getStateTreeInfos();

        return NextResponse.json({
            success: true,
            stateTrees: stateTrees.map((tree: any) => ({
                tree: tree.tree.toBase58(),
                queue: tree.queue.toBase58(),
            })),
            count: stateTrees.length,
        });
    } catch (error) {
        console.error('❌ Failed to get state trees:', error);
        throw error;
    }
}

export async function GET() {
    return NextResponse.json({
        name: 'Light Protocol ZK Compression API',
        version: '1.0.0',
        description: 'Backend API for Light Protocol ZK Compression operations',
        endpoints: {
            POST: {
                actions: {
                    'prepare-compress': {
                        description: 'Prepare unsigned compress transaction',
                        body: {
                            action: 'prepare-compress',
                            walletAddress: 'User wallet public key',
                            cid: 'Optional IPFS CID to associate with compressed account',
                        }
                    },
                    'get-state-trees': {
                        description: 'Get available state trees',
                        body: {
                            action: 'get-state-trees',
                            walletAddress: 'User wallet public key',
                        }
                    }
                }
            }
        }
    });
}
