import { Fragment, useEffect, useState } from "react";
import MediaItemInputComponent from "./components/MediaItemInput.component";
import MediaItemRowComponent from "./components/MediaItemRow.component";
import S3ListDownloadComponent from "./components/S3ListDownload.component";
import SearchInputComponent from "./components/SearchInput.component";
import UploadListInputComponent from "./components/UploadListInput.component";
import { ListFilter, MediaFormat, MovieFormat, VideoGameFormat } from "./App.constants";
import { MediaItem } from "./App.types";
import "./App.styles.css";

function AppComponent() {
  const [existingItem, setExistingItem] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<ListFilter | "">("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [movieFilter, setMovieFilter] = useState<MovieFormat | "">("");
  const [searchValue, setSearchValue] = useState("");
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

  return (
    <div className="App">
      <header className="App-header" />
      <SearchInputComponent onSearchChange={setSearchValue} />
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
      {items.length === 0 && <S3ListDownloadComponent onSuccess={(uploadedItems) => setItems(uploadedItems)} />}
      <MediaItemInputComponent existingItem={existingItem} onSubmit={handleSubmit} />
      {existingItem && <button onClick={() => setExistingItem(null)}>Cancel</button>}
      <br />
      {items.length > 0 && <button onClick={handleDownload}>Download list</button>}
      <ul className="App-list">
        {items
          .map((i) => ({ ...i }))
          .filter(filterList)
          .filter(searchList)
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
