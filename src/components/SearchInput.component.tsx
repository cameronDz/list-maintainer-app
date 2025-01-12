import { ChangeEvent, Fragment, useState } from "react";
import "./SearchInput.styles.css";

const MS_UPDATE_SEARCH_DELAY = 1000;
type SearchInputProps = { onSearchChange: (search: string) => void };
const SearchInputComponent = ({ onSearchChange = (_s) => null }: SearchInputProps) => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | 0>(0);
  const [value, setValue] = useState<string>("");

  const handleChangeCheckbox = () => {
    if (isSearching) {
      setValue("");
      onSearchChange("");
    }
    setIsSearching((prev) => !prev);
  };

  const handleChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value || "";
    setIsSearching(!!newValue);
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
    <Fragment>
      <input
        checked={isSearching}
        disabled={!isSearching}
        id="search-checkbox"
        onChange={handleChangeCheckbox}
        type="checkbox"
      />
      <label className="SearchInput-label" htmlFor="search-checkbox">
        Search
      </label>
      <input onChange={handleChangeValue} placeholder="..." value={value} />
      {timer !== 0 && <div className="SearchInput-spinner">?</div>}
    </Fragment>
  );
};

export default SearchInputComponent;
