// src/pages/admin/PlatformWalletPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyWalletTransactionHistory } 
  from "../../services/transactionService";

const PAGE_SIZE = 10;

export default function PlatformWalletPage() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);

      const res = await getMyWalletTransactionHistory({
        pageNumber: page,
        pageSize: PAGE_SIZE,
      });

      if (res.data?.isSuccess) {
        const result = res.data.result;

        setWallet(result.walletInfo);
        setTransactions(result.transactions.items || []);
        setPagination({
          currentPage: result.transactions.currentPage,
          totalPages: result.transactions.totalPages,
          hasPreviousPage: result.transactions.hasPreviousPage,
          hasNextPage: result.transactions.hasNextPage,
        });
        setPageNumber(page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageNumber);
  }, [pageNumber]);

  const amountClass = (amount) =>
    amount >= 0 ? "text-green-600" : "text-red-600";

  const formatDate = (v) => {
    if (!v) return "-";
    const d = new Date(v);
    return isNaN(d) ? "-" : d.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-gray-500">Admin / Platform Wallet</div>
          <h1 className="text-3xl font-bold text-gray-900">
            Wallet Ledger
          </h1>
        </div>

        <button
          onClick={() => navigate("/admin")}
          className="border rounded px-4 py-2 text-sm bg-white hover:bg-gray-100"
        >
          ← Back
        </button>
      </div>

      {/* WALLET INFO */}
      {wallet && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Current Balance</h2>
          <div className="text-3xl font-bold text-indigo-600">
            {wallet.balance?.toLocaleString()} VND
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Wallet ID: {wallet.walletId}
          </div>
        </div>
      )}

      {/* TRANSACTIONS */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Transaction Movements
        </h2>

        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="text-sm text-gray-500">No transactions</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-right">Balance After</th>
                <th className="px-3 py-2 text-left">Ref</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.transactionId} className="border-t">
                  <td className="px-3 py-2">
                    {formatDate(t.createdAt)}
                  </td>
                  <td className="px-3 py-2 font-medium">
                    {t.type}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-semibold ${amountClass(
                      t.amount
                    )}`}
                  >
                    {t.amount >= 0 ? "+" : ""}
                    {t.amount.toLocaleString()} VND
                  </td>
                  <td className="px-3 py-2 text-right">
                    {t.balanceAfter?.toLocaleString()} VND
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    {t.tripId || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}
        <div className="flex justify-end items-center gap-3 mt-4">
          <button
            disabled={!pagination.hasPreviousPage}
            onClick={() => setPageNumber((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setPageNumber((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
