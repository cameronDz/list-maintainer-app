import backupListData from "../assets/backup-list.json";
import { MediaItem } from "../App.types";

type LoadBackupListButtonProps = { onLoad: (data: MediaItem[]) => void };
const LoadBackupListButtonComponent = ({ onLoad }: LoadBackupListButtonProps) => {
  return <button onClick={() => onLoad(backupListData as MediaItem[])}>Load Backup List</button>;
};

export default LoadBackupListButtonComponent;
