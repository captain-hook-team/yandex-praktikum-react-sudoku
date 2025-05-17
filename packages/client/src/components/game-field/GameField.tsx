import React, { useCallback, useEffect, useState } from 'react';
import GameCell from '../game-cell/GameCell';
import mockField from './mockField';
import style from './GameField.module.scss';
import addOrRemove from '../../utils/addOrRemove';
import { GameFieldButton, InputNumberButton } from '../buttons';
import { GAME_BUTTONS } from '../../constants/constants';
import Popup from '../popup/Popup';
import { GameOverForm } from '..';

export interface CellInfo {
  colIndex: number;
  correctValue: number | null;
  isFixed: boolean;
  notes: number[];
  rowIndex: number;
  value: number | null;
}

interface IFullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  msRequestFullscreen?: () => void;
}

interface IDocument {
  webkitExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  msExitFullscreen?: () => void;
  exitFullscreen?: () => void;
}

function GameField() {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);
  const [field, setField] = useState<CellInfo[][]>(JSON.parse(JSON.stringify(mockField)));
  const [isEnabledNotes, setIsEnabledNotes] = useState<boolean>(false);
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState<boolean>(false);
  const [moveHistory, setMoveHistory] = useState<CellInfo[]>([]);
  const [selectedCell, setSelectedCell] = useState<CellInfo>();
  const [countHints, setCountHints] = useState<number>(0);
  const [countErrors, setCountErrors] = useState<number>(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleRefreshField = () => {
    setField(JSON.parse(JSON.stringify(mockField)));
    setCountHints(0);
    setCountErrors(0);
    setSelectedCell(undefined);
    setMoveHistory([]);
    setIsEnabledNotes(false);
    setPopupOpen(false);
    setIsGameOverOpen(false);
  };

  const handleCheckGameOver = useCallback(() => {
    const checkUncorrectedValue = field.some((row) =>
      row.some((currentCell) => {
        const { value, correctValue } = currentCell;

        return value !== correctValue;
      })
    );

    if (!checkUncorrectedValue) {
      setIsGameOverOpen(true);
    }
  }, [field]);

  const handleChangeValue = useCallback(
    (newValue: number | null): void => {
      if (!selectedCell) return;
      if (countErrors > 2) return;

      const { rowIndex, colIndex, isFixed, correctValue } = selectedCell;

      if (isFixed) {
        alert('Нельзя менять изначальные значения');
        return;
      }

      const newField = [...field];
      const currentCell = newField[rowIndex][colIndex];
      const copyCurrentCell = structuredClone(currentCell);

      setMoveHistory((prevState: CellInfo[]) =>
        [...prevState, copyCurrentCell].slice(-50)
      );

      if (isEnabledNotes) {
        if (!newValue) {
          currentCell.notes = [];
        } else {
          addOrRemove(currentCell.notes, newValue);
        }
      } else {
        currentCell.value = newValue;
      }

      setField(newField);
      handleCheckGameOver();

      if (newValue !== correctValue) {
        if (countErrors === 2) {
          setTimeout(() => setIsGameOverOpen(true), 500);
        }

        setCountErrors((prevState) => prevState + 1);
      }
    },
    [selectedCell, isEnabledNotes, countErrors]
  );

  const handleHelpValue = useCallback((): void => {
    if (!selectedCell) return;

    const { correctValue, isFixed } = selectedCell;

    if (isFixed) {
      alert('Нельзя менять изначальные значения');
      return;
    }

    if (countHints < 3) {
      setCountHints((prevState) => prevState + 1);
      handleChangeValue(correctValue);
    }
  }, [selectedCell, isEnabledNotes, countHints]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key >= '1' && event.key <= '9') {
      handleChangeValue(parseInt(event.key, 10));
    }
  };

  const undoLastMove = useCallback(() => {
    if (moveHistory.length === 0) return;

    const lastState = moveHistory[moveHistory.length - 1];

    const newField = [...field];
    newField[lastState.rowIndex][lastState.colIndex] = lastState;
    setField(newField);

    setSelectedCell(lastState);
    setMoveHistory((prevState: CellInfo[]) => prevState.slice(0, -1));
  }, [moveHistory]);

  const enterFullscreen = () => {
    const fullscreenElement = document.body as IFullscreenElement;

    if (fullscreenElement.requestFullscreen) {
      fullscreenElement.requestFullscreen();
    } else if (fullscreenElement.webkitRequestFullscreen) {
      fullscreenElement.webkitRequestFullscreen();
    } else if (fullscreenElement.mozRequestFullScreen) {
      fullscreenElement.mozRequestFullScreen();
    } else if (fullscreenElement.msRequestFullscreen) {
      fullscreenElement.msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    const documentF = document as IDocument;

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (documentF.webkitExitFullscreen) {
      documentF.webkitExitFullscreen();
    } else if (documentF.mozCancelFullScreen) {
      documentF.mozCancelFullScreen();
    } else if (documentF.msExitFullscreen) {
      documentF.msExitFullscreen();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  };

  return (
    <>
      <GameOverForm
        isOpen={isGameOverOpen}
        countErrors={countErrors}
        handleRefreshField={handleRefreshField}
      />
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={style.section}
        onKeyDown={handleKeyDown}
      >
        <Popup
          isOpen={isPopupOpen}
          title="Как играть"
          onClose={() => setPopupOpen(false)}
        >
          <p>
            Игровое поле представляет собой сетку с ячейками размером 9х9,
            разделённую на меньшие сетки со стороной в 3 ячейки. Таким образом,
            всё игровое поле состоит из 81 ячейки. В начале игры в них уже стоят
            некоторые цифры (от 1 до 9).
            <br />
            От игрока требуется заполнить свободные ячейки цифрами от 1 до 9 так,
            чтобы в каждой строке, в каждом столбце и в каждом малом квадрате 3х3
            каждая цифра встречалась бы только один раз.
            <br />
            В игре есть несколько полезных функций, таких как «Очистить»,
            «Восстановить», «Заметки», «Подсказка».
            <br />
            <br />
            «Очистить» - стирает введенную ранее в поле цифру. Есть возможность
            стереть только введенные вами цифры. Цифры, что стояли в ячейках на
            начало игры удалению не подлежат.
            <br />
            «Восстановить» - стирает все введенные вами цифры во всех ячейках.
            Цифры, что стояли в ячейках на начало игры не удаляются.
            <br />
            «Заметки» - позволяет ставить заметки в ячейках.
            <br />
            «Подсказка» - вставляет в выбранную вами ячейку верную цифру.
          </p>
        </Popup>
        <div className={style.gameHeader}>
          <span>{`${new Date().getHours()}:${new Date().getSeconds()}`}</span>
          <span style={{ fontWeight: '900', fontSize: '30px', display: 'flex', gap: '5px' }}>
            {Array(countErrors).fill('X').map((item) => (<span style={{ color: 'red' }}>{item}</span>))}
            {Array(3 - countErrors).fill('X').map((item) => (<span>{item}</span>))}
          </span>
          <button
            className={style.gameHeader_button}
            onClick={() => setPopupOpen(true)}
            type="button"
          >
            <img
              src="./hints.svg"
              alt="Иконка кнопки"
            />
          </button>
        </div>
        <div className={style.main}>
          {field.map((row, rowIndex) =>
            row.map((currentCell, colIndex) => {
              const key = `${rowIndex}${colIndex}`;

              return (
                <GameCell
                  key={key}
                  colIndex={colIndex}
                  currentCell={currentCell}
                  onClick={() => setSelectedCell(currentCell)}
                  rowIndex={rowIndex}
                  selectedCell={selectedCell}
                />
              );
            })
          )}
        </div>

        <div className={style.buttons}>
          <GameFieldButton
            srcImage="./clear-button.svg"
            onClick={() => handleChangeValue(null)}
            titleBtn="Очистить"
          />
          <GameFieldButton
            srcImage="./back-move-button.svg"
            onClick={() => undoLastMove()}
            titleBtn="Восстановить"
          />
          <GameFieldButton
            srcImage="./notes-button.svg"
            onClick={() => setIsEnabledNotes(!isEnabledNotes)}
            isHighlight={isEnabledNotes}
            titleBtn="Заметки"
          />
          <GameFieldButton
            srcImage="./help-button.svg"
            onClick={() => handleHelpValue()}
            titleBtn="Подсказка"
            count={3 - countHints}
          />
          <GameFieldButton
            srcImage="./fullscreen.svg"
            onClick={toggleFullscreen}
            titleBtn={isFullscreen ? 'Выйти из полноэкранного режима' : 'На весь экран'}
          />
        </div>

        <div className={style.gameButtons}>
          {GAME_BUTTONS.map((item: number) => (
            <InputNumberButton
              value={item}
              onClick={() => handleChangeValue(item)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default GameField;
