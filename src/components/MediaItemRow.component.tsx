import classNames from "classnames";
import { MediaFormat } from "../App.constants";
import { mediaFormatMapper } from "../App.mapper";
import "./MediaItemRow.styles.css";

type MediaItemRowProps = {
  itemAuthor: string;
  itemHasConsumed: boolean;
  itemMediaFormat: MediaFormat | "";
  itemNotes: string;
  itemPriority?: number;
  itemTitle: string;
  onChangeConsumed: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

const MediaItemRowComponent = ({
  itemAuthor = "",
  itemHasConsumed = false,
  itemMediaFormat = "",
  itemNotes = "",
  itemPriority = 0,
  itemTitle = "",
  onChangeConsumed = () => {},
  onDelete = () => {},
  onEdit = () => {},
}: MediaItemRowProps) => {
  return (
    <div className={classNames("MediaItemRow-container", itemPriority && "with-priority-range")}>
      {itemPriority > 0 && (
        <input
          className="MediaItemRow-priority-range"
          disabled={true}
          max={100}
          min={0}
          title={`priority ${itemPriority}/100`}
          type="range"
          value={itemPriority}
        />
      )}
      <div className="MediaItemRow-btn-wrapper">
        <button className="MediaItemRow-btn" onClick={onDelete}>
          Delete
        </button>
        <button className="MediaItemRow-btn" onClick={onEdit}>
          Edit
        </button>
      </div>
      <div>
        <div className="MediaItemRow-title-top-row">
          {!itemMediaFormat.startsWith("WISH_LIST") && (
            <input checked={itemHasConsumed} onChange={onChangeConsumed} type="checkbox" />
          )}
          <span className="MediaItemRow-type">{mediaFormatMapper(itemMediaFormat)}:</span>
          <strong>{itemTitle}</strong>
        </div>
        <div className="MediaItemRow-title-bottom-row">
          {itemAuthor && (
            <span className="MediaItemRow-author">
              <span>by -</span>
              <strong className="MediaItemRow-author">{itemAuthor}</strong>
            </span>
          )}
          {itemNotes && (
            <ul className="MediaItemRow-notes-wrapper">
              <li className="MediaItemRow-notes">{itemNotes}</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaItemRowComponent;
