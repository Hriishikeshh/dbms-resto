'use client';
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import User from './pages/AddUserForm';
import Bill from './pages/bill';

export default function Home() {
  const [activeTab, setActiveTab] = useState("menu");
  const [tables, setTables] = useState<Table[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);

  useEffect(() => {
    if (activeTab === "tables") {
      fetch("/api/addcustomer")
        .then((res) => res.json())
        .then((data) => setTables(data))
        .catch((err) => console.error("Error fetching tables:", err));
    } else if (activeTab === "bill") {
      fetch("/api/bill")
        .then((res) => res.json())
        .then((data) => setBillItems(data))
        .catch((err) => console.error("Error fetching bill:", err));
    }
  }, [activeTab]);

  return (
    <div className="flex h-screen">
      <nav className="w-1/5 bg-gray-800 text-white flex flex-col space-y-4 p-4">
        <Button variant={activeTab === "tables" ? "default" : "ghost"} onClick={() => setActiveTab("tables")}>
          Tables
        </Button>
        <Button variant={activeTab === "bill" ? "default" : "ghost"} onClick={() => setActiveTab("bill")}>
          Bill
        </Button>
      </nav>

      <div className="w-4/5 p-6">
        {activeTab === "tables" && <User />}
        {activeTab === "bill" && <Bill billItems={billItems} />}
      </div>
    </div>
  );
}
