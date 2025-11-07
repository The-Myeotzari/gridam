import swaggerJSDoc from 'swagger-jsdoc'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '그리담 API 문서',
      version: '1.0.0',
      description: '그리담 API 문서',
    },
    servers: [{ url: process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3000' }],
  },
  apis: ['src/app/api/**/*.ts'],
}

export const swaggerSpec = swaggerJSDoc(options)
