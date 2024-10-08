import React, { useState } from "react";

export default function AddUserAndAllocateTableForm() {
  const [phNumber, setPhNumber] = useState("");
  const [name, setName] = useState("");
  const [tableNum, setTableNum] = useState("");
  const [allocateTableNum, setAllocateTableNum] = useState("");
  const [allocateSeats, setAllocateSeats] = useState("");
  const [allocateStatus, setAllocateStatus] = useState("Available");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      ph_number: phNumber,
      name,
      table_num: tableNum,
      allocate_table_num: allocateTableNum,
      allocate_seats: allocateSeats,
      allocate_status: allocateStatus,
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
        alert("User added and table allocated successfully");
        // Optionally, clear the form or refresh data
        setPhNumber("");
        setName("");
        setTableNum("");
        setAllocateTableNum("");
        setAllocateSeats("");
        setAllocateStatus("Available");
      } else {
        const data = await response.json();
        alert(`Failed to add user and allocate table: ${data.error}`);
      }
    } catch (error) {
      console.error("Error adding user or allocating table:", error);
      alert("An error occurred while adding the user and allocating the table");
    }
  };

  return (
    <div>
      <h1>Add User and Allocate Table</h1>
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
        <input
          type="number"
          placeholder="User Table Number"
          value={tableNum}
          onChange={(e) => setTableNum(e.target.value)}
          required
          className="input border-2 border-black"
        />
        
      
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
        
        <button type="submit" className="btn btn-submit text-white rounded-lg p-2 bg-black">
          Add User and Allocate Table
        </button>
      </form>
    </div>
  );
}
