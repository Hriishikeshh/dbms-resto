'use client';
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import User from './pages/AddUserForm';
import Bill from './pages/bill';

export default function Home() {
  const [activeTab, setActiveTab] = useState("menu");

  useEffect(() => {
    if (activeTab === "tables") {
      fetch("/api/addcustomer")
        .then((res) => res.json())
        .catch((err) => console.error("Error fetching tables:", err));
    } else if (activeTab === "bill") {
      fetch("/api/bill")
        .then((res) => res.json())
        .catch((err) => console.error("Error fetching bill:", err));
    }
  }, [activeTab]);

  return (

    <div className="flex h-screen" style={{ backgroundImage: 'url("/images/restaurant-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <nav className="w-1/5 bg-[#333333]/90 text-white flex flex-col space-y-4 p-4 shadow-lg">
        <Button
          variant={activeTab === "tables" ? "default" : "ghost"}
          onClick={() => setActiveTab("tables")}
          className={`${
            activeTab === "tables" ? "bg-[#666666] text-white" : "bg-transparent text-gray-400"
          } hover:bg-[#555555] transition-colors duration-300 shadow-md`}
        >

    <div className="flex h-screen">
      <nav className="h-full bg-black text-white flex flex-col space-y-4 p-4">
        <Button variant={activeTab === "tables" ? "default" : "ghost"} onClick={() => setActiveTab("tables")}>

          Tables
        </Button>
        <Button
          variant={activeTab === "bill" ? "default" : "ghost"}
          onClick={() => setActiveTab("bill")}
          className={`${
            activeTab === "bill" ? "bg-[#666666] text-white" : "bg-transparent text-gray-400"
          } hover:bg-[#555555] transition-colors duration-300 shadow-md`}
        >
          Bill
        </Button>
      </nav>

      <div className="w-4/5 p-6 bg-[#1a1a1a]/90 text-white overflow-auto" style={{ backgroundImage: 'url("/images/menu-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {activeTab === "tables" && <User />}
        {activeTab === "bill" && <Bill />}
      </div>
    </div>
  );
}
