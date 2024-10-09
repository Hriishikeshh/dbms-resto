import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        resetForm();
      } else {
        const data = await response.json();
        alert(`Failed to add user, allocate table, and place order: ${data.error}`);
      }
    } catch (error) {
      console.error("Error adding user or allocating table or placing order:", error);
      alert("An error occurred while adding the user, allocating the table, and placing the order");
    }
  };

  const resetForm = () => {
    setPhNumber("");
    setName("");
    setTableNum("");
    setAllocateSeats("");
    setAllocateStatus("Available");
    setOrderId("");
    setOrderItems([]);
    setTotalItemsCount(0);
    setTotalPrice(0);
  };

  return (
    <div className="max-w-md mx-auto mt-4 px-2">
      <Card className="shadow-lg rounded-lg bg-white h-auto">
        <CardHeader className="py-2">
          <CardTitle className="text-lg font-bold text-primary">Add User, Allocate Table, and Place Order</CardTitle>
        </CardHeader>
        <CardContent className="py-2 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="phNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
              <Input
                type="text"
                id="phNumber"
                placeholder="Phone Number"
                value={phNumber}
                onChange={(e) => setPhNumber(e.target.value)}
                required
                className="text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="tableNum" className="text-sm font-medium text-gray-700">Table Number</Label>
              <Select value={tableNum} onValueChange={setTableNum}>
                <SelectTrigger className="text-sm border border-gray-300 rounded-md">
                  <SelectValue placeholder="Select Table" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Table Number</SelectLabel>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        Table {num}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="allocateSeats" className="text-sm font-medium text-gray-700">Number of Seats</Label>
              <Input
                type="number"
                id="allocateSeats"
                placeholder="Seats"
                value={allocateSeats}
                onChange={(e) => setAllocateSeats(e.target.value)}
                required
                className="text-sm border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="allocateStatus" className="text-sm font-medium text-gray-700">Status</Label>
              <Select value={allocateStatus} onValueChange={setAllocateStatus}>
                <SelectTrigger className="text-sm border border-gray-300 rounded-md">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <h2 className="text-lg font-bold mt-2">Menu Items</h2>
            <div className="border rounded-md p-2">
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <div key={item.item_id} className="flex justify-between items-center border-b py-1">
                    <span className="text-sm text-gray-800">{item.item_name} - ${item.price.toFixed(2)}</span>
                    <Button
                      type="button"
                      onClick={() => addItemToOrder(item)}
                      variant="default"
                      className="ml-2 text-sm transition duration-200 ease-in-out hover:bg-primary hover:text-white"
                    >
                      +
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-red-500 text-sm">No menu items available</p>
              )}
            </div>

            <h3 className="text-lg font-bold mt-2">Order Summary</h3>
            <ul className="text-sm space-y-1">
              {orderItems.map((orderItem, index) => (
                <li key={index} className="flex justify-between py-1">
                  <span>{orderItem.item_name} (Qty: {orderItem.quantity})</span>
                  <span>${(orderItem.price * orderItem.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="text-sm font-semibold">Total Items: {totalItemsCount}</div>
            <div className="text-sm font-semibold">Total Price: ${totalPrice.toFixed(2)}</div>

            <div className="flex justify-center mt-4">
              <Button type="submit" className="btn-submit w-full bg-black text-white rounded-lg p-2 hover:bg-primary transition duration-200">
                Confirm Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
