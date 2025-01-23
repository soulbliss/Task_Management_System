'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface AsyncBoundaryProps {
  children: ReactNode;
  errorMessage?: string;
  onRetry?: () => void;
  isLoading?: boolean;
  loadingMessage?: string;
}

export function AsyncBoundary({
  children,
  errorMessage = 'Failed to load data',
  onRetry,
  isLoading,
  loadingMessage = 'Loading...',
}: AsyncBoundaryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">{loadingMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (errorMessage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="mr-2 h-5 w-5" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        </CardContent>
        {onRetry && (
          <CardFooter>
            <Button onClick={onRetry} variant="outline" size="sm">
              Try again
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }

  return <>{children}</>;
} 