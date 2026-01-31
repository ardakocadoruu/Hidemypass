/**
 * Health Check API Endpoint
 * Used by Docker healthcheck and monitoring systems
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check - server is responsive
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'unknown',
    };

    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    // If any error occurs, return unhealthy status
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
