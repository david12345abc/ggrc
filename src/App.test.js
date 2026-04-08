import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders home hero title', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(
    screen.getByText(/the dream of parenthood comes true here/i)
  ).toBeInTheDocument();
});
