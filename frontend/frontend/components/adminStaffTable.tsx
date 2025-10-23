"use client";

import React, { useEffect, useState } from "react";

interface Staff {
  _id: string;
  name: string;
  emailId: string;
  role: string;
}

interface AdminStaffTableProps {
  user: {
    id: string;
    name: string;
    emailId: string;
    role: string;
  };
}

const AdminStaffTable: React.FC<AdminStaffTableProps> = ({ user }) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchStaff();
    }
  }, [user]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:7500/api/users");
      if (!res.ok) throw new Error("Failed to load staff");
      const data: Staff[] = await res.json();
      const staffList = data.filter((staffUser) => staffUser.role !== "ADMIN");
      setStaff(staffList);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this user from DB?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:7500/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove user");
      setStaff((prevStaff) => prevStaff.filter((staffUser) => staffUser._id !== id));
      alert("User removed successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to remove user");
    }
  };

  if (user?.role !== "ADMIN") return null;

   return (
    <div className="p-6 bg-card border border-border rounded-lg mt-6 dark:bg-background-dark dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-foreground dark:text-white">Staff Management</h2>

      {loading && <p className="text-muted-foreground dark:text-gray-300">Loading staff...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && staff.length === 0 && <p className="text-muted-foreground dark:text-gray-300">No staff found.</p>}

      {!loading && staff.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md dark:divide-gray-700 dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-foreground uppercase tracking-wider dark:text-gray-200 border-b dark:border-gray-600">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-foreground uppercase tracking-wider dark:text-gray-200 border-b dark:border-gray-600">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-foreground uppercase tracking-wider dark:text-gray-200 border-b dark:border-gray-600">
                  Role
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-foreground uppercase tracking-wider dark:text-gray-200 border-b dark:border-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {staff.map((staffUser) => (
                <tr
                  key={staffUser._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-2 text-sm text-foreground dark:text-gray-100">{staffUser.name}</td>
                  <td className="px-4 py-2 text-sm text-foreground dark:text-gray-100">{staffUser.emailId}</td>
                  <td className="px-4 py-2 text-sm text-foreground dark:text-gray-100">{staffUser.role}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(staffUser._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminStaffTable;
