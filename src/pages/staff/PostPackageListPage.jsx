import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../configs/api";

export default function PostPackageListPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/PostPackage/get-all?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );

      if (res.data?.isSuccess) {
        setPosts(res.data.result.data);
        setPagination(res.data.result);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [pageNumber]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-sm text-gray-500">Staff / View All Post Package</div>
          <h1 className="text-3xl font-bold text-gray-900">All Post Packages</h1>
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
        <h2 className="text-xl font-semibold mb-4">Post Package List</h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No post packages found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left">PostPackage ID</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Provider</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((pp) => (
                  <tr key={pp.postPackageId} className="border-b">
                    <td className="px-4 py-2">{pp.postPackageId}</td>
                    <td className="px-4 py-2">{pp.title}</td>
                    <td className="px-4 py-2">{pp.providerId}</td>
                    <td className="px-4 py-2">{pp.status}</td>
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

        {/* Pagination */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            disabled={pageNumber <= 1}
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
