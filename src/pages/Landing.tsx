import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight,
  Zap,
  CreditCard,
  BarChart3,
  Bell,
  Users,
  RefreshCw,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fetchPublicStats, type PublicStats } from "@/services/publicStatsService";

const features = [
  {
    icon: CreditCard,
    title: "Credit Economy",
    description:
      "Earn time credits by teaching your skills and spend them to learn from others.",
  },
  {
    icon: RefreshCw,
    title: "Skill Exchange",
    description:
      "Seamlessly swap skills with community members through a fair credit system.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Analytics",
    description:
      "Track your transactions, credits, and activity with an intuitive dashboard.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Stay updated with real-time notifications for requests and completions.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Account",
    description: "Sign up and set up your skill profile",
  },
  {
    step: "02",
    title: "List Your Skills",
    description: "Add skills you can teach to others",
  },
  {
    step: "03",
    title: "Exchange & Earn",
    description: "Teach, learn, and earn time credits",
  },
];

const faqs = [
  {
    q: "What are time credits?",
    a: "Credits represent teaching time you earn when you help others learn a skill. You can spend them when someone teaches you.",
  },
  {
    q: "Is SkillSwap free to join?",
    a: "Yes. Create an account and start participating in the credit economy with the community.",
  },
  {
    q: "How do I track my activity?",
    a: "After you sign in, your dashboard shows balances, recent transactions, and notifications.",
  },
];

const DEFAULT_STATS: PublicStats = {
  userCount: 10000,
  transactionCount: 50000,
  creditsVolume: 100000,
};

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 10_000) return `${Math.round(n / 1000)}K+`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1)}K+`;
  return `${n}`;
}

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPublicStats();
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setStats(DEFAULT_STATS);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToId = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const displayStats = stats ?? DEFAULT_STATS;
  const statItems = [
    { value: displayStats.userCount, label: "Users" },
    { value: displayStats.transactionCount, label: "Skill exchanges" },
    { value: displayStats.creditsVolume, label: "Credits in motion" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SkillSwap</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <button
              type="button"
              onClick={() => scrollToId("features")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToId("how-it-works")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => scrollToId("faq")}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              className="rounded-lg p-2 md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </button>
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button>
                  Dashboard <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div className="hidden items-center gap-2 sm:flex sm:gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Get Started <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-background px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => scrollToId("features")}
              >
                Features
              </button>
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => scrollToId("how-it-works")}
              >
                How it works
              </button>
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => scrollToId("faq")}
              >
                FAQ
              </button>
              {!isAuthenticated && (
                <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button size="lg" className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        <div className="absolute inset-0 gradient-dark opacity-95" />
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground/80">
              <Zap className="h-4 w-4 text-primary" />
              Time Credit Based Exchange
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Exchange Skills,{" "}
              <span className="text-primary">Grow Together</span>
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-primary-foreground/60 sm:text-xl">
              Join a community where your skills are currency. Teach what you know, learn what you
              need — powered by a fair time-credit economy.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/register">
                <Button size="lg" className="h-12 px-8 text-base">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-center sm:gap-12">
            {statItems.map((stat) => (
              <div key={stat.label} className="min-w-[120px]">
                <div
                  className={`text-2xl font-bold text-primary transition-opacity ${statsLoading ? "animate-pulse opacity-70" : ""
                    }`}
                >
                  {statsLoading ? "—" : formatStat(stat.value)}
                </div>
                <div className="text-sm text-primary-foreground/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need to Trade Skills
            </h2>
            <p className="text-lg text-muted-foreground">
              A complete platform built around fairness, transparency, and community growth.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group cursor-default rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">How It Works</h2>
            <p className="text-lg text-muted-foreground">Get started in three simple steps.</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {step.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 py-24">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">FAQ</h2>
            <p className="text-muted-foreground">Quick answers before you dive in.</p>
          </div>
          <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-4">
            {faqs.map((item, idx) => (
              <AccordionItem key={item.q} value={`item-${idx}`}>
                <AccordionTrigger className="text-left text-foreground">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-2xl gradient-primary p-12 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-primary-foreground/80" />
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground">Ready to Start Swapping?</h2>
            <p className="mb-8 text-primary-foreground/70">
              Join thousands of people already exchanging skills and growing together.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-base">
                Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">SkillSwap</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SkillSwap. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
