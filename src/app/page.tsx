'use client';
import { Button } from "../components/ui/button"; // Assuming you have a Button component
import { useState, useEffect } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("menu");
  interface MenuItem {
    product_id: number;
    product_name: string;
    description: string;
    price: number;
  }

  interface Table {
    table_num: number;
    status: string;
    seats: number;
  }

  interface BillItem {
    id: number;
    product_name: string;
    price: number;
  }

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);

  // Fetch menu data
  useEffect(() => {
    if (activeTab === "menu") {
      fetch("/api/menu")
        .then((res) => res.json())
        .then((data) => setMenuItems(data))
        .catch((err) => console.error("Error fetching menu:", err));
    } else if (activeTab === "tables") {
      fetch("/api/tables")
        .then((res) => res.json())
        .then((data) => setTables(data))
        .catch((err) => console.error("Error fetching tables:", err));
    } else if (activeTab === "bill") {
      fetch("/api/bill")
        .then((res) => res.json())
        .then((data) => setBillItems(data))
        .catch((err) => console.error("Error fetching bill:", err));
    }
  }, [activeTab]); // Re-fetch when the active tab changes

  return (
    <div className="flex h-screen">
      {/* Navigation Section */}
      <nav className="w-1/5 bg-gray-800 text-white flex flex-col space-y-4 p-4">
        <Button variant={activeTab === "menu" ? "default" : "ghost"} onClick={() => setActiveTab("menu")}>
          Menu
        </Button>
        <Button variant={activeTab === "tables" ? "default" : "ghost"} onClick={() => setActiveTab("tables")}>
          Tables
        </Button>
        <Button variant={activeTab === "bill" ? "default" : "ghost"} onClick={() => setActiveTab("bill")}>
          Bill
        </Button>
      </nav>

      {/* Content Section */}
      <div className="w-4/5 p-6">
        {activeTab === "menu" && (
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
        )}

        {activeTab === "tables" && (
          <div>
            <h1>Tables</h1>
            <ul>
              {tables.map((table) => (
                <div key={table.table_num}>
                  <h2>Table {table.table_num}</h2>
                  <p>Status: {table.status}</p>
                  <p>Seats: {table.seats}</p>
                </div>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "bill" && (
          <div>
            <h1>Bill</h1>
            <ul>
              {billItems.map((item) => (
                <div key={item.id}>
                  <h2>{item.product_name}</h2>
                  <p>Price: ${item.price}</p>
                </div>
              ))}
            </ul>
            <h3>
              Total: $
              {billItems.reduce((total, item) => total + item.price, 0)}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
