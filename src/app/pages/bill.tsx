import React, { useState, useEffect } from "react";

export default function SelectPhoneNumberAndTableForm() {
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [tableNumbers, setTableNumbers] = useState<string[]>([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const [selectedTableNumber, setSelectedTableNumber] = useState("");

  interface OrderItem {
    item_id: number;
    quantity: number;
    price: number;
  }

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  interface Order {
    order_id: number;
    ph_number: string;
    table_num: number;
    total: number;
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch phone numbers and table numbers from the server
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/order");
        if (!response.ok) {
          throw new Error("Failed to fetch phone numbers and table numbers");
        }
        const data = await response.json();
        setPhoneNumbers(data.phoneNumbers || []);
        setTableNumbers(data.tableNumbers || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching phone numbers and table numbers.");
      }
    };

    fetchOrders();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = {
      ph_number: selectedPhoneNumber,
      table_num: selectedTableNumber,
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.error}`);
      }

      const data = await response.json();
      setOrderItems(data.orderItems || []);
      setOrders(data.orders || []);
      setError(null);
    } catch (error) {
      console.error("Error sending data:", error);
      setError("error fetching order details");
    }
  };

  return (
    <div>
      <h1>Select Phone Number and Table Number</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phNumber">Select Phone Number:</label>
          <select
            id="phNumber"
            value={selectedPhoneNumber}
            onChange={(e) => setSelectedPhoneNumber(e.target.value)}
            required
            className="input border-2 border-black"
          >
            <option value="" disabled>Select a phone number</option>
            {phoneNumbers.map((ph, index) => (
              <option key={index} value={ph}>
                {ph}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tableNumber">Select Table Number:</label>
          <select
            id="tableNumber"
            value={selectedTableNumber}
            onChange={(e) => setSelectedTableNumber(e.target.value)}
            required
            className="input border-2 border-black"
          >
            <option value="" disabled>Select a table number</option>
            {tableNumbers.map((table, index) => (
              <option key={index} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-submit text-white rounded-lg p-2 bg-black">
          Submit
        </button>
      </form>

      {/* Display Order Items */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {!error && orderItems.length > 0 && (
        <div className="mt-4">
          <h2>Order Items</h2>
          <ul className="list-disc ml-4">
            {orderItems.map((item, index) => (
              <li key={index}>
                Item ID: {item.item_id}, Quantity: {item.quantity}, Price: ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Display Total Order Information */}
      {!error && orders.length > 0 && (
        <div className="mt-4 text-black">
          <h2>Total Order Information</h2>
          {orders.map((order) => (
            <div key={order.order_id}>
              <p>Order ID: {order.order_id}</p>
              <p>Phone Number: {order.ph_number}</p>
              <p>Table Number: {order.table_num}</p>
              <p>Total Amount: ${order.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
