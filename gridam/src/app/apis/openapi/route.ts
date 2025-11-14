import swaggerSpec from '@/app/api-docs/swagger.json'
import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json(swaggerSpec)
}
