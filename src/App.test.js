import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import { DEMO_USER, seedDemoUser } from './demoUser';

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, '', '/');
});

const searchFor = (text) =>
  fireEvent.change(screen.getByLabelText('Search products'), { target: { value: text } });

test('renders the catalog as the landing page', () => {
  render(<App />);

  expect(screen.getByText(/Welcome to Our Shop/i)).toBeInTheDocument();
  expect(screen.getByText('Sunglasses')).toBeInTheDocument();
  expect(screen.getByText('6 of 6 products')).toBeInTheDocument();
});

test('search narrows the catalog down to matching products', () => {
  render(<App />);

  searchFor('watch');

  expect(screen.getByText('Smartwatch')).toBeInTheDocument();
  expect(screen.queryByText('Sunglasses')).not.toBeInTheDocument();
  expect(screen.getByText('1 of 6 products')).toBeInTheDocument();
});

test('search with no matches shows the empty state', () => {
  render(<App />);

  searchFor('no such product');

  expect(screen.getByText(/No products match your search/i)).toBeInTheDocument();
  expect(screen.getByText('0 of 6 products')).toBeInTheDocument();
});

test('price filter and search combine, and reset clears both', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText('Filter by price'), { target: { value: 'over500' } });
  expect(screen.getByText('2 of 6 products')).toBeInTheDocument();

  // Tablet коштує $420, тож разом із фільтром "Over $500" дає порожню видачу
  searchFor('tablet');
  expect(screen.getByText('0 of 6 products')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
  expect(screen.getByText('6 of 6 products')).toBeInTheDocument();
  expect(screen.getByLabelText('Search products')).toHaveValue('');
});

test('quantity stepper on a product card is clamped between 1 and 10', () => {
  render(<App />);

  const value = () => screen.getByLabelText('Quantity of Leather Wallet');
  const increase = screen.getByRole('button', { name: 'Increase quantity of Leather Wallet' });
  const decrease = screen.getByRole('button', { name: 'Decrease quantity of Leather Wallet' });

  expect(value()).toHaveTextContent('1');
  expect(decrease).toBeDisabled();

  fireEvent.click(increase);
  expect(value()).toHaveTextContent('2');

  for (let i = 0; i < 20; i += 1) fireEvent.click(increase);
  expect(value()).toHaveTextContent('10');
  expect(increase).toBeDisabled();
});

test('cancelling the removal dialog keeps the item in the cart', () => {
  localStorage.setItem(
    'cart',
    JSON.stringify([{ id: 4, name: 'Sunglasses', price: 90, image: '/images/glass.jpeg', quantity: 1 }])
  );
  window.history.pushState({}, '', '/cart');

  render(<App />);

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Remove from Cart/i }));

  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByText(/Are you sure/i)).toBeInTheDocument();

  fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByText('Sunglasses')).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('cart'))).toHaveLength(1);
});

test('seedDemoUser adds the demo account without dropping existing users', () => {
  const existing = { email: 'student@test.com', password: 'qwerty123' };
  localStorage.setItem('users', JSON.stringify([existing]));

  seedDemoUser();

  const emails = JSON.parse(localStorage.getItem('users')).map((u) => u.email);
  expect(emails).toHaveLength(2);
  expect(emails).toContain(DEMO_USER.email);
  expect(emails).toContain(existing.email);
});

test('seedDemoUser is idempotent', () => {
  seedDemoUser();
  seedDemoUser();

  expect(JSON.parse(localStorage.getItem('users'))).toHaveLength(1);
});
