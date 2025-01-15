import { MediaItem } from "./App.types";

export const normalizeString = (str: string) => {
  let normalizedStr = str.toLowerCase();
  normalizedStr = normalizedStr.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
  normalizedStr = normalizedStr.replace(/\s{2,}/g, " ").trim();

  const stopwords = ["the", "a", "of", "in", "on", "and", "or", "but", "to", "is", "are"];
  normalizedStr = normalizedStr
    .split(" ")
    .filter((word) => !stopwords.includes(word))
    .join(" ");
  return normalizedStr;
};

export const processData = (data: MediaItem[] = []) => {
  return data
    .map((item: MediaItem) => {
      return {
        author: item.author || "",
        hasConsumed: !!item.hasConsumed,
        id: item.id || crypto.randomUUID(),
        mediaFormat: item.mediaFormat,
        priority: item.priority || 0,
        notes: item.notes || "",
        title: item.title || "",
      };
    })
    .sort((a: MediaItem, b: MediaItem) => {
      return a.mediaFormat === b.mediaFormat
        ? normalizeString(a.title).localeCompare(normalizeString(b.title))
        : a.mediaFormat.toLocaleLowerCase().localeCompare(b.mediaFormat.toLocaleLowerCase());
    });
};
