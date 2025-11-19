import fs from 'fs'
import path from 'path'

const ROOT = path.join(process.cwd(), 'src')

// TODO: 2차 개발 기간에 구조 개편하면서 개선 필요
// 생성할 폴더 목록
const folders: string[] = [
  // 'app',
  // 'components/common',
  // 'components/ui',
  // 'components/three/object',
  // 'features',
  // 'font',
  // 'hooks',
  // 'providers',
  // 'store',
  // 'types/zod',
  // 'utils',
  // 'lib',
  // 'test/components/three',
  // 'test/features/auth',
  // 'test/hooks',
  // 'test/utils',
]

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`📁 생성됨: ${path.relative(process.cwd(), dirPath)}`)
  }
}

console.log('🚀 Gridam 폴더 구조 체크/생성 중...\n')
folders.forEach((folder) => ensureDir(path.join(ROOT, folder)))
console.log('\n✅ 완료: 기존 항목은 유지, 누락된 폴더만 생성했습니다.')
