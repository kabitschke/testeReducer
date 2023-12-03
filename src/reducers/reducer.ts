import { AppState } from "../types/AppState";
import { GridItemType } from "../types/GridItemType";


type SET_PLAYING = {
  type: 'set_playing';
  payload: boolean;
}

type SET_TIME_ELAPSED = {
  type: 'set_time_elapsed';
  payload: number;
}

type SET_MOVE_COUNT = {
  type: 'set_move_count';
  payload: number;
}

type SET_SHOWN_COUNT = {
  type: 'set_shown_count';
  payload: number;
}

type SET_GRID_ITEMS = {
  type: 'set_grid_items';
  payload: GridItemType[];
}


type CHECK_MATCH = {
  type: 'check_match';
};

type INCREMENT_TIME_ELAPSED = {
  type: 'increment_time_elapsed';
}

type HANDLE_ITEM_CLICK = {
  type: 'handle_item_click';
  payload: number;
}

type CHECK_GAME_OVER = {
  type: 'check_game_over';

}


type RESET_NOT_MATCHING_ITEMS = {
  type: 'reset_not_matching_items';
};











type ListAction = SET_PLAYING | SET_TIME_ELAPSED | SET_MOVE_COUNT | SET_SHOWN_COUNT | SET_GRID_ITEMS | CHECK_MATCH | INCREMENT_TIME_ELAPSED | HANDLE_ITEM_CLICK | CHECK_GAME_OVER | RESET_NOT_MATCHING_ITEMS;

export const reducer = (state: AppState, action: ListAction) => {

  switch (action.type) {
    case 'set_playing':
      return { ...state, playing: action.payload };
    case 'set_time_elapsed':
      return { ...state, timeElapsed: action.payload };

    // case 'increment_time_elapsed':
    //   return { ...state, timeElapsed: state.timeElapsed + 1 };

    case 'set_move_count':
      return { ...state, moveCount: action.payload }

    case 'set_shown_count':
      return { ...state, shownCount: action.payload }

    case 'reset_not_matching_items':
      const tmpGrid = state.gridItems.map(item => (item.show ? { ...item, show: false } : item));          
     return { ...state, gridItems: tmpGrid, shownCount: 0};  
        
        

    case 'set_grid_items':
      return { ...state, gridItems: action.payload }

    case 'handle_item_click':

      if (state.playing && action.payload !== null && state.shownCount < 2) {

        const tmpGrid = state.gridItems.map((item, i) =>
          i === action.payload &&
            !item.permanentShow &&
            !item.show
            ? { ...item, show: true }
            : item
        );

        return {
          ...state,
          gridItems: tmpGrid,
          shownCount: state.shownCount + 1
        };
      }
      return state;


      case 'check_match':
        const opened = state.gridItems.filter(item => item.show === true);

        if (opened.length === 2 && opened[0].item !== opened[1].item) {
          return {
            ...state,                
            moveCount: state.moveCount + 1
          };

        }
  
        if (opened.length === 2 && opened[0].item === opened[1].item) {
          const tmpGrid = state.gridItems.map(item =>
            item.show ? { ...item, permanentShow: true, show: false } : item
          );
          return {
            ...state,
            gridItems: tmpGrid,
            shownCount: 0,            
            moveCount: state.moveCount + 1
          };

        } else {
          setTimeout(() => {
            const tmpGrid = state.gridItems.map(item => ({ ...item, show: false }));
            return { ...state, gridItems: tmpGrid, shownCount: 0 };
          }, 1000);
          return state;
        }


    case 'check_game_over':
      if (state.moveCount > 0 && state.gridItems.every(item => item.permanentShow === true)) {
        return { ...state, playing: false };
      }
      return state;


    default:
      return state;




  }

}