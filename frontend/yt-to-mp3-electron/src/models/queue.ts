import { QueueItem } from "./queueItem";

export interface Queue {
  items: QueueItem[];
  isPlaying: boolean;
  currentIndex: number;
}
