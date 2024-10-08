import React from 'react';

interface MenuItem {
  product_id: number;
  product_name: string;
  description: string;
  price: number;
}

interface MenuProps {
  menuItems: MenuItem[];
}

export default function Menu({ menuItems }: MenuProps) {
  return (
    <div>
      <h1>Restaurant Menu</h1>
      <ul>
        {menuItems.map((item) => (
          <div key={item.product_id}>
            <h2>{item.product_name}</h2>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
          </div>
        ))}
      </ul>
    </div>
  );
}
