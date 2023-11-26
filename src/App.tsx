import * as C from './App.styles';
import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';
import { InfoItem } from './components';
import { Button } from './components/Button';
import { useEffect, useState } from 'react';
import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { GridItem } from './components/GridItem';
import { FormatTimeElapsed } from './helpers/FormatTimeElapsed';
const App = () => {

  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []);


  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);


  const handleItemClick = (index: number) => {
    if (playing && index !== null && shownCount < 2) {
      let tmpGrid = [...gridItems];
      if (tmpGrid[index].permanentShow === false && tmpGrid[index].show === false) {
        tmpGrid[index].show = true;
        setShownCount(shownCount + 1);
      }
      setGridItems(tmpGrid);
    }

  }

  useEffect(() => {
    if (shownCount === 2) {
      let opened = gridItems.filter(item => item.show === true);
      if (opened.length === 2) {
        if (opened[0].item === opened[1].item) {
          //verifica se ambos são iguais se for mantem a imagem a mostra
          let tmpGrid = [...gridItems];
          for (let i in tmpGrid) {
            if (tmpGrid[i].show) {
              tmpGrid[i].permanentShow = true;
              tmpGrid[i].show = false;
            }
          }
          setGridItems(tmpGrid);
          setShownCount(0);

        } else {
          setTimeout(() => {

            let tmpGrid = [...gridItems];
            for (let i in tmpGrid) {
              tmpGrid[i].show = false;
            }
            setGridItems(tmpGrid);
            setShownCount(0);
          }, 1000);

        }


        setMoveCount(moveCount => moveCount + 1);
      }

    }

  }, [shownCount, gridItems]);


  //verifica se o jogo acabou
  useEffect(() => {
    if (moveCount > 0 && gridItems.every(item => item.permanentShow === true)) {
      setPlaying(false);
    }


  }, [moveCount, gridItems]);

  const resetAndCreateGrid = () => {
    setTimeElapsed(0);

    setMoveCount(0);
    setShownCount(0);
    setGridItems([]);


    let tmpGrid: GridItemType[] = [];
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

    setGridItems(tmpGrid);

    setPlaying(true);

  }


  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt="" />

        </C.LogoLink>

        <C.InfoArea>

          <InfoItem label='Tempo' value={FormatTimeElapsed(timeElapsed)} />
          <InfoItem label='Movimentos' value={moveCount.toString()} />
        </C.InfoArea>


        <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid} />


      </C.Info>

      <C.GridArea>
        <C.Grid>
          {
            gridItems.map((item, index) => (
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