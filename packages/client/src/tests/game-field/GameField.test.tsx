import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import GameField from '../../components/game-field/GameField';
import NumbersCanvas from '../../components/numbers-canvas/NumbersCanvas';
import 'jest-canvas-mock';
import { store } from '../../store';

describe.skip('GameField', () => {
  it('game sudoku draws', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <GameField />
        </MemoryRouter>
      </Provider>
    );

    const cells = screen.getAllByRole('button');
    const gameCells = cells.slice(0, 81);
    const canvases = screen.getAllByTestId('sudoku-canvas');

    expect(cells.length).toBe(96);

    gameCells.forEach((cell) => {
      expect(cell).toBeInTheDocument();
    });

    expect(canvases.length).toBeGreaterThan(0);
  });

  it('drawing the value in the cell', async () => {
    const element = render(<NumbersCanvas value={5} color="black" size={40} />).getByTestId('sudoku-canvas') as HTMLCanvasElement;
    const context = element.getContext('2d') as jest.Mocked<CanvasRenderingContext2D>;

    expect(context.fillText).toHaveBeenCalledWith('5', expect.any(Number), expect.any(Number));
  });
});
