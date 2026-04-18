export type Status = "todo" | "doing" | "done" | "onhold";
export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  tags: string[];
  priority: Priority;
  status: Status;
  createdAt: number;
  completedAt: number | null;
  timeSpent: number;
  timerStartedAt: number | null;
}

export interface Store {
  tasks: Task[];
  customTags: string[];
}
