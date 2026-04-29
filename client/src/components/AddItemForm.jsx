import React, { useState } from 'react';

export default function AddItemForm({ onAdd }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!quantity || parseInt(quantity, 10) <= 0) errs.quantity = 'Quantity must be a positive number';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onAdd({ name: name.trim(), quantity: parseInt(quantity, 10), unit });
    setName('');
    setQuantity('');
    setUnit('');
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        {errors.quantity && <span className="error">{errors.quantity}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="unit">Unit (optional)</label>
        <input
          id="unit"
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
      </div>
      <button type="submit" className="btn-add">Add Item</button>
    </form>
  );
}
