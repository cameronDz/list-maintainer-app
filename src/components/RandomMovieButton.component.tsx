import { Fragment } from "react";
import { MediaFormat } from "../App.constants";
import { MediaItem } from "../App.types";

const RandomMovieButtonComponent = ({ items = [] }: { items: MediaItem[] }) => {
  const moviesToWatch = items.filter(
    (i) =>
      !i.hasConsumed &&
      [
        MediaFormat.MOVIE__BLUERAY,
        MediaFormat.MOVIE__BLUERAY_3D_BLURAY_COMBO,
        MediaFormat.MOVIE__BLUERAY_DVD_COMBO,
        MediaFormat.MOVIE__DVD,
      ].includes(i.mediaFormat as MediaFormat),
  );

  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * (moviesToWatch.length + 1));
    const { mediaFormat, notes, title } = moviesToWatch[randomIndex];
    const messageOne = `Movie: ${title}`;
    const messageTwo = notes ? `, ${notes}` : "";
    let messageThree = "(DVD)";
    if (mediaFormat !== MediaFormat.MOVIE__DVD)
      messageThree = mediaFormat === MediaFormat.MOVIE__BLUERAY_DVD_COMBO ? "(DVD/Bluray)" : "(Bluray)";
    alert(`${messageOne}${messageTwo} ${messageThree}`);
  };

  return (
    <Fragment>
      {moviesToWatch.length > 0 && <button onClick={handleClick}>Pick movie to watch</button>}
      {moviesToWatch.length > 0 && <br />}
    </Fragment>
  );
};

export default RandomMovieButtonComponent;
