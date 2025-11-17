import Image from 'next/image'

type DiaryLayoutProps = {
  date: string
  weatherIcon: string | React.ReactNode
  children: React.ReactNode
}

export default function DiaryLayout({ date, weatherIcon, children }: DiaryLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto border-2 border-black bg-(--color-cream-white)">
      <section className="flex items-center justify-between p-5 border-b border-black">
        <div className="font-bold text-md sm:text-xl">{date}</div>

        <section className="flex items-center leading-9 gap-2">
          {typeof weatherIcon === 'string' ? (
            <Image src={weatherIcon} alt="weather icon" width={36} height={36} />
          ) : (
            weatherIcon
          )}
        </section>
      </section>

      {children}
    </div>
  )
}
