import { GridItemType } from "./GridItemType";

export type AppState = {
  playing: boolean;
  timeElapsed: number;
  moveCount: number;
  shownCount: number;
  gridItems: GridItemType[];

}