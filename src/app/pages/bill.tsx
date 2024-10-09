import React from 'react';

interface BillItem {
    id: number;
    name: string,
    order_id: number;
    receipt_id: number;
    total_amount: number;
}

interface BillProps {
  billItems: BillItem[];
}

export default function Bill({ billItems }: BillProps) {
  return (
    <div>
      <h1 >Bill</h1>
      <ul>
        {billItems.map((item) => (
          <div key={item.id}>
            <h2>{item.name}</h2>
            <p>Price: ${item.order_id}</p>
            <p>Price: ${item.receipt_id}</p>
          </div>
        ))}
      </ul>
      <h3>
        Total: ${billItems.reduce((total, item) => total + item.total_amount, 0)}
      </h3>
    </div>
  );
}
