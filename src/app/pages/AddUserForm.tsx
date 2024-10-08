import React, { useState, useEffect } from "react";

export default function AddUserAndAllocateTableForm() {
  const [phNumber, setPhNumber] = useState("");
  const [name, setName] = useState("");
  const [tableNum, setTableNum] = useState("");
  const [allocateSeats, setAllocateSeats] = useState("");
  const [allocateStatus, setAllocateStatus] = useState("Available");
  const [orderId, setOrderId] = useState("");

  interface MenuItem {
    item_id: number;
    item_name: string;
    price: number;
  }

  interface OrderItem extends MenuItem {
    quantity: number;
  }

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("/api/menu");
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const addItemToOrder = (item: MenuItem) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((orderItem) => orderItem.item_id === item.item_id);
      if (existingItem) {
        return prevItems.map((orderItem) =>
          orderItem.item_id === item.item_id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });

    setTotalItemsCount((prevCount) => prevCount + 1);
    setTotalPrice((prevTotal) => prevTotal + item.price);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      ph_number: phNumber,
      name,
      table_num: tableNum,
      allocate_seats: allocateSeats,
      allocate_status: allocateStatus,
      order_id: orderId,
      order_items: orderItems.map((item) => ({
        item_id: item.item_id,
        quantity: item.quantity,
      })),
      total_price: totalPrice.toFixed(2),
      total_items: totalItemsCount,
    };

    try {
      const response = await fetch("/api/addcustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("User added, table allocated, and order placed successfully");
        setPhNumber("");
        setName("");
        setTableNum("");
        setAllocateSeats("");
        setAllocateStatus("Available");
        setOrderId("");
        setOrderItems([]);
        setTotalItemsCount(0);
        setTotalPrice(0);
      } else {
        const data = await response.json();
        alert(`Failed to add user, allocate table, and place order: ${data.error}`);
      }
    } catch (error) {
      console.error("Error adding user or allocating table or placing order:", error);
      alert("An error occurred while adding the user, allocating the table, and placing the order");
    }
  };

  return (
    <div>
      <h1>Add User, Allocate Table, and Place Order</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Phone Number"
          value={phNumber}
          onChange={(e) => setPhNumber(e.target.value)}
          required
          className="input border-2 border-black"
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input border-2 border-black"
        />
        <select
          value={tableNum}
          onChange={(e) => setTableNum(e.target.value)}
          required
          className="input border-2 border-black"
        >
          <option value="" disabled>Select a table number</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              Table {num}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Number of Seats"
          value={allocateSeats}
          onChange={(e) => setAllocateSeats(e.target.value)}
          required
          className="input border-2 border-black"
        />
        <select
          value={allocateStatus}
          onChange={(e) => setAllocateStatus(e.target.value)}
          required
          className="input border-2 border-black"
        >
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Reserved">Reserved</option>
        </select>

        <h2>Menu Items</h2>
        {menuItems.map((item) => (
          <div key={item.item_id} className="flex justify-between items-center border-b py-2">
            <span>
              {item.item_name} - ${item.price.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={() => addItemToOrder(item)}
              className="ml-2 p-1 bg-green-500 text-white rounded"
            >
              +
            </button>
          </div>
        ))}

        <h3>Order Summary</h3>
        <ul>
          {orderItems.map((orderItem, index) => (
            <li key={index}>
              {orderItem.item_name} (Qty: {orderItem.quantity}) - $
              {(orderItem.price * orderItem.quantity).toFixed(2)}
            </li>
          ))}
        </ul>

        <div>Total Items: {totalItemsCount}</div>
        <div>Total Price: ${totalPrice.toFixed(2)}</div>

        <button type="submit" className="btn btn-submit text-white rounded-lg p-2 bg-black">
          Add User, Allocate Table, and Place Order
        </button>
      </form>
    </div>
  );
}
