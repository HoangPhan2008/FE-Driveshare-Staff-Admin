import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../configs/api";

export default function PackageListPage() {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/Package/get-all-packages?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );

      if (res.data?.isSuccess) {
        setPackages(res.data.result.data);
        setPagination(res.data.result);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, [pageNumber]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-sm text-gray-500">Staff / View All Package</div>
          <h1 className="text-3xl font-bold text-gray-900">All Packages</h1>
        </div>

        <button
          onClick={() => navigate("/staff")}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-black"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Package List</h2>

        {loading ? (
          <p>Loading...</p>
        ) : packages.length === 0 ? (
          <p className="text-gray-500">No packages found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left">Package ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Owner</th>
                  <th className="px-4 py-2 text-left">Weight</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((p) => (
                  <tr key={p.packageId} className="border-b">
                    <td className="px-4 py-2">{p.packageId}</td>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.userId}</td>
                    <td className="px-4 py-2">{p.weight}</td>
                    <td className="px-4 py-2 text-right">
                      <button className="text-indigo-600 font-semibold hover:text-indigo-800">
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setPageNumber(pageNumber + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
