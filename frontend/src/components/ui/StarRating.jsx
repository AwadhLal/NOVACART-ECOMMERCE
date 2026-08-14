import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, max = 5, size = 'sm' }) {
  const px = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= Math.floor(rating);
        const half = !filled && i + 0.5 < rating;
        return (
          <Star
            key={i}
            className={`${px} ${filled || half ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          />
        );
      })}
      <span className="ml-1 text-xs text-gray-500 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}
