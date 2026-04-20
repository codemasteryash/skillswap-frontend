import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, LayoutDashboard, Home, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 gradient-dark opacity-95" />
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground/80">
              <Zap className="h-4 w-4 text-primary" />
              SkillSwap Workspace
            </div>

            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl">
              {isAuthenticated ? `Welcome back, ${user?.name ?? "Learner"}` : "Welcome to SkillSwap"}
            </h1>

            <p className="mb-10 text-lg text-primary-foreground/70 sm:text-xl">
              {isAuthenticated
                ? "Jump into your dashboard, track credits, and continue your exchanges."
                : "Start exchanging skills and growing through the time-credit economy."}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button size="lg" className="h-12 px-8 text-base">
                      Open Dashboard <LayoutDashboard className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 border-primary/30 px-8 text-base text-primary-foreground hover:bg-primary/10"
                    >
                      Landing Page <Home className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="h-12 px-8 text-base">
                      Create Account <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 border-primary/30 px-8 text-base text-primary-foreground hover:bg-primary/10"
                    >
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;