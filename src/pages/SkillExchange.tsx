// import { useEffect, useMemo, useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import skillService, { Skill, UserSkillListing } from "@/services/skillService";
// import swapService from "@/services/swapService";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Link } from "react-router-dom";

// const SkillExchange = () => {
//   const { user } = useAuth();
//   const userId = Number(user?.id);

//   const [skills, setSkills] = useState<Skill[]>([]);
//   const [myListings, setMyListings] = useState<UserSkillListing[]>([]);
//   const [teachers, setTeachers] = useState<UserSkillListing[]>([]);
//   const [search, setSearch] = useState("");

//   const [selectedSkillId, setSelectedSkillId] = useState<number | "">("");
//   const [selectedTeacherId, setSelectedTeacherId] = useState<number | "">("");
//   const [hours, setHours] = useState("1");

//   const [newSkillName, setNewSkillName] = useState("");
//   const [newSkillCategory, setNewSkillCategory] = useState("");
//   const [newSkillPrice, setNewSkillPrice] = useState("1");

//   const [listingSkillId, setListingSkillId] = useState<number | "">("");
//   const [proficiencyLevel, setProficiencyLevel] = useState("Beginner");

//   const loadSkills = async (q?: string) => {
//     const res = await skillService.listSkills(q);
//     setSkills(res.data);
//   };

//   const loadMyListings = async () => {
//     if (!userId) return;
//     const res = await skillService.myListings(userId);
//     setMyListings(res.data);
//   };

//   useEffect(() => {
//     loadSkills();
//     loadMyListings();
//   }, [userId]);

//   useEffect(() => {
//     const t = setTimeout(() => loadSkills(search), 300);
//     return () => clearTimeout(t);
//   }, [search]);

//   const selectedSkill = useMemo(
//     () => skills.find((s) => s.id === Number(selectedSkillId)),
//     [skills, selectedSkillId],
//   );

//   const onLoadTeachers = async () => {
//     if (!selectedSkillId) {
//       toast.error("Select a skill first");
//       return;
//     }
//     try {
//       const res = await skillService.teachersBySkill(Number(selectedSkillId));
//       const filtered = res.data.filter((t) => t.userId !== userId);
//       setTeachers(filtered);
//       if (!filtered.length) toast.info("No teachers found for this skill yet");
//     } catch (e: any) {
//       toast.error(e?.response?.data?.message || "Failed to fetch teachers");
//     }
//   };

//   const onCreateSkill = async () => {
//     try {
//       if (!newSkillName || !newSkillCategory || !newSkillPrice) {
//         toast.error("Fill all new skill fields");
//         return;
//       }
//       await skillService.createSkill({
//         name: newSkillName,
//         category: newSkillCategory,
//         pricePerHour: Number(newSkillPrice),
//       });
//       toast.success("Skill created");
//       setNewSkillName("");
//       setNewSkillCategory("");
//       setNewSkillPrice("1");
//       await loadSkills();
//     } catch (e: any) {
//       toast.error(e?.response?.data?.message || "Failed to create skill");
//     }
//   };

//   const onAddListing = async () => {
//     if (!listingSkillId || !userId) {
//       toast.error("Select skill to list");
//       return;
//     }
//     try {
//       await skillService.addListing({
//         userId,
//         skillId: Number(listingSkillId),
//         proficiencyLevel,
//       });
//       toast.success("Skill listed successfully");
//       await loadMyListings();
//     } catch (e: any) {
//       toast.error(e?.response?.data?.message || "Failed to add listing");
//     }
//   };

//   const onExchange = async () => {
//     if (!selectedSkillId || !selectedTeacherId || !hours || !userId) {
//       toast.error("Fill all exchange fields");
//       return;
//     }

//     try {
//       await swapService.completeSwap({
//         learnerId: userId,
//         teacherId: Number(selectedTeacherId),
//         skillId: Number(selectedSkillId),
//         hours: Number(hours),
//       });
//       toast.success("Exchange completed and credits updated");
//       setSelectedTeacherId("");
//     } catch (e: any) {
//       toast.error(e?.response?.data?.message || "Exchange failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background p-4 lg:p-8">
//       <div className="mb-6 flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-foreground">Skill Exchange</h1>
//         <Link to="/dashboard">
//           <Button variant="outline">Back to Dashboard</Button>
//         </Link>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-2">
//         <section className="rounded-xl border border-border bg-card p-5">
//           <h2 className="mb-3 text-lg font-semibold">Browse Skills</h2>
//           <Input
//             placeholder="Search skill or category..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="mb-4"
//           />
//           <div className="max-h-72 space-y-2 overflow-y-auto">
//             {skills.map((s) => (
//               <button
//                 key={s.id}
//                 onClick={() => setSelectedSkillId(s.id)}
//                 className={`w-full rounded-lg border p-3 text-left transition ${
//                   selectedSkillId === s.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
//                 }`}
//               >
//                 <p className="font-medium">{s.name}</p>
//                 <p className="text-sm text-muted-foreground">
//                   {s.category} • {s.pricePerHour} credits/hour
//                 </p>
//               </button>
//             ))}
//           </div>
//         </section>

//         <section className="rounded-xl border border-border bg-card p-5">
//           <h2 className="mb-3 text-lg font-semibold">List Your Skill</h2>

//           <label className="mb-1 block text-sm">Select existing skill</label>
//           <select
//             className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2"
//             value={listingSkillId}
//             onChange={(e) => setListingSkillId(e.target.value ? Number(e.target.value) : "")}
//           >
//             <option value="">Choose skill</option>
//             {skills.map((s) => (
//               <option key={s.id} value={s.id}>
//                 {s.name} ({s.category}) - {s.pricePerHour}/hr
//               </option>
//             ))}
//           </select>

//           <label className="mb-1 block text-sm">Proficiency</label>
//           <select
//             className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2"
//             value={proficiencyLevel}
//             onChange={(e) => setProficiencyLevel(e.target.value)}
//           >
//             <option>Beginner</option>
//             <option>Intermediate</option>
//             <option>Expert</option>
//           </select>

//           <Button onClick={onAddListing} className="w-full">
//             Add Listing
//           </Button>

//           <hr className="my-4 border-border" />

//           <h3 className="mb-2 font-medium">Create new global skill</h3>
//           <Input
//             className="mb-2"
//             placeholder="Skill name"
//             value={newSkillName}
//             onChange={(e) => setNewSkillName(e.target.value)}
//           />
//           <Input
//             className="mb-2"
//             placeholder="Category"
//             value={newSkillCategory}
//             onChange={(e) => setNewSkillCategory(e.target.value)}
//           />
//           <Input
//             className="mb-3"
//             type="number"
//             min="0.5"
//             step="0.5"
//             placeholder="Price per hour (credits)"
//             value={newSkillPrice}
//             onChange={(e) => setNewSkillPrice(e.target.value)}
//           />
//           <Button variant="outline" onClick={onCreateSkill} className="w-full">
//             Create Skill
//           </Button>
//         </section>
//       </div>

//       <div className="mt-6 grid gap-6 lg:grid-cols-2">
//         <section className="rounded-xl border border-border bg-card p-5">
//           <h2 className="mb-3 text-lg font-semibold">Your Listed Skills</h2>
//           {!myListings.length ? (
//             <p className="text-sm text-muted-foreground">No skills listed yet.</p>
//           ) : (
//             <div className="space-y-2">
//               {myListings.map((l) => (
//                 <div key={l.id} className="rounded-lg border border-border p-3">
//                   <p className="font-medium">{l.skillName}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {l.category} • {l.proficiencyLevel} • {l.pricePerHour} credits/hour
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         <section className="rounded-xl border border-border bg-card p-5">
//           <h2 className="mb-3 text-lg font-semibold">Exchange Skill for Credits</h2>

//           <div className="mb-3 rounded-md bg-muted/40 p-3 text-sm">
//             Selected skill: <span className="font-medium">{selectedSkill?.name ?? "None"}</span>
//           </div>

//           <Button variant="outline" className="mb-3 w-full" onClick={onLoadTeachers}>
//             Load Teachers for Selected Skill
//           </Button>

//           <label className="mb-1 block text-sm">Teacher</label>
//           <select
//             className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2"
//             value={selectedTeacherId}
//             onChange={(e) => setSelectedTeacherId(e.target.value ? Number(e.target.value) : "")}
//           >
//             <option value="">Choose teacher</option>
//             {teachers.map((t) => (
//               <option key={t.id} value={t.userId}>
//                 {t.username} • {t.proficiencyLevel}
//               </option>
//             ))}
//           </select>

//           <label className="mb-1 block text-sm">Hours</label>
//           <Input
//             type="number"
//             min="0.5"
//             step="0.5"
//             className="mb-3"
//             value={hours}
//             onChange={(e) => setHours(e.target.value)}
//           />

//           <Button onClick={onExchange} className="w-full">
//             Complete Exchange
//           </Button>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default SkillExchange;

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import skillService, { Skill, UserSkillListing } from "@/services/skillService";
import swapService from "@/services/swapService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
 
/* ─── tiny icon helpers ─── */
const Icon = {
  ArrowLeft: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2L4 6.5l4 4.5" />
    </svg>
  ),
  Search: () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="6.5" cy="6.5" r="4" /><path d="M10 10l3 3" />
    </svg>
  ),
  Browse: () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="8" cy="8" r="5.5" /><path d="M8 5v3l2 1.5" />
    </svg>
  ),
  List: () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M8 2v12M3 7l5-5 5 5" />
    </svg>
  ),
  Listings: () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="6" cy="5" r="2.5" /><path d="M1 13c0-2.8 2.2-4 5-4M11 9v6M8.5 11.5l2.5-2.5 2.5 2.5" />
    </svg>
  ),
  Exchange: () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M2 8h3l2-5 3 10 2-5h2" />
    </svg>
  ),
};
 
/* ─── sub-components ─── */
 
function StatCard({ label, value, unit }: { label: string; value: number | string; unit: string }) {
  return (
    <div className="rounded-[8px] bg-muted/50 px-4 py-3">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-xl font-medium text-foreground">
        {value} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}
 
function CardHeader({
  iconBg,
  iconColor,
  IconComp,
  title,
}: {
  iconBg: string;
  iconColor: string;
  IconComp: React.FC;
  title: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span
        className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[8px]"
        style={{ background: iconBg, color: iconColor }}
      >
        <IconComp />
      </span>
      <h2 className="text-sm font-medium">{title}</h2>
    </div>
  );
}
 
function ProficiencyBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    Expert: "bg-[#EAF3DE] text-[#3B6D11]",
    Intermediate: "bg-[#E6F1FB] text-[#185FA5]",
    Beginner: "bg-[#E1F5EE] text-[#0F6E56]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${map[level] ?? "bg-muted text-muted-foreground"}`}>
      {level}
    </span>
  );
}
 
function CreditPill({ price }: { price: number }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#FAEEDA] px-2 py-0.5 text-[11px] font-medium text-[#854F0B]">
      {price} cr/hr
    </span>
  );
}
 
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="my-3 flex items-center gap-2">
      <div className="h-px flex-1 bg-border/50" />
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-border/50" />
    </div>
  );
}
 
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </label>
  );
}
 
function StyledSelect({
  value,
  onChange,
  children,
}: {
  value: string | number;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-[8px] border border-border/40 bg-muted/40 px-3 py-[7px] pr-8 text-[13px] text-foreground outline-none focus:border-blue-400 focus:bg-background"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-muted-foreground/60" />
    </div>
  );
}
 
/* ─── main component ─── */
 
const SkillExchange = () => {
  const { user } = useAuth();
  const userId = Number(user?.id);
 
  const [skills, setSkills] = useState<Skill[]>([]);
  const [myListings, setMyListings] = useState<UserSkillListing[]>([]);
  const [teachers, setTeachers] = useState<UserSkillListing[]>([]);
  const [search, setSearch] = useState("");
 
  const [selectedSkillId, setSelectedSkillId] = useState<number | "">("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | "">("");
  const [hours, setHours] = useState("1");
 
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("");
  const [newSkillPrice, setNewSkillPrice] = useState("1");
 
  const [listingSkillId, setListingSkillId] = useState<number | "">("");
  const [proficiencyLevel, setProficiencyLevel] = useState("Beginner");
 
  const loadSkills = async (q?: string) => {
    const res = await skillService.listSkills(q);
    setSkills(res.data);
  };
 
  const loadMyListings = async () => {
    if (!userId) return;
    const res = await skillService.myListings(userId);
    setMyListings(res.data);
  };
 
  useEffect(() => {
    loadSkills();
    loadMyListings();
  }, [userId]);
 
  useEffect(() => {
    const t = setTimeout(() => loadSkills(search), 300);
    return () => clearTimeout(t);
  }, [search]);
 
  const selectedSkill = useMemo(
    () => skills.find((s) => s.id === Number(selectedSkillId)),
    [skills, selectedSkillId],
  );
 
  const onLoadTeachers = async () => {
    if (!selectedSkillId) { toast.error("Select a skill first"); return; }
    try {
      const res = await skillService.teachersBySkill(Number(selectedSkillId));
      const filtered = res.data.filter((t) => t.userId !== userId);
      setTeachers(filtered);
      if (!filtered.length) toast.info("No teachers found for this skill yet");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to fetch teachers");
    }
  };
 
  const onCreateSkill = async () => {
    if (!newSkillName || !newSkillCategory || !newSkillPrice) { toast.error("Fill all new skill fields"); return; }
    try {
      await skillService.createSkill({ name: newSkillName, category: newSkillCategory, pricePerHour: Number(newSkillPrice) });
      toast.success("Skill created");
      setNewSkillName(""); setNewSkillCategory(""); setNewSkillPrice("1");
      await loadSkills();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to create skill");
    }
  };
 
  const onAddListing = async () => {
    if (!listingSkillId || !userId) { toast.error("Select skill to list"); return; }
    try {
      await skillService.addListing({ userId, skillId: Number(listingSkillId), proficiencyLevel });
      toast.success("Skill listed successfully");
      await loadMyListings();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to add listing");
    }
  };
 
  const onExchange = async () => {
    if (!selectedSkillId || !selectedTeacherId || !hours || !userId) { toast.error("Fill all exchange fields"); return; }
    try {
      await swapService.completeSwap({ learnerId: userId, teacherId: Number(selectedTeacherId), skillId: Number(selectedSkillId), hours: Number(hours) });
      toast.success("Exchange completed and credits updated");
      setSelectedTeacherId("");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Exchange failed");
    }
  };
 
  const avatarInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
 
  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-4xl">
 
        {/* ── top bar ── */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-blue-50 text-blue-600">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 8h12M8 2l4 6-4 6" />
              </svg>
            </div>
            <h1 className="text-lg font-medium">Skill Exchange</h1>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
              <Icon.ArrowLeft /> Dashboard
            </Button>
          </Link>
        </div>
 
        {/* ── stat row ── */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <StatCard label="Your credits" value={24} unit="credits" />
          <StatCard label="Skills listed" value={myListings.length} unit="skills" />
          <StatCard label="Available skills" value={skills.length} unit="skills" />
        </div>
 
        {/* ── row 1 ── */}
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
 
          {/* Browse */}
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <CardHeader iconBg="#E6F1FB" iconColor="#185FA5" IconComp={Icon.Browse} title="Browse skills" />
            <div className="relative mb-3">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                <Icon.Search />
              </span>
              <Input
                placeholder="Search skill or category…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-7 text-[13px]"
              />
            </div>
            <div className="flex max-h-[220px] flex-col gap-1.5 overflow-y-auto pr-0.5">
              {skills.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSkillId(s.id)}
                  className={`flex w-full items-center justify-between rounded-[8px] border px-3 py-2 text-left transition-all ${
                    selectedSkillId === s.id
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30"
                      : "border-border/50 hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <div>
                    <p className={`text-[13px] font-medium ${selectedSkillId === s.id ? "text-blue-800 dark:text-blue-300" : "text-foreground"}`}>
                      {s.name}
                    </p>
                    <p className={`text-[11px] ${selectedSkillId === s.id ? "text-blue-500" : "text-muted-foreground"}`}>
                      {s.category}
                    </p>
                  </div>
                  <CreditPill price={s.pricePerHour} />
                </button>
              ))}
            </div>
          </div>
 
          {/* List your skill */}
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <CardHeader iconBg="#EAF3DE" iconColor="#3B6D11" IconComp={Icon.List} title="List your skill" />
 
            <div className="mb-2.5">
              <FieldLabel>Skill</FieldLabel>
              <StyledSelect
                value={listingSkillId}
                onChange={(v) => setListingSkillId(v ? Number(v) : "")}
              >
                <option value="">Choose a skill</option>
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category}) — {s.pricePerHour}/hr
                  </option>
                ))}
              </StyledSelect>
            </div>
 
            <div className="mb-3">
              <FieldLabel>Proficiency</FieldLabel>
              <StyledSelect value={proficiencyLevel} onChange={setProficiencyLevel}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </StyledSelect>
            </div>
 
            <Button onClick={onAddListing} className="w-full text-[13px]">
              Add listing
            </Button>
 
            <SectionDivider label="New skill" />
 
            <div className="mb-2">
              <FieldLabel>Skill name</FieldLabel>
              <Input
                placeholder="e.g. Watercolor Painting"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="text-[13px]"
              />
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <div>
                <FieldLabel>Category</FieldLabel>
                <Input
                  placeholder="e.g. Creative"
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="text-[13px]"
                />
              </div>
              <div>
                <FieldLabel>Price/hr (credits)</FieldLabel>
                <Input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={newSkillPrice}
                  onChange={(e) => setNewSkillPrice(e.target.value)}
                  className="text-[13px]"
                />
              </div>
            </div>
            <Button variant="outline" onClick={onCreateSkill} className="w-full text-[13px]">
              Create global skill
            </Button>
          </div>
        </div>
 
        {/* ── row 2 ── */}
        <div className="grid gap-4 lg:grid-cols-2">
 
          {/* Your listings */}
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <CardHeader iconBg="#E1F5EE" iconColor="#0F6E56" IconComp={Icon.Listings} title="Your listed skills" />
            {!myListings.length ? (
              <p className="py-6 text-center text-[12px] text-muted-foreground">No skills listed yet.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {myListings.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center gap-3 rounded-[8px] border border-border/50 px-3 py-2"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#E1F5EE] text-[11px] font-medium text-[#0F6E56]">
                      {avatarInitials(l.skillName)}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium">{l.skillName}</p>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {l.category}
                        <ProficiencyBadge level={l.proficiencyLevel} />
                        <span className="ml-0.5">· {l.pricePerHour} cr/hr</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
 
          {/* Exchange */}
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <CardHeader iconBg="#FAEEDA" iconColor="#854F0B" IconComp={Icon.Exchange} title="Exchange skill for credits" />
 
            {/* selected skill banner */}
            <div className="mb-3 flex items-center justify-between rounded-[8px] border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-900 dark:bg-blue-950/30">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-blue-500">Selected skill</p>
                <p className="text-[13px] font-medium text-blue-900 dark:text-blue-200">
                  {selectedSkill?.name ?? "None selected"}
                </p>
              </div>
              {selectedSkill && <CreditPill price={selectedSkill.pricePerHour} />}
            </div>
 
            <Button variant="outline" onClick={onLoadTeachers} className="mb-3 w-full text-[13px]">
              Load teachers for this skill
            </Button>
 
            <div className="mb-2.5">
              <FieldLabel>Teacher</FieldLabel>
              <StyledSelect
                value={selectedTeacherId}
                onChange={(v) => setSelectedTeacherId(v ? Number(v) : "")}
              >
                <option value="">Choose teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.userId}>
                    {t.username} · {t.proficiencyLevel}
                  </option>
                ))}
              </StyledSelect>
            </div>
 
            <div className="mb-3">
              <FieldLabel>Hours</FieldLabel>
              <Input
                type="number"
                min="0.5"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="text-[13px]"
              />
            </div>
 
            <Button onClick={onExchange} className="w-full text-[13px]">
              Complete exchange
            </Button>
          </div>
        </div>
 
      </div>
    </div>
  );
};
 
export default SkillExchange;