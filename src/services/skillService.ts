import api from "@/lib/api";

export interface Skill {
  id: number;
  name: string;
  category: string;
  pricePerHour: number;
}

export interface UserSkillListing {
  id: number;
  userId: number;
  username: string;
  skillId: number;
  skillName: string;
  category: string;
  pricePerHour: number;
  proficiencyLevel: string;
}

const skillService = {
  listSkills: (q?: string) => api.get<Skill[]>("/api/skills", { params: q ? { q } : {} }),
  createSkill: (payload: { name: string; category: string; pricePerHour: number }) =>
    api.post<Skill>("/api/skills", payload),
  addListing: (payload: { userId: number; skillId: number; proficiencyLevel: string }) =>
    api.post<UserSkillListing>("/api/skills/listings", payload),
  myListings: (userId: number) =>
    api.get<UserSkillListing[]>("/api/skills/listings", { params: { userId } }),
  teachersBySkill: (skillId: number) =>
    api.get<UserSkillListing[]>("/api/skills/teachers", { params: { skillId } }),
};

export default skillService;