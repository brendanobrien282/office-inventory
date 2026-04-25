import React, { useState, useEffect } from 'react';
import { getItems } from './api';
import ItemList from './components/ItemList';

export default function App() {
  const [items, setItems] = useState([]);

  async function fetchItems() {
    const data = await getItems();
    setItems(data);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container">
      <h1>Office Inventory</h1>
      <ItemList items={items} />
    </div>
  );
}
