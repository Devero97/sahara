import { CharacterRole } from "./Bitsy";

export interface LevelData {
  level: number;
  xp: number;
}

export interface RoleMilestone {
  level: number;
  role: string;
  color: string;
}

export interface CalculatorResult {
  currentRole: CharacterRole;
  currentLevel: number;
  currentXp: number;
  nextLevelXp: number;
  progress: number;
  roleProgress: {
    level: number;
    role: string;
    color: string;
    messagesNeeded: number;
    progress: number;
  }[];
  messagesToNextLevel: number;
}
