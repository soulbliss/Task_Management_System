'use client';

import { useEffect, useState } from 'react';

interface AsyncBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

export default function AsyncBoundary({
  children,
  fallback = <div>Loading...</div>,
  onError,
}: AsyncBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500">
        <p>Something went wrong: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      {children}
    </div>
  );
} 