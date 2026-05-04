import { ChangeEvent, useState } from "react";
import "./SearchInput.styles.css";

const MS_UPDATE_SEARCH_DELAY = 1000;
type SearchInputProps = { onSearchChange: (search: string) => void };
const SearchInputComponent = ({ onSearchChange = (_s) => null }: SearchInputProps) => {
  const [timer, setTimer] = useState<NodeJS.Timeout | 0>(0);
  const [value, setValue] = useState<string>("");

  const handleChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value || "";
    setValue(newValue);
    clearTimeout(timer);
    if (!newValue) {
      onSearchChange(newValue);
      return;
    }
    const newTimer = setTimeout(() => {
      onSearchChange(newValue);
      setTimer(0);
    }, MS_UPDATE_SEARCH_DELAY);
    setTimer(newTimer);
  };

  return (
    <div className="SearchInput-wrapper">
      <label className="SearchInput-label" htmlFor="search-input">
        Search
      </label>
      <input
        className="SearchInput-field"
        id="search-input"
        onChange={handleChangeValue}
        placeholder="Search titles, authors, notes..."
        value={value}
      />
      {timer !== 0 && <div className="SearchInput-spinner">↻</div>}
    </div>
  );
};

export default SearchInputComponent;
