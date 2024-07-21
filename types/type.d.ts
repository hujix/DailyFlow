declare interface Schedule {
  id: string;
  name: string;
  desc: string;
  cycle: number;
  finish: string[];
  backgroundColor: string;
  textColor: string;
  days: string[];
}

declare interface TaskItem {
  tid: string;
  type: string;
  color: string;
  name: string;
  schedule: Schedule[];
}
