import React, { useState, useEffect } from 'react';
import { getItems, addItem } from './api';
import ItemList from './components/ItemList';
import AddItemForm from './components/AddItemForm';

export default function App() {
  const [items, setItems] = useState([]);

  async function fetchItems() {
    const data = await getItems();
    setItems(data);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleAdd(item) {
    await addItem(item);
    fetchItems();
  }

  return (
    <div className="container">
      <h1>Office Inventory</h1>
      <AddItemForm onAdd={handleAdd} />
      <ItemList items={items} />
    </div>
  );
}
