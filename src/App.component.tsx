import { Fragment, useEffect, useState } from "react";
import LoadBackupListButtonComponent from "./components/LoadBackupListButtonComponent";
import MediaItemInputComponent from "./components/MediaItemInput.component";
import MediaItemRowComponent from "./components/MediaItemRow.component";
import RandomMovieButtonComponent from "./components/RandomMovieButton.component";
import SearchInputComponent from "./components/SearchInput.component";
import UploadListInputComponent from "./components/UploadListInput.component";
import { ListFilter, MediaFormat, MovieFormat, VideoGameFormat } from "./App.constants";
import { MediaItem } from "./App.types";
import "./App.styles.css";

function AppComponent() {
  const [existingItem, setExistingItem] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<ListFilter | "">("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [movieFilter, setMovieFilter] = useState<MovieFormat | "">("");
  const [searchValue, setSearchValue] = useState("");
  const [videoGameFilter, setVideoGameFilter] = useState<VideoGameFormat | "">("");

  useEffect(() => {
    try {
    fetch("assets/data.json")
      .then((response) => response.json())
      .then((data: MediaItem[]) => setItems(data));
    } catch (_err) {
      // ignored
    }
  }, []);

  const handleSubmit = (item: MediaItem) => {
    if (!item.title || !item.mediaFormat) {
      return false;
    }

    const matchesExistingMedia = items.some((existing) => {
      return (
        existing.title === item.title &&
        existing.mediaFormat === item.mediaFormat &&
        existing.notes === item.notes &&
        existing.id !== item.id
      );
    });
    if (matchesExistingMedia) {
      alert("media exists in list already");
      return false;
    }
    if (!existingItem) {
      setItems((prev) => [item, ...prev]);
    } else {
      setItems((prev) => [...prev].map((prevItem) => (existingItem?.id !== prevItem.id ? prevItem : item)));
    }
    setExistingItem(null);
    return true;
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
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const day = String(new Date().getDate()).padStart(2, "0");
    link.download = `MASTER_LIST-${year}_${month}_${day}.json`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filterList = (item: MediaItem) => {
    if (!isFiltered || !filter) {
      return true;
    }
    if (filter === ListFilter.BOOK) {
      return item.mediaFormat.startsWith("BOOK__");
    }
    if (filter === ListFilter.MOVIE) {
      if (!item.mediaFormat.startsWith("MOVIE__")) {
        return false;
      }
      return !movieFilter || item.mediaFormat.endsWith(movieFilter);
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
    if (!searchValue) {
      return true;
    }
    const value = searchValue.toLocaleLowerCase();
    return (
      item.title?.toLocaleLowerCase().includes(value) ||
      item.author?.toLocaleLowerCase().includes(value) ||
      item.notes?.toLocaleLowerCase().includes(value)
    );
  };

  const sortList = (a: MediaItem, b: MediaItem) => {
    if (!isSorted) {
      return 0;
    }
    // Sort by priority (highest to lowest)
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    // Then sort alphabetically by title
    return a.title.localeCompare(b.title);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-header-title">Media List</h1>
        <p className="App-header-subtitle">Track your books, movies, and video games</p>
      </header>
      <RandomMovieButtonComponent items={items} />
      <div className="App-toolbar">
        <SearchInputComponent onSearchChange={setSearchValue} />
        <label className="App-toolbar-toggle">
          <input checked={isFiltered} id="filtered-checkbox" onChange={handleCheckFilter} type="checkbox" />
          <span className="App-list-manipulator-label">Filter</span>
        </label>
        <label className="App-toolbar-toggle">
          <input checked={isSorted} id="sorted-checkbox" onChange={() => setIsSorted((prev) => !prev)} type="checkbox" />
          <span className="App-list-manipulator-label">Sort by Priority</span>
        </label>
      </div>
      {isFiltered && (
        <div className="App-filter-panel">
          <div className="App-filter-options">
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
                  <label className="App-filter-radio-label">
                    <input
                      checked={filter === filterOpt}
                      id={filterOpt}
                      onChange={() => handleChangeFilter(filterOpt)}
                      type="radio"
                      value={filterOpt}
                    />
                    {`${filterOpt} (${countDisplay})`}
                  </label>
                  {filter === ListFilter.MOVIE && filterOpt === ListFilter.MOVIE && (
                    <div className="App-list-sub-filter">
                      {Object.values(MovieFormat).map((mf) => {
                        return (
                          <label key={mf} className="App-filter-radio-label">
                            <input
                              checked={movieFilter === mf}
                              id={mf}
                              onChange={() => setMovieFilter(mf)}
                              type="radio"
                              value={mf}
                            />
                            {mf}
                            {` (${items.filter((i) => i.mediaFormat.endsWith(mf)).length})`}
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {filter === ListFilter.VIDEO_GAME && filterOpt === ListFilter.VIDEO_GAME && (
                    <div className="App-list-sub-filter">
                      {Object.values(VideoGameFormat).map((vgf) => {
                        return (
                          <label key={vgf} className="App-filter-radio-label">
                            <input
                              checked={videoGameFilter === vgf}
                              id={vgf}
                              onChange={() => setVideoGameFilter(vgf)}
                              type="radio"
                              value={vgf}
                            />
                            {vgf}
                            {` (${items.filter((i) => i.mediaFormat.endsWith(vgf)).length})`}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      )}
      {items.length === 0 && (
        <div className="App-upload-area">
          <p>No list loaded. Upload a saved JSON file or load the backup.</p>
          <UploadListInputComponent onUpload={(uploadedItems) => setItems(uploadedItems)} />
          <LoadBackupListButtonComponent onLoad={(uploadedItems) => setItems(uploadedItems)} />
        </div>
      )}
      <div className="App-form-section">
        <p className="App-form-section-title">{existingItem ? "Edit Item" : "Add Item"}</p>
        <MediaItemInputComponent existingItem={existingItem} onSubmit={handleSubmit} />
        {existingItem && (
          <button className="App-btn-secondary" onClick={() => setExistingItem(null)}>
            Cancel
          </button>
        )}
      </div>
      <div className="App-actions">
        {items.length > 0 && (
          <button className="App-btn-primary" onClick={handleDownload}>
            Download list
          </button>
        )}
      </div>
      <ul className="App-list">
        {items
          .map((i) => ({ ...i }))
          .filter(filterList)
          .filter(searchList)
          .sort(sortList)
          .map((item) => {
            return (
              <li key={item.id} className={`App-list-item ID:${item.id}`}>
                <MediaItemRowComponent
                  isActionDisabled={!!existingItem}
                  itemAuthor={item.author}
                  itemHasConsumed={item.hasConsumed}
                  itemMediaFormat={item.mediaFormat}
                  itemNotes={item.notes}
                  itemPriority={item.priority}
                  itemTitle={item.title}
                  onChangeConsumed={() => handleChangeConsumed(item.id)}
                  onDelete={() => handleDelete(item.id)}
                  onEdit={() => setExistingItem(item)}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default AppComponent;
