import { MediaItem } from "../App.types";

type S3ListDownloadProps = { onUpload: (items: MediaItem[]) => void };
const S3ListDownloadComponent = ({ onUpload = (_i) => null }: S3ListDownloadProps) => {
  const handleClick = async () => {
    const url = "https://storage-data-list-maintainer.s3.us-east-1.amazonaws.com/MASTER_LIST.json";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      onUpload(jsonData);
    } catch (error) {
      console.error("Error fetching JSON file:", error);
    }
  };
  return <button onClick={handleClick}>Load from S3</button>;
};

export default S3ListDownloadComponent;
