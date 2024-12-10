import { MediaFormat } from "./App.constants";

export type MediaItem = {
  author: string;
  hasConsumed: boolean;
  id: string;
  mediaFormat: MediaFormat | "";
  priority: number;
  notes: string;
  title: string;
};
