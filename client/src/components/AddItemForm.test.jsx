import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddItemForm from './AddItemForm';

async function fillAndSubmit(name, quantity) {
  const user = userEvent.setup();
  if (name !== '') await user.type(screen.getByLabelText(/name/i), name);
  if (quantity !== '') await user.clear(screen.getByLabelText(/quantity/i));
  if (quantity !== '') await user.type(screen.getByLabelText(/quantity/i), String(quantity));
  await user.click(screen.getByRole('button', { name: /add/i }));
}

describe('AddItemForm validation', () => {
  test('blocks submission when name is empty', async () => {
    const onAdd = vi.fn();
    render(<AddItemForm onAdd={onAdd} />);
    await fillAndSubmit('', 5);
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });

  test('blocks submission when quantity is zero', async () => {
    const onAdd = vi.fn();
    render(<AddItemForm onAdd={onAdd} />);
    await fillAndSubmit('Tea', 0);
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByText(/quantity must be a positive/i)).toBeInTheDocument();
  });

  test('blocks submission when quantity is negative', async () => {
    const onAdd = vi.fn();
    render(<AddItemForm onAdd={onAdd} />);
    await fillAndSubmit('Tea', -1);
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByText(/quantity must be a positive/i)).toBeInTheDocument();
  });

  test('calls onAdd with item data when form is valid', async () => {
    const onAdd = vi.fn();
    render(<AddItemForm onAdd={onAdd} />);
    await fillAndSubmit('Tea', 5);
    expect(onAdd).toHaveBeenCalledWith({ name: 'Tea', quantity: 5, unit: '' });
  });
});
