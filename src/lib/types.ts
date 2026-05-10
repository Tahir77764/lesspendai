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
      { id: "business", name: "Business (Teams)", basePrice: 40, perUser: true },
      { id: "enterprise", name: "Enterprise", basePrice: 0, perUser: true },
    ]
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    plans: [
      { id: "individual", name: "Individual", basePrice: 10, perUser: true },
      { id: "business", name: "Business", basePrice: 19, perUser: true },
      { id: "enterprise", name: "Enterprise", basePrice: 39, perUser: true },
    ]
  },
  {
    id: "claude",
    name: "Claude",
    plans: [
      { id: "free", name: "Free", basePrice: 0, perUser: true },
      { id: "pro", name: "Pro", basePrice: 20, perUser: true },
      { id: "max", name: "Power/Max", basePrice: 125, perUser: true },
      { id: "team", name: "Team", basePrice: 30, perUser: true, minSeats: 5 },
      { id: "enterprise", name: "Enterprise", basePrice: 0, perUser: true },
      { id: "api", name: "API Direct", basePrice: 0, perUser: false },
    ]
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    plans: [
      { id: "free", name: "Free", basePrice: 0, perUser: true },
      { id: "plus", name: "Plus", basePrice: 20, perUser: true },
      { id: "team", name: "Team", basePrice: 30, perUser: true, minSeats: 2 },
      { id: "enterprise", name: "Enterprise", basePrice: 0, perUser: true },
      { id: "api", name: "API Direct", basePrice: 0, perUser: false },
    ]
  },
  {
    id: "gemini",
    name: "Gemini",
    plans: [
      { id: "pro", name: "Pro (Business)", basePrice: 20, perUser: true },
      { id: "ultra", name: "Ultra (Enterprise)", basePrice: 30, perUser: true },
      { id: "api", name: "API Direct", basePrice: 0, perUser: false },
    ]
  },
  {
    id: "windsurf",
    name: "Windsurf",
    plans: [
      { id: "free", name: "Free", basePrice: 0, perUser: true },
      { id: "pro", name: "Pro", basePrice: 20, perUser: true },
      { id: "teams", name: "Teams", basePrice: 30, perUser: true, minSeats: 3 },
    ]
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    plans: [
      { id: "api", name: "API Direct", basePrice: 0, perUser: false },
    ]
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    plans: [
      { id: "api", name: "API Direct", basePrice: 0, perUser: false },
    ]
  }
];
