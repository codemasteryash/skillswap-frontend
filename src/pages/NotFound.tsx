import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404 route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 gradient-dark opacity-95" />
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-2xl rounded-2xl border border-border/40 bg-card/80 p-10 text-center backdrop-blur-md">
          <SearchX className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h1 className="mb-2 text-5xl font-bold text-foreground">404</h1>
          <p className="mb-2 text-xl font-semibold text-foreground">Page not found</p>
          <p className="mb-8 text-muted-foreground">
            No route matches <span className="font-medium text-foreground">{location.pathname}</span>
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/">
              <Button className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Go to Landing
              </Button>
            </Link>
            <button onClick={() => window.history.back()}>
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;