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
