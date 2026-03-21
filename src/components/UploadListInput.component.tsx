import { ChangeEvent } from "react";
import { processData } from "../App.lib";
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
        onUpload(processData(jsonData));
      } catch (error) {
        console.error("error", { error });
      }
    };
    reader.readAsText(file);
  };
  return <input accept=".json" className="App-upload" onChange={handleUpload} type="file" />;
};

export default UploadListInputComponent;
