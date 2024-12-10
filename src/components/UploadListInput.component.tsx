import { ChangeEvent } from "react";
import { normalizeString } from "../App.lib";
import { MediaItem } from "../App.types";
import "./UploadListInput.styles.css";

type UploadListInput = { onUpload: (items: MediaItem[]) => void };
const UploadListInputComponent = ({ onUpload = (_items) => {} }: UploadListInput) => {
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent) => {
      if (!e.target) {
        return;
      }
      const fileContent = (e.target as FileReader).result as string;
      try {
        const jsonData = JSON.parse(fileContent);
        sessionStorage.setItem("list", JSON.stringify(jsonData));
        onUpload(
          jsonData
            .map((data: MediaItem) => {
              return {
                author: data.author || "",
                hasConsumed: !!data.hasConsumed,
                id: data.id || crypto.randomUUID(),
                mediaFormat: data.mediaFormat,
                priority: data.priority || 0,
                notes: data.notes || "",
                title: data.title || "",
              };
            })
            .sort((a: MediaItem, b: MediaItem) => {
              return a.mediaFormat === b.mediaFormat
                ? normalizeString(a.title).localeCompare(normalizeString(b.title))
                : a.mediaFormat.toLocaleLowerCase().localeCompare(b.mediaFormat.toLocaleLowerCase());
            }),
        );
      } catch (error) {
        console.error("error", { error });
      }
    };
    reader.readAsText(file);
  };
  return <input accept=".json" className="App-upload" onChange={handleUpload} type="file" />;
};

export default UploadListInputComponent;
