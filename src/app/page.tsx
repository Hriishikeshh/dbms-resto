'use client';
import { Button } from "../components/ui/button";
import { useState } from "react";
import User from './pages/AddUserForm';
import Bill from './pages/bill';

export default function Home() {
  const [activeTab, setActiveTab] = useState("menu");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // You can add authentication logic here, such as a fetch request to an API for authentication
    if (username === "admin" && password === "admin") { // Example condition
      setIsLoggedIn(true);
      setActiveTab("tables"); // Redirect to "tables" after login
    } else {
      alert("Invalid username or password");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <form className="bg-white p-8 rounded-lg shadow-lg space-y-4" onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <Button type="submit" className="w-full bg-black text-white p-2 rounded">Login</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <nav className="h-full bg-black text-white flex flex-col space-y-4 p-4">
        <Button variant={activeTab === "tables" ? "default" : "ghost"} onClick={() => setActiveTab("tables")}>
          Tables
        </Button>
        <Button
          variant={activeTab === "bill" ? "default" : "ghost"}
          onClick={() => setActiveTab("bill")}
          className={`${activeTab === "bill" ? "bg-[#666666] text-white" : "bg-transparent text-gray-400"
            } hover:bg-[#555555] transition-colors duration-300 shadow-md`}
        >
          Bill
        </Button>
      </nav>

      <div className="w-full h-full p-6 text-white overflow-auto">
        {activeTab === "tables" && <User />}
        {activeTab === "bill" && <Bill />}
      </div>
    </div>
  );
}
