import { Fragment } from "react";
import { MediaFormat } from "../App.constants";
import { mediaFormatMapper } from "../App.mapper";

type DropDownMediaFormatProps = {
  mediaFormat: MediaFormat | "";
  onSelect: (value: MediaFormat | "") => void;
};
const DropDownMediaFormatComponent = ({
  mediaFormat = "",
  onSelect = (_value: string) => {},
}: DropDownMediaFormatProps) => {
  const handleChange = (e: { target: { value: string } }) => {
    onSelect((e.target.value as MediaFormat) || "");
  };
  return (
    <Fragment>
      <select id="media-type-select" name="mediaType" onChange={handleChange} value={mediaFormat}>
        <option value="" disabled>
          Choose media fromat
        </option>
        <Fragment>
          {Object.values(MediaFormat).map((value) => {
            return (
              <option key={value} value={value}>
                {mediaFormatMapper(value)}
              </option>
            );
          })}
        </Fragment>
      </select>
    </Fragment>
  );
};

export default DropDownMediaFormatComponent;
