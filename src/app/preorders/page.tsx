/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Preorder } from "@/src/types";
import StatusSwitch from "@/src/components/StatusSwitch";
import Pagination from "@/src/components/Pagination";
import Loader from "@/src/components/Loader";

type FilterType = "all" | "active" | "inactive";
type SortField = "createdAt" | "customerName" | "totalPrice";

export default function PreordersPage() {
  const router = useRouter();
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    filter: "all" as FilterType,
    sortBy: "createdAt" as SortField,
    sortOrder: "desc" as "asc" | "desc",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  // Fetch preorders
  const fetchPreorders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        filter: filters.filter,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const response = await fetch(`/api/preorders?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPreorders(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching preorders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreorders();
  }, [filters]);

  // Toggle status
  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await fetch(`/api/preorders-status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchPreorders();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  // Delete preorder
  const deletePreorder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this preorder?")) return;

    try {
      const response = await fetch(`/api/preorders/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPreorders();
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      }
    } catch (error) {
      console.error("Error deleting preorder:", error);
    }
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === preorders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(preorders.map((p) => p.id));
    }
  };

  // Toggle single select
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Preorders</h1>
        <Link href="/preorders/create" className="btn-primary">
          + Create Preorder
        </Link>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter:</label>
          <select
            value={filters.filter}
            onChange={(e) =>
              setFilters({
                ...filters,
                filter: e.target.value as FilterType,
                page: 1,
              })
            }
            className="input-field w-auto"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({
                ...filters,
                sortBy: e.target.value as SortField,
                page: 1,
              })
            }
            className="input-field w-auto"
          >
            <option value="createdAt">Date</option>
            <option value="customerName">Name</option>
            <option value="totalPrice">Total Price</option>
          </select>
          <select
            value={filters.sortOrder}
            onChange={(e) =>
              setFilters({
                ...filters,
                sortOrder: e.target.value as "asc" | "desc",
                page: 1,
              })
            }
            className="input-field w-auto"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === preorders.length &&
                    preorders.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="table-header">Customer</th>
              <th className="table-header">Email</th>
              <th className="table-header">Product</th>
              <th className="table-header">Qty</th>
              <th className="table-header">Total Price</th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8">
                  <Loader />
                </td>
              </tr>
            ) : preorders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No preorders found. Create your first preorder!
                </td>
              </tr>
            ) : (
              preorders.map((preorder) => (
                <tr key={preorder.id} className="hover:bg-gray-50">
                  {/* 1. Checkbox */}
                  <td className="table-cell">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(preorder.id)}
                      onChange={() => toggleSelect(preorder.id)}
                      className="rounded border-gray-300"
                    />
                  </td>

                  {/* 2. Preorder Name */}
                  <td className="table-cell font-medium">{preorder.name}</td>

                  {/* 3. Products Count */}
                  <td className="table-cell text-center">
                    {preorder.products} Products
                  </td>

                  {/* 4. Preorder Trigger Condition */}
                  <td className="table-cell capitalize">
                    {preorder.preorderWhen.replace(/-/g, " ")}
                  </td>

                  {/* 5. Starts At Date */}
                  <td className="table-cell">
                    {new Date(preorder.startsAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* 6. Ends At Date (Handles null) */}
                  <td className="table-cell">
                    {preorder.endsAt ? (
                      new Date(preorder.endsAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    ) : (
                      <span className="text-gray-400 text-sm">No end date</span>
                    )}
                  </td>

                  {/* 7. Status Switch */}
                  <td className="table-cell">
                    <StatusSwitch
                      status={preorder.status}
                      onToggle={() =>
                        toggleStatus(preorder.id, preorder.status)
                      }
                    />
                  </td>

                  {/* 8. Actions (Edit / Delete) */}
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/preorders/${preorder.id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => deletePreorder(preorder.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <Pagination
          currentPage={filters.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      )}
    </div>
  );
}
