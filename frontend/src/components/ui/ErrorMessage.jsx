import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="h-14 w-14 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-500 mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      )}
    </div>
  );
}
