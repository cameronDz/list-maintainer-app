import { MediaFormat } from "./App.constants";

export const mediaFormatMapper = (mediaFormat: MediaFormat | ""): string => {
  if (!mediaFormat) {
    return "";
  }

  const obj = {
    [MediaFormat.BOOK__HARDCOVER]: "Hardcover Book",
    [MediaFormat.BOOK__PAPERBACK]: "Paperback Book",
    [MediaFormat.MOVIE__BLUERAY]: "Bluray",
    [MediaFormat.MOVIE__BLUERAY_DVD_COMBO]: "Bluray/DVD",
    [MediaFormat.MOVIE__BLUERAY_3D_BLURAY_COMBO]: "Bluray/3D-Bluray",
    [MediaFormat.MOVIE__DVD]: "DVD",
    [MediaFormat.MOVIE__VHS]: "VHS",
    [MediaFormat.VIDEO_GAME__PC]: "PC",
    [MediaFormat.VIDEO_GAME__PS1]: "PS1",
    [MediaFormat.VIDEO_GAME__PS2]: "PS2",
    [MediaFormat.VIDEO_GAME__PS3]: "PS3",
    [MediaFormat.VIDEO_GAME__PS4]: "PS4",
    [MediaFormat.VIDEO_GAME__PS5]: "PS5",
    [MediaFormat.VIDEO_GAME__N64]: "N64",
    [MediaFormat.VIDEO_GAME__NES]: "NES",
    [MediaFormat.VIDEO_GAME__SWITCH]: "Switch",
    [MediaFormat.VIDEO_GAME__GAMECUBE]: "GameCube",
    [MediaFormat.VIDEO_GAME__WII]: "Wii",
    [MediaFormat.VIDEO_GAME__XBOX]: "XBox",
    [MediaFormat.VIDEO_GAME__XBOX_360]: "XBox 360",
    [MediaFormat.WISH_LIST__BOOK]: "Wishlist Book",
    [MediaFormat.WISH_LIST__MOVIE]: "Wishlist Movie",
    [MediaFormat.WISH_LIST__VIDEO_GAME]: "Wishlist Video Game",
  };
  return obj[mediaFormat] || "";
};
