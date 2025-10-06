// src/lib/chatConfig.ts
export type ReasonId =
  | "project"
  | "quote"
  | "support"
  | "product"
  | "status"
  | "other";

export const REASONS: { id: ReasonId; label: string; followups: string[] }[] = [
  {
    id: "project",
    label: "Start a project",
    followups: ["Web app", "Mobile app", "Data dashboard", "Integration", "Internal tool"]
  },
  {
    id: "quote",
    label: "Get a quote",
    followups: ["ASAP", "2–4 weeks", "4–8 weeks", "Exploratory chat"]
  },
  {
    id: "support",
    label: "Support / bug",
    followups: ["Website", "Billing", "TruthTap", "Other"]
  },
  {
    id: "product",
    label: "Product questions",
    followups: ["Capabilities", "Process", "Pricing"]
  },
  {
    id: "status",
    label: "Status update",
    followups: ["In progress", "Waiting on client", "On hold"]
  },
  { id: "other", label: "Something else", followups: [] }
];

export const SUGGESTIONS = [
  "Include a deadline",
  "How many users?",
  "Any integrations?",
  "Add success criteria"
];

export const CHAT_STORAGE_KEY = "chatdock-v1";
