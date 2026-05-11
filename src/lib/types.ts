export type PlanId = string;

export interface ToolSelection {
  toolId: string;
  planId: PlanId;
  seats: number;
  monthlySpend: number;
}

export interface AuditInput {
  tools: ToolSelection[];
  teamSize: number;
  primaryUseCase: string;
}

export interface ToolDef {
  id: string;
  name: string;
  plans: {
    id: string;
    name: string;
    basePrice: number;
    perUser: boolean;
    minSeats?: number;
  }[];
}

export const AI_TOOLS: ToolDef[] = [
  {
    id: "cursor",
    name: "Cursor",
    plans: [
      { id: "hobby", name: "Hobby", basePrice: 0, perUser: true },
      { id: "pro", name: "Pro", basePrice: 20, perUser: true },
      { id: "pro-plus", name: "Pro+", basePrice: 60, perUser: true },
      { id: "ultra", name: "Ultra", basePrice: 200, perUser: true },
      { id: "teams", name: "Teams", basePrice: 40, perUser: true },
      { id: "enterprise", name: "Enterprise", basePrice: 0, perUser: true },
    ]
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    plans: [
      { id: "free", name: "Free", basePrice: 0, perUser: true },
      { id: "pro", name: "Pro", basePrice: 10, perUser: true },
      { id: "pro-plus", name: "Pro+", basePrice: 39, perUser: true },
      { id: "business", name: "Business", basePrice: 19, perUser: true },
      { id: "enterprise", name: "Enterprise", basePrice: 39, perUser: true },
    ]
  },
  {
    id: "claude",
    name: "Claude",
    plans: [
      { id: "free", name: "Free", basePrice: 0, perUser: true },
      { id: "pro", name: "Pro", basePrice: 17, perUser: true },
      { id: "max", name: "Max", basePrice: 100, perUser: true },
      { id: "team-standard", name: "Team (Standard)", basePrice: 25, perUser: true, minSeats: 5 },
      { id: "team-premium", name: "Team (Premium)", basePrice: 125, perUser: true, minSeats: 5 },
      { id: "enterprise", name: "Enterprise", basePrice: 20, perUser: true },
    ]
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    plans: [
      { id: "free", name: "Free", basePrice: 0, perUser: true },
      { id: "go", name: "Go", basePrice: 5, perUser: true },
      { id: "plus", name: "Plus", basePrice: 20, perUser: true },
      { id: "pro", name: "Pro", basePrice: 200, perUser: true },
      { id: "business-codex", name: "Business Codex", basePrice: 0, perUser: true },
      { id: "business-chatgpt-codex", name: "Business ChatGPT & Codex", basePrice: 20, perUser: true },
      { id: "enterprise", name: "Enterprise", basePrice: 0, perUser: true },
    ]
  },
  {
    id: "gemini",
    name: "Gemini",
    plans: [
      { id: "google-ai-plus", name: "Google AI Plus", basePrice: 5, perUser: true },
      { id: "google-ai-pro", name: "Google AI Pro", basePrice: 20, perUser: true },
      { id: "google-ai-ultra", name: "Google AI Ultra", basePrice: 300, perUser: true },
    ]
  },
  {
    id: "windsurf",
    name: "Windsurf",
    plans: [
      { id: "free", name: "Free", basePrice: 0, perUser: true },
      { id: "pro", name: "Pro", basePrice: 20, perUser: true },
      { id: "max", name: "Max", basePrice: 200, perUser: true },
      { id: "teams", name: "Teams", basePrice: 40, perUser: true },
      { id: "enterprise", name: "Enterprise", basePrice: 0, perUser: true },
    ]
  }
];

