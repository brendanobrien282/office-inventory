import React from 'react';

export default function ItemList({ items }) {
  if (items.length === 0) {
    return <p className="empty">No items in inventory.</p>;
  }

  return (
    <table className="item-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Unit</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
            <td>{item.unit || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
