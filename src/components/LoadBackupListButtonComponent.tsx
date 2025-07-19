import { MediaItem } from "../App.types";

type LoadBackupListButtonProps = { onLoad: (data: MediaItem[]) => void };

const LoadBackupListButtonComponent = ({ onLoad }: LoadBackupListButtonProps) => {
  const handleLoadBackup = async () => {
    try {
      const response = await fetch('/assets/data.json');
      const backupListData = await response.json();
      onLoad(backupListData as MediaItem[]);
    } catch (error) {
      console.error('Failed to load backup data:', error);
    }
  };

  return <button onClick={handleLoadBackup}>Load Backup List</button>;
};

export default LoadBackupListButtonComponent;
