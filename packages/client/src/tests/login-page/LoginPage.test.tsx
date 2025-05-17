import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import LoginPage from '../../pages/login-page/LoginPage';
import { store } from '../../store';

describe('LoginPage', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );
  });
  it('show error validate for input', async () => {
    const loginInput = screen.getByLabelText(/Логин/i);

    fireEvent.change(loginInput, { target: { value: 'j' } });
    await waitFor(() => {
      expect(screen.getByText(/Латиница. Мин. 3 символа/i)).toBeInTheDocument();
    });
  });

  it('handle submit not called', async () => {
    const handleSubmit = jest.fn();

    fireEvent.click(screen.getAllByText(/Авторизоваться/i)[0]);
    await waitFor(() => {
      expect(handleSubmit).not.toBeCalled();
    });
  });
});
