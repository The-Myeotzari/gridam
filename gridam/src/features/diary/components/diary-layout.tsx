import Image from 'next/image'

type DiaryLayoutProps = {
  date: string
  weatherIcon: string | React.ReactNode
  children: React.ReactNode
}

export default function DiaryLayout({ date, weatherIcon, children }: DiaryLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto border-2 border-black bg-(--color-cream-white)">
      <div className="flex items-center justify-between p-5 border-b border-black">
        <div className="font-bold text-md sm:text-xl">{date}</div>

        {weatherIcon && (
          <div className="flex items-center leading-9 gap-2">
            <span className="font-bold text-md hidden sm:block">날씨</span>
            {typeof weatherIcon === 'string' ? (
              <Image
                src={weatherIcon}
                alt="weather icon"
                width={36}
                height={36}
                className="w-9 h-9"
              />
            ) : (
              weatherIcon
            )}
          </div>
        )}
      </div>

      {children}
    </div>
  )
}
