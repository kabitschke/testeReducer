import * as C from './App.styles';
import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';
import { InfoItem } from './components';
import { Button } from './components/Button';
import { useEffect, useReducer } from 'react';
import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { GridItem } from './components/GridItem';
import { FormatTimeElapsed } from './helpers/FormatTimeElapsed';
import { AppState } from './types/AppState';
import { reducer } from './reducers/reducer';

const App = () => {


  useEffect(() => resetAndCreateGrid(), []);

  const initialState: AppState = {
    playing: false,
    timeElapsed: 0,
    moveCount: 0,
    shownCount: 0,
    gridItems: [],
  };


  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = setInterval(() => {
      if (state.playing) {
        dispatch({ type: 'increment_time_elapsed' });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [state.playing, state.timeElapsed]);






  const handleItemClick = (index: number) => {
    dispatch({ type: 'handle_item_click', payload: index });
  };



  useEffect(() => {
    if (state.shownCount === 2) {
      dispatch({ type: 'check_match' });
    }
  }, [state.shownCount, state.gridItems]);




  useEffect(() => {
    dispatch({ type: 'check_game_over' });
  }, [state.moveCount, state.gridItems]);


  const resetAndCreateGrid = () => {
    const tmpGrid: GridItemType[] = [];

    for (let i = 0; i < (items.length * 2); i++) {
      tmpGrid.push({
        item: null,
        show: false,
        permanentShow: false
      });
    }

    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let pos = -1;
        while (pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = i;
      }
    }

    dispatch({ type: 'set_grid_items', payload: tmpGrid });
    dispatch({ type: 'set_playing', payload: true });
    dispatch({ type: 'set_time_elapsed', payload: 0 });
    dispatch({ type: 'set_shown_count', payload: 0 });
    dispatch({ type: 'set_shown_count', payload: 0 });
  };



  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt="" />

        </C.LogoLink>

        <C.InfoArea>

          <InfoItem label='Tempo' value={FormatTimeElapsed(state.timeElapsed)} />
          <InfoItem label='Movimentos' value={state.moveCount.toString()} />
        </C.InfoArea>


        <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid} />


      </C.Info>

      <C.GridArea>
        <C.Grid>
          {
            state.gridItems.map((item, index) => (
              <GridItem

                key={index}
                item={item}
                onClick={() => handleItemClick(index)}




              />


            ))
          }

        </C.Grid>

      </C.GridArea>


    </C.Container>
  );

}

export default App;