import { NextRequest, NextResponse } from 'next/server'
import manifest from '@/app/manifest'

export async function GET(request: NextRequest) {
  const manifestData = manifest()
  return NextResponse.json(manifestData, {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  })
}

