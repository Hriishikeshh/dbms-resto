import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"; // Replace with the actual library or path
import { Button } from "@/components/ui/button";

export default function SelectPhoneNumberAndTableForm() {
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [tableNumbers, setTableNumbers] = useState<string[]>([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const [selectedTableNumber, setSelectedTableNumber] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [showPaidButton, setShowPaidButton] = useState(false);

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
      setShowPaidButton(true); // Show the paid button when the order is fetched
    } catch (error) {
      console.error("Error sending data:", error);
      setError("Error fetching order details.");
    }
  };

  const handlePaidClick = async (order: Order) => {
    try {
      const response = await fetch("/api/paid-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: order.order_id,
          ph_number: order.ph_number,
          total: order.total,
          table_num: order.table_num,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark order as paid.");
      }

      setIsPaid(true);
      setShowPaidButton(false); // Hide the button after marking as paid
    } catch (error) {
      console.error("Error marking as paid:", error);
      setError("Error updating payment status.");
    }
  };

  return (
    <div className="flex items-center justify-center mt-20 gap-6">
      <h1 >Bill</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex text-black">
          <label className="mx-4" htmlFor="phNumber">Select Phone Number:</label>
          <select
            id="phNumber"
            value={selectedPhoneNumber}
            onChange={(e) => setSelectedPhoneNumber(e.target.value)}
            required
            className="input border-2 border-black text-black"
          >
            <option value="" disabled>Select</option>
            {phoneNumbers.map((ph, index) => (
              <option key={index} value={ph}>
                {ph}
              </option>
            ))}
          </select>
        </div>

        <div className="text-black">
          <label className="mx-4" htmlFor="tableNumber">Select Table Number:</label>
          <select
            id="tableNumber"
            value={selectedTableNumber}
            onChange={(e) => setSelectedTableNumber(e.target.value)}
            required
            className="input border-2 border-black text-black"
          >
            <option value="" disabled>Select</option>
            {tableNumbers.map((table, index) => (
              <option key={index} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-submit text-white rounded-lg p-2 bg-black mx-4">
          Submit
        </button>
      </form>


      {/* Display Order Items */}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!error && orderItems.length > 0 && (
        <Card className="bg-white text-black shadow-md w-2/5 max-w-2xl h-auto">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Item ID</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.item_id}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}


      {/* Display Total Order Information */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!error && orders.length > 0 && (
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Total Order Information</h2>
          {orders.map((order) => (
            <Card key={order.order_id} className="bg-white text-black shadow-md w-6/8 max-w-2xl h-auto">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Order ID: {order.order_id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Phone Number: {order.ph_number}</p>
                <p className="text-sm">Table Number: {order.table_num}</p>
                <p className="text-sm">Total Amount: ${order.total.toFixed(2)}</p>
              </CardContent>
              <CardFooter>
                {showPaidButton && !isPaid && (
                  <Button
                    variant="success"
                    className="bg-green-500 text-white hover:bg-green-600"
                    onClick={() => handlePaidClick(order)}
                  >
                    Mark as Paid
                  </Button>
                )}
                {isPaid && <p className="text-green-500">Paid</p>}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
