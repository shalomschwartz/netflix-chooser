import Image from 'next/image'
import { WatchmodeTitle } from '@/lib/watchmode'

export default function MediaCard({ item }: { item: WatchmodeTitle }) {
  const year = item.year?.toString() ?? ''
  const rating = item.user_rating ? item.user_rating.toFixed(1) : null

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-200">
      {item.poster ? (
        <div className="relative aspect-[2/3]">
          <Image
            src={item.poster}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        </div>
      ) : (
        <div className="aspect-[2/3] bg-gray-800 flex items-center justify-center text-gray-600 text-xs text-center px-2">
          No image
        </div>
      )}
      <div className="p-3">
        <h3 className="font-medium text-sm leading-tight line-clamp-2">{item.name}</h3>
        <div className="flex items-center justify-between mt-1.5 text-xs text-gray-400">
          <span>{year}</span>
          {rating && <span className="text-yellow-400">★ {rating}</span>}
        </div>
      </div>
    </div>
  )
}
