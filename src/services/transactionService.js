import api from "../configs/api";

// ===== EXISTING =====
export const getTransactions = async ({ pageNumber, pageSize }) => {
  return api.get("/Transaction", {
    params: { pageNumber, pageSize },
  });
};

export const getTransactionById = async (id) => {
  return api.get(`/Transaction/${id}`);
};

export const getMyWalletTransactionHistory = async ({ pageNumber, pageSize }) => {
  return api.get("/Wallets/my-wallet/history", {
    params: { pageNumber, pageSize },
  });
};