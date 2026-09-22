import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <AlertCircle className="h-8 w-8 text-accent" />
          <h1 className="font-display text-2xl font-semibold text-primary">
            404 Page Not Found
          </h1>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
        >
          Return home
        </a>
      </div>
    </div>
  );
}