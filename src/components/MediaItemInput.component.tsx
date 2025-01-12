import { Fragment, KeyboardEvent, useEffect, useState } from "react";
import { MediaFormat } from "../App.constants";
import { MediaItem } from "../App.types";
import DropDownMediaFormat from "./DropDownMediaFormat.component";
import "./MediaItemInput.styles.css";

type MediaItemInputProps = { existingItem: MediaItem | null; onSubmit: (item: MediaItem) => boolean };
const MediaItemInputComponent = ({ existingItem = null, onSubmit = (_i) => false }: MediaItemInputProps) => {
  const [author, setAuthor] = useState<string>("");
  const [hasConsumed, setHasConsumed] = useState<boolean>(false);
  const [mediaFormat, setMediaFormat] = useState<MediaFormat | "">("");
  const [notes, setNotes] = useState<string>("");
  const [priority, setPriority] = useState<number>(0);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    setAuthor(existingItem?.author || "");
    setHasConsumed(existingItem?.hasConsumed || false);
    setMediaFormat(existingItem?.mediaFormat || "");
    setNotes(existingItem?.notes || "");
    setPriority(existingItem?.priority || 0);
    setTitle(existingItem?.title || "");
  }, [existingItem]);

  const clearItem = () => {
    setAuthor("");
    setHasConsumed(false);
    setMediaFormat("");
    setNotes("");
    setPriority(0);
    setTitle("");
  };

  const handleSubmit = () => {
    const id = existingItem?.id || crypto.randomUUID();
    const item = { author, hasConsumed, id, mediaFormat, notes, priority, title };
    const isSuccessful = onSubmit(item);
    if (isSuccessful) {
      clearItem();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Fragment>
      <div className="MediaItemInput-input">
        <input
          onChange={(e) => setTitle(e.target.value || "")}
          onKeyDown={handleKeyDown}
          placeholder="title"
          value={title}
        />
      </div>
      <div className="MediaItemInput-input">
        <DropDownMediaFormat mediaFormat={mediaFormat} onSelect={setMediaFormat} />
      </div>
      <div className="MediaItemInput-input">
        <input
          checked={hasConsumed}
          disabled={!mediaFormat || mediaFormat.startsWith("WISH_LIST")}
          name="consumed-checkbox"
          onChange={() => setHasConsumed((prev) => !prev)}
          onKeyDown={handleKeyDown}
          type="checkbox"
        />
        <label htmlFor="consumed-checkbox">
          {mediaFormat.startsWith("BOOK") && "has read"}
          {mediaFormat.startsWith("MOVIE") && "has watched"}
          {mediaFormat.startsWith("VIDEO_GAME") && "has played"}
        </label>
      </div>
      <div className="MediaItemInput-input">
        <label htmlFor="priority-range">Priority</label>
        <input
          max="100"
          min="0"
          name="priority-range"
          onChange={(e) => setPriority(Number(e.target.value || 0))}
          step="1"
          title={`${priority}`}
          type="range"
          value={priority}
        />
      </div>
      <div className="MediaItemInput-input">
        <input
          onChange={(e) => setAuthor(e.target.value || "")}
          onKeyDown={handleKeyDown}
          placeholder="author"
          value={author}
        />
      </div>
      <div className="MediaItemInput-input">
        <textarea
          onChange={(e) => setNotes(e.target.value || "")}
          onKeyDown={handleKeyDown}
          placeholder="notes"
          value={notes}
        />
      </div>
      <button className="MediaItemInput-submit-btn" disabled={!mediaFormat || !title} onClick={handleSubmit}>
        {!existingItem?.id ? "Submit" : "Save"}
      </button>
    </Fragment>
  );
};

export default MediaItemInputComponent;
