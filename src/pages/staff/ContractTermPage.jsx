// src/pages/staff/ContractTermPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../configs/api";

export default function ContractTermPage() {
  const navigate = useNavigate();

  const [terms, setTerms] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Form
  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [content, setContent] = useState("");
  const [order, setOrder] = useState("");
  const [templateId, setTemplateId] = useState("");

  // Helpers
  const showMessage = (msg) => {
    setMessage(msg);
    setError(null);
  };

  const showError = (msg) => {
    setError(msg);
    setMessage(null);
  };

  const resetForm = () => {
    setMode("create");
    setEditingId(null);
    setContent("");
    setOrder("");
  };

  // Load Templates
  const fetchTemplates = async () => {
    try {
      const res = await api.get("ContractTemplate/getAll");
      const data = res?.data;

      if (data?.isSuccess && Array.isArray(data.result)) {
        setTemplates(data.result);

        if (!templateId && data.result.length > 0) {
          setTemplateId(data.result[0].contractTemplateId);
        }
      }
    } catch {
      showError("Failed to load templates");
    }
  };

  // Load terms for selected template
  const fetchTerms = async () => {
    if (!templateId) return;
    setLoading(true);

    try {
      const res = await api.get(`ContractTerm/getAll/${templateId}`);
      const data = res?.data;

      if (data?.isSuccess) {
        setTerms(data.result);
      }
    } catch {
      showError("Failed to load terms");
    } finally {
      setLoading(false);
    }
  };

  // Submit (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!content.trim()) return showError("Content is required.");
    if (!order || Number(order) <= 0) return showError("Order must be > 0.");

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("Content", content);
      formData.append("Order", order);
      formData.append("ContractTemplateId", templateId);

      let res;

      if (mode === "create") {
        res = await api.post("ContractTerm/create", formData);
      } else {
        formData.append("ContractTermId", editingId);
        res = await api.put("ContractTerm/update", formData);
      }

      const data = res?.data;

      if (data?.isSuccess) {
        showMessage(data.message || "Success");
        resetForm();
        fetchTerms();
      } else {
        showError(data?.message || "Save failed");
      }
    } catch {
      showError("Save error");
    } finally {
      setSaving(false);
    }
  };

  // Edit
  const handleEdit = (term) => {
    setMode("edit");
    setEditingId(term.contractTermId);
    setContent(term.content);
    setOrder(term.order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete
  const handleDelete = async (term) => {
    if (!window.confirm(`Delete term "${term.content}"?`)) return;

    try {
      const res = await api.delete(
        `ContractTerm/delete/${term.contractTermId}`
      );
      const data = res?.data;

      if (data?.isSuccess) {
        showMessage("Deleted successfully");

        if (editingId === term.contractTermId) resetForm();

        fetchTerms();
      } else {
        showError(data?.message || "Delete failed");
      }
    } catch {
      showError("Delete error");
    }
  };

  // Init
  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    fetchTerms();
  }, [templateId]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-gray-500">
            Staff Dashboard / Contract Templates / Contract Terms
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Contract Terms</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/staff/contract-templates")}
            className="px-4 py-2 rounded-md border bg-white hover:bg-gray-100"
          >
            ← Back to Templates
          </button>

          <button
            onClick={() => navigate("/staff")}
            className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-black"
          >
            Staff Dashboard →
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="mb-4 border border-red-300 bg-red-50 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 border border-green-300 bg-green-50 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}

      {/* TEMPLATE SELECTOR */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Select Contract Template
        </label>

        <select
          className="w-full md:w-1/3 border rounded-md px-3 py-2"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
        >
          {templates.map((tpl) => (
            <option key={tpl.contractTemplateId} value={tpl.contractTemplateId}>
              {tpl.contractTemplateName} (v{tpl.version})
            </option>
          ))}
        </select>
      </div>

      {/* FORM */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Create Term" : "Edit Term"}
          </h2>

          {mode === "edit" && (
            <button
              onClick={resetForm}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Cancel edit
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* CONTENT */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Content
            </label>
            <textarea
              className="w-full border rounded-md px-3 py-2 h-24"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          {/* ORDER */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Order
            </label>
            <input
              type="number"
              className="w-full border rounded-md px-3 py-2"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </div>

          {/* SUBMIT BTN */}
          <div className="md:col-span-3 flex justify-end mt-4">
            <button
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Term"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Terms List</h2>
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>

        {terms.length === 0 ? (
          <p className="text-sm text-gray-500">No terms found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left">Order</th>
                  <th className="px-4 py-2 text-left">Content</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {terms.map((t) => (
                  <tr key={t.contractTermId} className="border-b">
                    <td className="px-4 py-2">{t.order}</td>
                    <td className="px-4 py-2">{t.content}</td>
                    <td className="px-4 py-2 text-right space-x-3">
                      <button
                        onClick={() => handleEdit(t)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
