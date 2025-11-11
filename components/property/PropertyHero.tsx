interface PropertyHeroProps {
  name: string;
  location: string;
  imageUrl?: string;
  avgRating: number;
  reviewCount: number;
}

export function PropertyHero({ name, location, imageUrl, avgRating, reviewCount }: PropertyHeroProps) {
  return (
    <div className="relative h-[60vh] min-h-[500px] bg-gradient-to-br from-teal-100 to-blue-100">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <svg className="w-32 h-32 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">{name}</h1>
          <div className="flex items-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </div>
            {reviewCount > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 fill-current text-yellow-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span>{avgRating.toFixed(1)}</span>
                  <span className="opacity-80">({reviewCount} reviews)</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

