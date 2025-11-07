import { swaggerSpec } from '@/lib/swagger'
import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json(swaggerSpec)
}
