import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="mt-20 flex justify-center">
        <h1 className="font-sans font-bold text-2xl sm:text-4xl lg:text-5xl">404 Not Found</h1>
        <h1 className="hidden sm:block sm:text-4xl lg:text-5xl">😢</h1>
      </div>

      <div className="mb-20 flex flex-1 flex-col gap-10 items-center justify-center">
        <p className="text-sm sm:text-base lg:text-lg">페이지를 찾을 수 없습니다.</p>
        <Link className="text-xs sm:text-sm lg:text-base text-[#006699] hover:underline" href="/">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
