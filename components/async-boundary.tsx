'use client';

import { useEffect, useState } from 'react';

interface AsyncBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
  isLoading?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export function AsyncBoundary({
  children,
  fallback = <div>Loading...</div>,
  onError,
  isLoading,
  errorMessage,
  onRetry,
}: AsyncBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (isLoading) {
    return fallback;
  }

  if (error || errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        <p>Something went wrong: {errorMessage || error?.message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

// Add a default export
export default AsyncBoundary; 