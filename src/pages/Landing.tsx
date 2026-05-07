// import { useCallback, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import {
//   ArrowRight,
//   Zap,
//   CreditCard,
//   BarChart3,
//   Bell,
//   Users,
//   RefreshCw,
//   ChevronRight,
//   Menu,
//   X,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { fetchPublicStats, type PublicStats } from "@/services/publicStatsService";

// const features = [
//   {
//     icon: CreditCard,
//     title: "Credit Economy",
//     description:
//       "Earn time credits by teaching your skills and spend them to learn from others.",
//   },
//   {
//     icon: RefreshCw,
//     title: "Skill Exchange",
//     description:
//       "Seamlessly swap skills with community members through a fair credit system.",
//   },
//   {
//     icon: BarChart3,
//     title: "Dashboard Analytics",
//     description:
//       "Track your transactions, credits, and activity with an intuitive dashboard.",
//   },
//   {
//     icon: Bell,
//     title: "Smart Notifications",
//     description:
//       "Stay updated with real-time notifications for requests and completions.",
//   },
// ];

// const steps = [
//   { step: "01", title: "Create Account", description: "Sign up and set up your skill profile" },
//   { step: "02", title: "List Your Skills", description: "Add skills you can teach to others" },
//   { step: "03", title: "Exchange & Earn", description: "Teach, learn, and earn time credits" },
// ];

// const faqs = [
//   {
//     q: "What are time credits?",
//     a: "Credits represent teaching time you earn when you help others learn a skill. You can spend them when someone teaches you.",
//   },
//   {
//     q: "Is SkillSwap free to join?",
//     a: "Yes. Create an account and start participating in the credit economy with the community.",
//   },
//   {
//     q: "How do I track my activity?",
//     a: "After you sign in, your dashboard shows balances, recent transactions, and notifications.",
//   },
// ];

// const DEFAULT_STATS: PublicStats = {
//   userCount: 10000,
//   transactionCount: 50000,
//   creditsVolume: 100000,
// };

// function formatStat(n: number): string {
//   if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
//   if (n >= 10_000) return `${Math.round(n / 1000)}K+`;
//   if (n >= 1_000) return `${(n / 1000).toFixed(1)}K+`;
//   return `${n}`;
// }

// const Landing = () => {
//   const { isAuthenticated } = useAuth();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [stats, setStats] = useState<PublicStats | null>(null);
//   const [statsLoading, setStatsLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const data = await fetchPublicStats();
//         if (!cancelled) setStats(data);
//       } catch {
//         if (!cancelled) setStats(DEFAULT_STATS);
//       } finally {
//         if (!cancelled) setStatsLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const scrollToId = useCallback((id: string) => {
//     setMobileOpen(false);
//     const el = document.getElementById(id);
//     el?.scrollIntoView({ behavior: "smooth", block: "start" });
//   }, []);

//   const displayStats = stats ?? DEFAULT_STATS;
//   const statItems = [
//     { value: displayStats.userCount, label: "Users" },
//     { value: displayStats.transactionCount, label: "Skill exchanges" },
//     { value: displayStats.creditsVolume, label: "Credits in motion" },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
//         <div className="container mx-auto flex h-16 items-center justify-between px-4">
//           <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
//               <Zap className="h-5 w-5 text-primary-foreground" />
//             </div>
//             <span className="text-xl font-bold text-foreground">SkillSwap</span>
//           </Link>

//           <div className="hidden items-center gap-8 md:flex">
//             <button
//               type="button"
//               onClick={() => scrollToId("features")}
//               className="text-sm text-muted-foreground transition-colors hover:text-foreground"
//             >
//               Features
//             </button>
//             <button
//               type="button"
//               onClick={() => scrollToId("how-it-works")}
//               className="text-sm text-muted-foreground transition-colors hover:text-foreground"
//             >
//               How it works
//             </button>
//             <button
//               type="button"
//               onClick={() => scrollToId("faq")}
//               className="text-sm text-muted-foreground transition-colors hover:text-foreground"
//             >
//               FAQ
//             </button>
//           </div>

//           <div className="flex items-center gap-2 md:gap-3">
//             <button
//               type="button"
//               className="rounded-lg p-2 md:hidden"
//               aria-label={mobileOpen ? "Close menu" : "Open menu"}
//               onClick={() => setMobileOpen((o) => !o)}
//             >
//               {mobileOpen ? (
//                 <X className="h-5 w-5 text-foreground" />
//               ) : (
//                 <Menu className="h-5 w-5 text-foreground" />
//               )}
//             </button>

//             {isAuthenticated ? (
//               <div className="hidden items-center gap-2 sm:flex">
//                 <Link to="/exchange">
//                   <Button variant="outline" size="sm">Exchange</Button>
//                 </Link>
//                 <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
//                   <Button>
//                     Dashboard <ChevronRight className="ml-1 h-4 w-4" />
//                   </Button>
//                 </Link>
//               </div>
//             ) : (
//               <div className="hidden items-center gap-2 sm:flex sm:gap-3">
//                 <Link to="/login">
//                   <Button variant="ghost" size="sm">Login</Button>
//                 </Link>
//                 <Link to="/register">
//                   <Button size="sm">
//                     Get Started <ArrowRight className="ml-1 h-4 w-4" />
//                   </Button>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>

//         {mobileOpen && (
//           <div className="border-t border-border bg-background px-4 py-4 md:hidden">
//             <div className="flex flex-col gap-2">
//               <button
//                 type="button"
//                 className="rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
//                 onClick={() => scrollToId("features")}
//               >
//                 Features
//               </button>
//               <button
//                 type="button"
//                 className="rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
//                 onClick={() => scrollToId("how-it-works")}
//               >
//                 How it works
//               </button>
//               <button
//                 type="button"
//                 className="rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
//                 onClick={() => scrollToId("faq")}
//               >
//                 FAQ
//               </button>

//               {isAuthenticated ? (
//                 <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
//                   <Link to="/exchange" onClick={() => setMobileOpen(false)}>
//                     <Button variant="outline" className="w-full">Go to Exchange</Button>
//                   </Link>
//                   <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
//                     <Button className="w-full">Go to Dashboard</Button>
//                   </Link>
//                 </div>
//               ) : (
//                 <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
//                   <Link to="/login" onClick={() => setMobileOpen(false)}>
//                     <Button className="w-full">Login</Button>
//                   </Link>
//                   <Link to="/register" onClick={() => setMobileOpen(false)}>
//                     <Button className="w-full">Get Started</Button>
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </nav>

//       <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
//         <div className="absolute inset-0 gradient-dark opacity-95" />
//         <div className="absolute inset-0">
//           <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
//           <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
//         </div>
//         <div className="container relative z-10 mx-auto px-4 py-20">
//           <div className="mx-auto max-w-3xl text-center">
//             <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground/80">
//               <Zap className="h-4 w-4 text-primary" />
//               Time Credit Based Exchange
//             </div>
//             <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
//               Exchange Skills, <span className="text-primary">Grow Together</span>
//             </h1>
//             <p className="mb-10 text-lg leading-relaxed text-primary-foreground/60 sm:text-xl">
//               Join a community where your skills are currency. Teach what you know,
//               learn what you need - powered by a fair time-credit economy.
//             </p>
//             <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
//               {isAuthenticated ? (
//                 <>
//                   <Link to="/exchange">
//                     <Button size="lg" className="h-12 px-8 text-base">
//                       Start Exchange <ArrowRight className="ml-2 h-5 w-5" />
//                     </Button>
//                   </Link>
//                   <Link to="/dashboard">
//                     <Button variant="outline" size="lg" className="h-12 px-8 text-base">
//                       Open Dashboard
//                     </Button>
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/register">
//                     <Button size="lg" className="h-12 px-8 text-base">
//                       Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
//                     </Button>
//                   </Link>
//                   <Link to="/login">
//                     <Button size="lg" className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
//                       Login
//                     </Button>
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="mt-16 flex flex-wrap justify-center gap-8 text-center sm:gap-12">
//             {statItems.map((stat) => (
//               <div key={stat.label} className="min-w-[120px]">
//                 <div className={`text-2xl font-bold text-primary transition-opacity ${statsLoading ? "animate-pulse opacity-70" : ""}`}>
//                   {statsLoading ? "-" : formatStat(stat.value)}
//                 </div>
//                 <div className="text-sm text-primary-foreground/50">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section id="features" className="scroll-mt-24 py-24">
//         <div className="container mx-auto px-4">
//           <div className="mx-auto mb-16 max-w-2xl text-center">
//             <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Everything You Need to Trade Skills</h2>
//             <p className="text-lg text-muted-foreground">A complete platform built around fairness, transparency, and community growth.</p>
//           </div>
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//             {features.map((feature, i) => (
//               <div key={feature.title} className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg" style={{ animationDelay: `${i * 100}ms` }}>
//                 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
//                   <feature.icon className="h-6 w-6 text-primary" />
//                 </div>
//                 <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
//                 <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section id="how-it-works" className="scroll-mt-24 bg-muted/50 py-24">
//         <div className="container mx-auto px-4">
//           <div className="mx-auto mb-16 max-w-2xl text-center">
//             <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">How It Works</h2>
//             <p className="text-lg text-muted-foreground">Get started in three simple steps.</p>
//           </div>
//           <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
//             {steps.map((step) => (
//               <div key={step.step} className="text-center">
//                 <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">{step.step}</div>
//                 <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
//                 <p className="text-sm text-muted-foreground">{step.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section id="faq" className="scroll-mt-24 py-24">
//         <div className="container mx-auto max-w-2xl px-4">
//           <div className="mb-10 text-center">
//             <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">FAQ</h2>
//             <p className="text-muted-foreground">Quick answers before you dive in.</p>
//           </div>
//           <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-4">
//             {faqs.map((item, idx) => (
//               <AccordionItem key={item.q} value={`item-${idx}`}>
//                 <AccordionTrigger className="text-left text-foreground">{item.q}</AccordionTrigger>
//                 <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
//               </AccordionItem>
//             ))}
//           </Accordion>
//         </div>
//       </section>

//       <section className="py-24">
//         <div className="container mx-auto px-4">
//           <div className="mx-auto max-w-2xl rounded-2xl gradient-primary p-12 text-center">
//             <Users className="mx-auto mb-4 h-12 w-12 text-primary-foreground/80" />
//             <h2 className="mb-4 text-3xl font-bold text-primary-foreground">Ready to Start Swapping?</h2>
//             <p className="mb-8 text-primary-foreground/70">Join thousands of people already exchanging skills and growing together.</p>
//             <Link to={isAuthenticated ? "/exchange" : "/register"}>
//               <Button size="lg" variant="secondary" className="h-12 px-8 text-base">
//                 {isAuthenticated ? "Go to Exchange" : "Create Free Account"} <ArrowRight className="ml-2 h-5 w-5" />
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </section>

//       <footer className="border-t border-border bg-muted/30 py-12">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
//             <div className="flex items-center gap-2">
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
//                 <Zap className="h-4 w-4 text-primary-foreground" />
//               </div>
//               <span className="font-semibold text-foreground">SkillSwap</span>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Copyright {new Date().getFullYear()} SkillSwap. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Landing;

import { useCallback, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight, Zap, CreditCard, BarChart3, Bell,
  Users, RefreshCw, ChevronRight, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { fetchPublicStats, type PublicStats } from "@/services/publicStatsService";

/* ── Font loader ── */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
};

/* ── Design tokens ── */
const G = {
  bg:         "#090f0d",
  bgMid:      "#0d1210",
  card:       "rgba(255,255,255,0.03)",
  cardHover:  "rgba(255,255,255,0.055)",
  cardBorder: "rgba(255,255,255,0.07)",
  green:      "#4ADE80",
  greenDeep:  "#16A34A",
  greenDark:  "#052e10",
  ga:         (o: number) => `rgba(74,222,128,${o})`,
  text:       "#ffffff",
  textMuted:  "rgba(255,255,255,0.4)",
  textSub:    "rgba(255,255,255,0.22)",
  serif:      "'Instrument Serif', serif",
  sans:       "'Syne', sans-serif",
};

/* ── Static data ── */
const features = [
  { icon: CreditCard, title: "Credit Economy",        description: "Earn time credits by teaching your skills and spend them to learn from others." },
  { icon: RefreshCw,  title: "Skill Exchange",         description: "Seamlessly swap skills with community members through a fair credit system." },
  { icon: BarChart3,  title: "Dashboard Analytics",    description: "Track your transactions, credits, and activity with an intuitive dashboard." },
  { icon: Bell,       title: "Smart Notifications",    description: "Stay updated with real-time notifications for requests and completions." },
];

const steps = [
  { step: "01", title: "Create Account",   description: "Sign up and set up your skill profile" },
  { step: "02", title: "List Your Skills", description: "Add skills you can teach to others" },
  { step: "03", title: "Exchange & Earn",  description: "Teach, learn, and earn time credits" },
];

const faqs = [
  { q: "What are time credits?",    a: "Credits represent teaching time you earn when you help others learn a skill. You can spend them when someone teaches you." },
  { q: "Is SkillSwap free to join?", a: "Yes. Create an account and start participating in the credit economy with the community." },
  { q: "How do I track my activity?", a: "After you sign in, your dashboard shows balances, recent transactions, and notifications." },
];

const DEFAULT_STATS: PublicStats = { userCount: 10000, transactionCount: 50000, creditsVolume: 100000 };

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 10_000)    return `${Math.round(n / 1000)}K+`;
  if (n >= 1_000)     return `${(n / 1000).toFixed(1)}K+`;
  return `${n}`;
}

/* ── Animated orb ── */
function Orb({ x, y, size, opacity }: { x: string; y: string; size: number; opacity: number }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size, borderRadius: "50%",
      background: `radial-gradient(circle, ${G.ga(opacity)} 0%, transparent 70%)`,
      filter: "blur(40px)", pointerEvents: "none",
    }} />
  );
}

/* ── Pill badge ── */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 14px", borderRadius: 999,
      border: `1px solid ${G.ga(0.25)}`,
      background: G.ga(0.07),
      fontFamily: G.sans, fontSize: 12, fontWeight: 600,
      color: G.green, letterSpacing: "0.04em",
    }}>
      {children}
    </div>
  );
}

/* ── Primary CTA button ── */
function GreenBtn({ children, onClick, style = {} }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "12px 28px", borderRadius: 12, border: "none", cursor: "pointer",
        background: hov
          ? `linear-gradient(135deg, #5BEF91, ${G.greenDeep})`
          : `linear-gradient(135deg, ${G.green}, ${G.greenDeep})`,
        color: G.greenDark, fontFamily: G.sans, fontSize: 14, fontWeight: 700,
        letterSpacing: "0.02em",
        boxShadow: hov ? `0 8px 32px ${G.ga(0.4)}` : `0 4px 16px ${G.ga(0.2)}`,
        transition: "all 0.25s",
        ...style,
      }}
    >{children}</button>
  );
}

/* ── Ghost button ── */
function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "12px 28px", borderRadius: 12, cursor: "pointer",
        background: hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hov ? G.ga(0.3) : G.cardBorder}`,
        color: hov ? G.text : G.textMuted,
        fontFamily: G.sans, fontSize: 14, fontWeight: 600,
        transition: "all 0.25s",
      }}
    >{children}</button>
  );
}

/* ── Feature card ── */
function FeatureCard({ icon: Icon, title, description, delay }: {
  icon: React.FC<any>; title: string; description: string; delay: number;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "28px", borderRadius: 18, cursor: "default",
        background: hov ? G.cardHover : G.card,
        border: `1px solid ${hov ? G.ga(0.2) : G.cardBorder}`,
        backdropFilter: "blur(16px)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? `0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px ${G.ga(0.1)}` : "none",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        animationDelay: `${delay}ms`,
        position: "relative", overflow: "hidden",
      }}
    >
      {hov && (
        <div style={{
          position: "absolute", top: -30, right: -30,
          width: 100, height: 100, borderRadius: "50%",
          background: `radial-gradient(circle, ${G.ga(0.15)} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
      )}
      <div style={{
        width: 44, height: 44, borderRadius: 12, marginBottom: 18,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: hov ? G.ga(0.15) : G.ga(0.08),
        color: G.green, transition: "all 0.3s",
      }}>
        <Icon size={20} />
      </div>
      <h3 style={{ fontFamily: G.serif, fontSize: 18, color: G.text, margin: "0 0 8px", fontWeight: 400 }}>
        {title}
      </h3>
      <p style={{ fontFamily: G.sans, fontSize: 13, color: G.textMuted, margin: 0, lineHeight: 1.7 }}>
        {description}
      </p>
    </div>
  );
}

/* ── Step card ── */
function StepCard({ step, title, description, last }: {
  step: string; title: string; description: string; last: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      {/* connector */}
      {!last && (
        <div style={{
          position: "absolute", top: 28, left: "calc(50% + 28px)",
          right: "calc(-50% + 28px)", height: 1,
          background: `linear-gradient(90deg, ${G.ga(0.4)}, ${G.ga(0.1)})`,
          display: "none",
        }} className="step-connector" />
      )}
      <div style={{
        width: 56, height: 56, borderRadius: "50%", marginBottom: 20,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(135deg, ${G.green}, ${G.greenDeep})`,
        color: G.greenDark, fontFamily: G.serif, fontSize: 20, fontWeight: 400,
        boxShadow: `0 0 0 8px ${G.ga(0.08)}, 0 8px 24px ${G.ga(0.3)}`,
        flexShrink: 0,
      }}>
        {step}
      </div>
      <h3 style={{ fontFamily: G.serif, fontSize: 18, color: G.text, margin: "0 0 6px", fontWeight: 400 }}>
        {title}
      </h3>
      <p style={{ fontFamily: G.sans, fontSize: 13, color: G.textMuted, margin: 0, lineHeight: 1.7, textAlign: "center" }}>
        {description}
      </p>
    </div>
  );
}

/* ── Stat block ── */
function StatBlock({ value, label, loading }: { value: number; label: string; loading: boolean }) {
  return (
    <div style={{
      textAlign: "center", padding: "20px 32px",
      background: G.ga(0.05),
      border: `1px solid ${G.ga(0.12)}`,
      borderRadius: 16, backdropFilter: "blur(12px)",
      minWidth: 140,
    }}>
      <p style={{
        fontFamily: G.serif, fontSize: 36, color: G.green, margin: "0 0 4px", lineHeight: 1,
        opacity: loading ? 0.5 : 1, transition: "opacity 0.3s",
      }}>
        {loading ? "—" : formatStat(value)}
      </p>
      <p style={{ fontFamily: G.sans, fontSize: 11, color: G.textMuted, margin: 0,
        letterSpacing: "0.07em", textTransform: "uppercase" }}>
        {label}
      </p>
    </div>
  );
}

/* ── Scroll-aware nav hook ── */
function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [threshold]);
  return scrolled;
}

/* ══════════════════ MAIN COMPONENT ══════════════════ */
const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const scrolled = useScrolled();

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
    return () => { cancelled = true; };
  }, []);

  const scrollToId = useCallback((id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const displayStats = stats ?? DEFAULT_STATS;
  const statItems = [
    { value: displayStats.userCount,        label: "Users" },
    { value: displayStats.transactionCount, label: "Skill exchanges" },
    { value: displayStats.creditsVolume,    label: "Credits in motion" },
  ];

  /* ── nav link style ── */
  const NavLink = ({ id, label }: { id: string; label: string }) => {
    const [hov, setHov] = useState(false);
    return (
      <button type="button" onClick={() => scrollToId(id)}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: G.sans, fontSize: 13, fontWeight: 500,
          color: hov ? G.green : G.textMuted, transition: "color 0.2s",
          position: "relative", padding: "4px 0",
        }}>
        {label}
        <span style={{
          position: "absolute", bottom: 0, left: 0,
          height: 1, width: hov ? "100%" : "0%",
          background: G.green, transition: "width 0.25s",
        }} />
      </button>
    );
  };

  return (
    <>
      <FontLoader />
      <div style={{ background: G.bg, minHeight: "100vh", fontFamily: G.sans, color: G.text, overflowX: "hidden" }}>

        {/* global spin */}
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes float1 { 0%,100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-20px) scale(1.04); } }
          @keyframes float2 { 0%,100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(16px) scale(0.97); } }
          @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
          @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
          @media(min-width:768px){ .step-connector{display:block!important} }
          @media(min-width:768px){ .lg-flex{display:flex!important} .md-hidden{display:none!important} }
          .nav-link-hover:hover { color: #4ADE80 !important; }
          ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:transparent; }
          ::-webkit-scrollbar-thumb { background:rgba(74,222,128,0.2); border-radius:3px; }
        `}</style>

        {/* ══ NAVBAR ══ */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          height: 64,
          background: scrolled ? "rgba(9,15,13,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? `1px solid ${G.cardBorder}` : "1px solid transparent",
          transition: "all 0.35s",
        }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px",
            height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

            {/* Logo */}
            <Link to="/" onClick={() => setMobileOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `linear-gradient(135deg, ${G.green}, ${G.greenDeep})`,
              }}>
                <Zap size={16} color={G.greenDark} />
              </div>
              <span style={{ fontFamily: G.serif, fontSize: 20, color: G.text, fontWeight: 400 }}>SkillSwap</span>
            </Link>

            {/* Desktop nav links */}
            <div style={{ display: "none", alignItems: "center", gap: 32 }} className="lg-flex">
              <NavLink id="features"    label="Features" />
              <NavLink id="how-it-works" label="How it works" />
              <NavLink id="faq"         label="FAQ" />
            </div>

            {/* Desktop CTA */}
            <div style={{ display: "none", alignItems: "center", gap: 10 }} className="lg-flex">
              {isAuthenticated ? (
                <>
                  <Link to="/exchange" style={{ textDecoration: "none" }}>
                    <GhostBtn>Exchange</GhostBtn>
                  </Link>
                  <Link to="/dashboard" style={{ textDecoration: "none" }}>
                    <GreenBtn>Dashboard <ChevronRight size={14} /></GreenBtn>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <GhostBtn>Login</GhostBtn>
                  </Link>
                  <Link to="/register" style={{ textDecoration: "none" }}>
                    <GreenBtn>Get Started <ArrowRight size={14} /></GreenBtn>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <button type="button"
              onClick={() => setMobileOpen(o => !o)}
              style={{ background: "none", border: `1px solid ${G.cardBorder}`,
                borderRadius: 8, padding: "6px", cursor: "pointer", color: G.textMuted }}
              className="md-hidden">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div style={{
              borderTop: `1px solid ${G.cardBorder}`,
              background: "rgba(9,15,13,0.97)", backdropFilter: "blur(24px)",
              padding: "16px 24px 20px",
            }}>
              {["features", "how-it-works", "faq"].map((id, i) => (
                <button key={id} type="button"
                  onClick={() => scrollToId(id)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "11px 12px", borderRadius: 10, border: "none",
                    background: "none", cursor: "pointer",
                    fontFamily: G.sans, fontSize: 13, color: G.textMuted,
                    marginBottom: 2,
                  }}>
                  {["Features", "How it works", "FAQ"][i]}
                </button>
              ))}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${G.cardBorder}`,
                display: "flex", flexDirection: "column", gap: 8 }}>
                {isAuthenticated ? (
                  <>
                    <Link to="/exchange" onClick={() => setMobileOpen(false)}
                      style={{ textDecoration: "none" }}>
                      <GhostBtn>Go to Exchange</GhostBtn>
                    </Link>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                      style={{ textDecoration: "none" }}>
                      <GreenBtn style={{ width: "100%", justifyContent: "center" }}>Go to Dashboard</GreenBtn>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)}
                      style={{ textDecoration: "none" }}>
                      <GhostBtn>Login</GhostBtn>
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}
                      style={{ textDecoration: "none" }}>
                      <GreenBtn style={{ width: "100%", justifyContent: "center" }}>Get Started <ArrowRight size={14} /></GreenBtn>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* ══ HERO ══ */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex",
          alignItems: "center", paddingTop: 64, overflow: "hidden" }}>

          {/* background orbs */}
          <Orb x="10%"  y="15%" size={480} opacity={0.08} />
          <Orb x="60%"  y="50%" size={560} opacity={0.05} />
          <Orb x="5%"   y="65%" size={300} opacity={0.04} />
          <Orb x="75%"  y="5%"  size={320} opacity={0.06} />

          {/* grid overlay */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `linear-gradient(${G.ga(0.03)} 1px, transparent 1px),
              linear-gradient(90deg, ${G.ga(0.03)} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
          }} />

          <div style={{ maxWidth: 1180, margin: "0 auto", padding: "80px 24px",
            width: "100%", position: "relative", zIndex: 1 }}>

            <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
              {/* badge */}
              <div style={{ marginBottom: 28, animation: "fadeUp 0.6s ease both" }}>
                <Pill>
                  <Zap size={12} color={G.green} />
                  Time Credit Based Exchange
                </Pill>
              </div>

              {/* headline */}
              <h1 style={{
                fontFamily: G.serif, fontWeight: 400, fontSize: "clamp(40px, 7vw, 72px)",
                lineHeight: 1.08, color: G.text, margin: "0 0 24px",
                animation: "fadeUp 0.7s ease 0.1s both",
              }}>
                Exchange Skills,{" "}
                <span style={{
                  color: G.green,
                  textShadow: `0 0 40px ${G.ga(0.4)}`,
                }}>
                  Grow Together
                </span>
              </h1>

              {/* sub */}
              <p style={{
                fontFamily: G.sans, fontSize: "clamp(15px, 2vw, 19px)",
                lineHeight: 1.7, color: G.textMuted, margin: "0 0 44px",
                animation: "fadeUp 0.7s ease 0.2s both",
              }}>
                Join a community where your skills are currency. Teach what you know,
                learn what you need — powered by a fair time-credit economy.
              </p>

              {/* CTA row */}
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center",
                animation: "fadeUp 0.7s ease 0.3s both", marginBottom: 64,
              }}>
                {isAuthenticated ? (
                  <>
                    <Link to="/exchange" style={{ textDecoration: "none" }}>
                      <GreenBtn>Start Exchange <ArrowRight size={15} /></GreenBtn>
                    </Link>
                    <Link to="/dashboard" style={{ textDecoration: "none" }}>
                      <GhostBtn>Open Dashboard</GhostBtn>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" style={{ textDecoration: "none" }}>
                      <GreenBtn>Get Started Free <ArrowRight size={15} /></GreenBtn>
                    </Link>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      <GhostBtn>Login</GhostBtn>
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <div style={{
                display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12,
                animation: "fadeUp 0.7s ease 0.45s both",
              }}>
                {statItems.map(s => (
                  <StatBlock key={s.label} value={s.value} label={s.label} loading={statsLoading} />
                ))}
              </div>
            </div>
          </div>

          {/* bottom fade */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
            background: `linear-gradient(to bottom, transparent, ${G.bg})`,
            pointerEvents: "none",
          }} />
        </section>

        {/* ══ FEATURES ══ */}
        <section id="features" style={{ padding: "100px 24px", scrollMarginTop: 80 }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Pill><BarChart3 size={12} /> Platform Features</Pill>
              <h2 style={{ fontFamily: G.serif, fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 400,
                color: G.text, margin: "16px 0 14px" }}>
                Everything You Need to Trade Skills
              </h2>
              <p style={{ fontFamily: G.sans, fontSize: 15, color: G.textMuted, maxWidth: 520, margin: "0 auto" }}>
                A complete platform built around fairness, transparency, and community growth.
              </p>
            </div>

            <div style={{ display: "grid", gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              {features.map((f, i) => (
                <FeatureCard key={f.title} icon={f.icon} title={f.title}
                  description={f.description} delay={i * 80} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="how-it-works" style={{
          padding: "100px 24px", scrollMarginTop: 80,
          background: `linear-gradient(180deg, ${G.bg} 0%, ${G.bgMid} 50%, ${G.bg} 100%)`,
          position: "relative",
        }}>
          {/* side orbs */}
          <Orb x="-5%" y="30%" size={320} opacity={0.04} />
          <Orb x="88%" y="50%" size={280} opacity={0.04} />

          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Pill><RefreshCw size={12} /> Simple Process</Pill>
              <h2 style={{ fontFamily: G.serif, fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 400,
                color: G.text, margin: "16px 0 14px" }}>
                How It Works
              </h2>
              <p style={{ fontFamily: G.sans, fontSize: 15, color: G.textMuted }}>
                Get started in three simple steps.
              </p>
            </div>

            {/* horizontal step row with connector */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              gap: 0, position: "relative",
            }}>
              {/* connecting line */}
              <div style={{
                position: "absolute", top: 27, left: "calc(16.5% + 28px)",
                right: "calc(16.5% + 28px)", height: 1,
                background: `linear-gradient(90deg, ${G.ga(0.5)}, ${G.ga(0.15)}, ${G.ga(0.5)})`,
              }} />

              {steps.map((s, i) => (
                <StepCard key={s.step} step={s.step} title={s.title}
                  description={s.description} last={i === steps.length - 1} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section id="faq" style={{ padding: "100px 24px", scrollMarginTop: 80 }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Pill><Bell size={12} /> Common Questions</Pill>
              <h2 style={{ fontFamily: G.serif, fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 400,
                color: G.text, margin: "16px 0 10px" }}>
                FAQ
              </h2>
              <p style={{ fontFamily: G.sans, fontSize: 15, color: G.textMuted }}>
                Quick answers before you dive in.
              </p>
            </div>

            <div style={{
              borderRadius: 18, overflow: "hidden",
              border: `1px solid ${G.cardBorder}`,
              background: G.card, backdropFilter: "blur(16px)",
              padding: "0 20px",
            }}>
              <Accordion type="single" collapsible>
                {faqs.map((item, idx) => (
                  <AccordionItem key={item.q} value={`item-${idx}`}
                    style={{ borderColor: G.cardBorder }}>
                    <AccordionTrigger style={{
                      fontFamily: G.sans, fontSize: 14, fontWeight: 600,
                      color: G.text, textAlign: "left",
                    }}>
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent style={{
                      fontFamily: G.sans, fontSize: 13, color: G.textMuted, lineHeight: 1.7,
                    }}>
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ══ CTA SECTION ══ */}
        <section style={{ padding: "40px 24px 100px" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <div style={{
              borderRadius: 24, padding: "64px 48px", textAlign: "center",
              position: "relative", overflow: "hidden",
              background: `linear-gradient(135deg, ${G.ga(0.1)} 0%, ${G.ga(0.04)} 100%)`,
              border: `1px solid ${G.ga(0.18)}`,
            }}>
              {/* inner orbs */}
              <Orb x="-5%" y="-10%" size={260} opacity={0.18} />
              <Orb x="70%"  y="60%"  size={200} opacity={0.1} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", margin: "0 auto 20px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: G.ga(0.12), border: `1px solid ${G.ga(0.25)}`,
                  color: G.green,
                }}>
                  <Users size={22} />
                </div>

                <h2 style={{ fontFamily: G.serif, fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 400,
                  color: G.text, margin: "0 0 14px" }}>
                  Ready to Start Swapping?
                </h2>
                <p style={{ fontFamily: G.sans, fontSize: 15, color: G.textMuted,
                  margin: "0 0 36px", maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
                  Join thousands of people already exchanging skills and growing together.
                </p>

                <Link to={isAuthenticated ? "/exchange" : "/register"} style={{ textDecoration: "none" }}>
                  <GreenBtn>
                    {isAuthenticated ? "Go to Exchange" : "Create Free Account"}
                    <ArrowRight size={15} />
                  </GreenBtn>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer style={{
          borderTop: `1px solid ${G.cardBorder}`,
          padding: "28px 24px",
          background: `rgba(9,15,13,0.8)`,
        }}>
          <div style={{ maxWidth: 1180, margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `linear-gradient(135deg, ${G.green}, ${G.greenDeep})`,
              }}>
                <Zap size={13} color={G.greenDark} />
              </div>
              <span style={{ fontFamily: G.serif, fontSize: 16, color: G.text, fontWeight: 400 }}>SkillSwap</span>
            </div>
            <p style={{ fontFamily: G.sans, fontSize: 12, color: G.textSub, margin: 0 }}>
              Copyright {new Date().getFullYear()} SkillSwap. All rights reserved.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
};

export default Landing;