'use client'

import { API_ENDPOINTS } from '@/shared/constants/api.endpoints'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocsPage() {
  return <SwaggerUI url={API_ENDPOINTS.OPENAPI.BASE} />
}
