import { Fragment, KeyboardEvent, useEffect, useState } from "react";
import DropDownMediaType from "./components/DropDownMediaFormat.component";
import MediaItemRowComponent from "./components/MediaItemRow.component";
import UploadListInputComponent from "./components/UploadListInput.component";
import { ListFilter, MediaFormat, MovieFormat, VideoGameFormat } from "./App.constants";
import { normalizeString } from "./App.lib";
import { MediaItem } from "./App.types";
import "./App.styles.css";

function AppComponent() {
  const [author, setAuthor] = useState("");
  const [filter, setFilter] = useState<ListFilter | "">("");
  const [hasConsumed, setHasConsumed] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [itemId, setItemId] = useState("");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [mediaFormat, setMediaFormat] = useState<MediaFormat | "">("");
  const [movieFilter, setMovieFilter] = useState<MovieFormat | "">("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [title, setTitle] = useState("");
  const [videoGameFilter, setVideoGameFilter] = useState<VideoGameFormat | "">("");

  useEffect(() => {
    const storedItems = localStorage.getItem("list");
    if (Array.isArray(storedItems)) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    setIsSearch(!!searchText);
  }, [searchText]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const clearFields = () => {
    setAuthor("");
    setHasConsumed(false);
    setItemId("");
    setMediaFormat("");
    setNotes("");
    setPriority(0);
    setTitle("");
  };

  const handleSubmit = () => {
    if (!title || !mediaFormat) {
      return;
    }

    const matchesExistingMedia = items.some((item) => {
      return item.title === title && item.mediaFormat === mediaFormat && item.notes === notes && item.id !== itemId;
    });
    if (matchesExistingMedia) {
      alert("media exists in list already");
      return;
    }
    const item: MediaItem = {
      author: author.trim(),
      hasConsumed,
      id: itemId || crypto.randomUUID(),
      mediaFormat,
      notes: notes.trim(),
      priority,
      title: title.trim(),
    };
    if (!itemId) {
      setItems((prev) => [item, ...prev]);
    } else {
      setItems((prev) => [...prev].map((prevItem) => (itemId !== prevItem.id ? prevItem : item)));
    }
    clearFields();
  };

  const handleChangeConsumed = (idToUpdate: string) => {
    setItems((prev) =>
      [...prev].map((prevItem) => {
        return prevItem.id !== idToUpdate ? prevItem : { ...prevItem, hasConsumed: !prevItem.hasConsumed };
      }),
    );
  };

  const handleChangeFilter = (option: ListFilter) => {
    setFilter(option);
    setMovieFilter("");
    setVideoGameFilter("");
  };

  const handleChangeSearch = () => {
    setIsSearch((prev) => !prev);
    if (isSearch) {
      setSearchText("");
    }
  };

  const handleCheckFilter = () => {
    if (filter) {
      setFilter("");
      setMovieFilter("");
      setVideoGameFilter("");
    }
    setIsFiltered((prev) => !prev);
  };

  const handleDelete = (idToRemove: string) => {
    const name = items.find((i) => i.id === idToRemove)?.title;
    const confimMessage = `Are you sure you want to delete: ${name}`;
    // eslint-disable-next-line no-restricted-globals
    const confirmed = confirm(confimMessage);
    if (confirmed) {
      setItems([...items.filter((item) => item.id !== idToRemove)]);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    const jsonStr = JSON.stringify(items);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `data-${new Date().toISOString()}.json`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEdit = (item: MediaItem) => {
    setAuthor(item.author);
    setHasConsumed(item.hasConsumed);
    setItemId(item.id);
    setMediaFormat(item.mediaFormat);
    setNotes(item.notes);
    setPriority(item.priority);
    setTitle(item.title);
  };

  const filterList = (item: MediaItem) => {
    if (!isFiltered || !filter) {
      return true;
    }
    if (filter === ListFilter.BOOK) {
      return item.mediaFormat.startsWith("BOOK__");
    }
    if (filter === ListFilter.MOVIE) {
      return item.mediaFormat.startsWith("MOVIE__");
    }
    if (filter === ListFilter.VIDEO_GAME) {
      if (!item.mediaFormat.startsWith("VIDEO_GAME__")) {
        return false;
      }
      return !videoGameFilter || item.mediaFormat.endsWith(videoGameFilter);
    }
    if (filter === ListFilter.WISH_LIST__BOOK) {
      return item.mediaFormat === MediaFormat.WISH_LIST__BOOK;
    }
    if (filter === ListFilter.WISH_LIST__MOVIE) {
      return item.mediaFormat === MediaFormat.WISH_LIST__MOVIE;
    }
    if (filter === ListFilter.WISH_LIST__VIDEO_GAME) {
      return item.mediaFormat === MediaFormat.WISH_LIST__VIDEO_GAME;
    }
    return false;
  };

  const searchList = (item: MediaItem) => {
    if (!isSearch) {
      return true;
    }
    const value = (searchText || "").toLocaleLowerCase();
    return (
      item.title?.toLocaleLowerCase().includes(value) ||
      item.author?.toLocaleLowerCase().includes(value) ||
      item.notes?.toLocaleLowerCase().includes(value)
    );
  };

  const sortList = (a: MediaItem, b: MediaItem) => {
    return isSorted ? normalizeString(a.title).localeCompare(normalizeString(b.title)) : 0;
  };

  return (
    <div className="App">
      <header className="App-header" />
      <input
        checked={isSearch}
        disabled={!isSearch}
        id="search-checkbox"
        onChange={handleChangeSearch}
        type="checkbox"
      />
      <label className="App-list-manipulator-label" htmlFor="search-checkbox">
        Search
      </label>
      <input onChange={(e) => setSearchText(e.target.value || "")} placeholder="..." value={searchText} />
      <br />
      <input checked={isSorted} id="sorted-checkbox" onChange={() => setIsSorted((prev) => !prev)} type="checkbox" />
      <label className="App-list-manipulator-label" htmlFor="sorted-checkbox">
        Sort
      </label>
      <br />
      <input checked={isFiltered} id="filtered-checkbox" onChange={handleCheckFilter} type="checkbox" />
      <label className="App-list-manipulator-label" htmlFor="filtered-checkbox">
        Filter
      </label>
      {isFiltered && (
        <Fragment>
          {Object.values(ListFilter).map((filterOpt) => {
            let countDisplay = "";
            if (filterOpt.startsWith("WISH_LIST")) {
              countDisplay = items.filter((i) => i.mediaFormat.toString() === filterOpt.toString()).length.toString();
            } else {
              const filteredList = items.filter((i) => i.mediaFormat.startsWith(filterOpt));
              const consumedCount = filteredList.filter((i) => i.hasConsumed).length;
              countDisplay = `${consumedCount}/${filteredList.length}`;
            }
            return (
              <Fragment key={filterOpt}>
                <br />
                <input
                  checked={filter === filterOpt}
                  id={filterOpt}
                  onChange={() => handleChangeFilter(filterOpt)}
                  type="radio"
                  value={filterOpt}
                />
                <label htmlFor={filterOpt}>{`${filterOpt} (${countDisplay})`}</label>
                {filter === ListFilter.MOVIE && filterOpt === ListFilter.MOVIE && (
                  <div className="App-list-sub-filter">
                    {Object.values(MovieFormat).map((mf) => {
                      return (
                        <Fragment key={mf}>
                          <input
                            checked={movieFilter === mf}
                            id={mf}
                            onChange={() => setMovieFilter(mf)}
                            type="radio"
                            value={mf}
                          />
                          <label htmlFor={mf}>
                            {mf}
                            {` (${items.filter((i) => i.mediaFormat.endsWith(mf)).length})`}
                          </label>
                          <br />
                        </Fragment>
                      );
                    })}
                  </div>
                )}
                {filter === ListFilter.VIDEO_GAME && filterOpt === ListFilter.VIDEO_GAME && (
                  <div className="App-list-sub-filter">
                    {Object.values(VideoGameFormat).map((vgf) => {
                      return (
                        <Fragment key={vgf}>
                          <input
                            checked={videoGameFilter === vgf}
                            id={vgf}
                            onChange={() => setVideoGameFilter(vgf)}
                            type="radio"
                            value={vgf}
                          />
                          <label htmlFor={vgf}>
                            {vgf}
                            {` (${items.filter((i) => i.mediaFormat.endsWith(vgf)).length})`}
                          </label>
                          <br />
                        </Fragment>
                      );
                    })}
                  </div>
                )}
              </Fragment>
            );
          })}
        </Fragment>
      )}
      {items.length === 0 && <UploadListInputComponent onUpload={(uploadedItems) => setItems(uploadedItems)} />}
      <div className="App-input">
        <input
          onChange={(e) => setTitle(e.target.value || "")}
          onKeyDown={handleKeyDown}
          placeholder="title"
          value={title}
        />
      </div>
      <div className="App-input">
        <DropDownMediaType mediaFormat={mediaFormat} onSelect={setMediaFormat} />
      </div>
      <div className="App-input">
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
      <div className="App-input">
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
      <div className="App-input">
        <input
          onChange={(e) => setAuthor(e.target.value || "")}
          onKeyDown={handleKeyDown}
          placeholder="author"
          value={author}
        />
      </div>
      <div className="App-input">
        <textarea
          onChange={(e) => setNotes(e.target.value || "")}
          onKeyDown={handleKeyDown}
          placeholder="notes"
          value={notes}
        />
      </div>
      <button className="App-submit-btn" disabled={!mediaFormat || !title} onClick={handleSubmit}>
        {!itemId ? "Submit" : "Save"}
      </button>
      {itemId && <button onClick={clearFields}>Cancel</button>}
      <br />
      {items.length > 0 && <button onClick={handleDownload}>Download list</button>}
      <ul className="App-list">
        {items
          .map((i) => ({ ...i }))
          .sort(sortList)
          .filter(filterList)
          .filter(searchList)
          .map((item) => (
            <li
              key={`${item.id}-${item.mediaFormat}-${item.title}${item.notes ? "-" + item.notes : ""}`}
              className={`App-list-item ID:${item.id}`}
            >
              <MediaItemRowComponent
                itemAuthor={item.author}
                itemHasConsumed={item.hasConsumed}
                itemMediaFormat={item.mediaFormat}
                itemNotes={item.notes}
                itemPriority={item.priority}
                itemTitle={item.title}
                onChangeConsumed={() => handleChangeConsumed(item.id)}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}

export default AppComponent;
