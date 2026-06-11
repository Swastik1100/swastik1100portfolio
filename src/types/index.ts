// ============================================================
//  types/index.ts  —  Shared TypeScript interfaces & types
// ============================================================

// ─── Navigation ──────────────────────────────────────────────
export interface NavLink {
  label: string;
  href:  string;
}

// ─── Projects / Work ─────────────────────────────────────────
export interface Project {
  id:          string;
  index:       string;          // "01", "02" …
  title:       string;
  tagline:     string;
  description: string;
  tags:        string[];
  stack:       string[];
  liveUrl?:    string;
  repoUrl?:    string;
  image:       string;          // path in /public
  year:        string;
  featured:    boolean;
}

// ─── Gym / Fitness ───────────────────────────────────────────
export interface GymLift {
  name:     string;           // "Squat", "Bench Press", "Deadlift"
  current:  number;           // current 1-rep max in kg
  target:   number;           // 90-day goal in kg
  unit:     "kg" | "lbs";
  icon:     string;           // emoji shorthand
  progress: number;           // 0-100 percentage
  history:  { date: string; weight: number }[];
}

export interface GymData {
  lastUpdated: string;
  lifts:       GymLift[];
  bodyStats?: {
    weight:       number;
    trainingDays: number;
  };
  sprints: {
    distance: string;
    time:     string;
    date:     string;
  }[];
}

// ─── Travel / India Map ───────────────────────────────────────
export type VisitStatus = "visited" | "lived" | "want";

export interface TravelMemory {
  year:        string;
  highlight:   string;
  photoUrl?:   string;
}

export interface TravelState {
  stateId:     string;       // matches TopoJSON id (e.g. "IN-DL")
  stateName:   string;
  status:      VisitStatus;
  emoji:       string;
  memories:    TravelMemory[];
}

export interface TooltipData {
  x:       number;
  y:       number;
  content: TravelState;
}

// ─── Books ───────────────────────────────────────────────────
export interface Book {
  id:          string;
  title:       string;
  author:      string;
  category:    "tech" | "philosophy" | "fiction" | "self-help" | "business";
  status:      "read" | "reading" | "queued";
  progress:    number;         // 0-100
  rating:      number;         // 1-5
  takeaway:    string;         // 1-sentence insight
  coverColor:  string;         // hex for placeholder covers
  year:        string;
}

// ─── Gaming ──────────────────────────────────────────────────
export interface Game {
  id:          string;
  title:       string;
  platform:    string;
  genre:       string;
  status:      "completed" | "playing" | "backlog" | "dropped";
  rating:      number;          // 1-10
  hours:       number;
  review:      string;          // micro-review
  coverColor:  string;          // placeholder cover gradient
  year:        string;
}

// ─── Spotify ─────────────────────────────────────────────────
export interface SpotifyTrack {
  isPlaying:    boolean;
  title?:       string;
  artist?:      string;
  album?:       string;
  albumArt?:    string;
  songUrl?:     string;
  previewUrl?:  string;
  progress?:    number;   // 0-100 percent
  duration?:    number;   // ms
}

// ─── WakaTime ────────────────────────────────────────────────
export interface WakaStats {
  lastUpdated:       string;
  totalHoursThisWeek: number;
  dailyAverage:      string;
  topLanguages: {
    name:       string;
    percent:    number;
    color:      string;
  }[];
  topProjects: {
    name:       string;
    hours:      number;
  }[];
}

// ─── Achievements ────────────────────────────────────────────
export type AchievementId =
  | "night_owl"
  | "recruiter"
  | "explorer"
  | "hacker"
  | "bookworm"
  | "first_visit";

export interface Achievement {
  id:          AchievementId;
  title:       string;
  description: string;
  icon:        string;
  unlocked:    boolean;
  unlockedAt?: string;
}

export interface AchievementToast {
  achievement: Achievement;
  visible:     boolean;
}

// ─── Terminal ────────────────────────────────────────────────
export interface TerminalLine {
  type:    "input" | "output" | "error" | "system";
  content: string;
  ts:      string;
}

export type TerminalCommand =
  | "help"
  | "about"
  | "projects"
  | "skills"
  | "contact"
  | "clear"
  | "secret-code"
  | "hire";

// ─── Dishes / Cooking ────────────────────────────────────────
export interface Dish {
  id:          string;
  name:        string;
  cuisine:     string;
  difficulty:  "easy" | "medium" | "hard";
  emoji:       string;
  description: string;
  date:        string;
  rating:      number;         // 1-5
  tags:        string[];
  color:       string;         // hex for card accent
}

// ─── Theme ───────────────────────────────────────────────────
export type Theme = "dark" | "cyberpunk" | "light";
