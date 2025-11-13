import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../configs/api";

const CONTRACT_TYPES = [
  { value: "PROVIDER_CONTRACT", label: "Provider Contract" },
  { value: "DRIVER_CONTRACT", label: "Driver Contract" },
];

export default function ContractTemplatePage() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Form state
  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [type, setType] = useState("PROVIDER_CONTRACT");

  // Helpers
  const resetForm = () => {
    setMode("create");
    setEditingId(null);
    setName("");
    setVersion("");
    setType("PROVIDER_CONTRACT");
  };

  const showError = (text) => {
    setError(text);
    setMessage(null);
  };

  const showMessage = (text) => {
    setMessage(text);
    setError(null);
  };

  const formatDate = (value) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  // Fetch data
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("ContractTemplate/getAll");
      const payload = res?.data;

      if (payload?.isSuccess && Array.isArray(payload.result)) {
        setTemplates(payload.result);
      } else {
        showError(payload?.message || "Cannot load contract templates");
      }
    } catch (err) {
      showError(err?.response?.data?.message || err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // CRUD Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!name.trim()) return showError("Contract template name is required.");
    if (!version.trim()) return showError("Version is required.");

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      if (mode === "edit") formData.append("ContractTemplateId", editingId);

      formData.append("ContractTemplateName", name);
      formData.append("Version", version);
      formData.append("Type", type);

      const res =
        mode === "create"
          ? await api.post("ContractTemplate/create", formData)
          : await api.put("ContractTemplate/update", formData);

      const payload = res?.data;

      if (payload?.isSuccess) {
        showMessage(
          payload?.message ||
            (mode === "create" ? "Created successfully" : "Updated successfully")
        );
        resetForm();
        fetchTemplates();
      } else {
        showError(payload?.message || "Save failed");
      }
    } catch (err) {
      showError(err?.response?.data?.message || err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (tpl) => {
    setMode("edit");
    setEditingId(tpl.contractTemplateId);
    setName(tpl.contractTemplateName);
    setVersion(tpl.version);
    setType(tpl.type);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (tpl) => {
    if (!window.confirm(`Delete template "${tpl.contractTemplateName}"?`)) return;

    try {
      setSaving(true);
      const res = await api.delete(`ContractTemplate/delete/${tpl.contractTemplateId}`);
      const payload = res?.data;

      if (payload?.isSuccess) {
        showMessage(payload?.message || "Deleted successfully");
        if (editingId === tpl.contractTemplateId) resetForm();
        fetchTemplates();
      } else {
        showError(payload?.message || "Delete failed");
      }
    } catch (err) {
      showError(err?.response?.data?.message || err?.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  // UI
  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* BREADCRUMB + ACTIONS */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-gray-500">Staff Dashboard / Contract Templates</div>
          <h1 className="text-3xl font-bold text-gray-900">Contract Templates</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/staff")}
            className="px-4 py-2 rounded-md border text-gray-700 bg-white hover:bg-gray-100"
          >
            ← Back to Dashboard
          </button>

          <button
            onClick={() => navigate("/staff/contract-terms")}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 shadow"
          >
            Manage Terms →
          </button>
        </div>
      </div>

      {/* ALERT */}
      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* FORM */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === "create" ? "Create Contract Template" : "Edit Contract Template"}
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Template Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 rounded-md border px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Version</label>
            <input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full mt-1 rounded-md border px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full mt-1 rounded-md border px-3 py-2 text-sm bg-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              {CONTRACT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex justify-end mt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow disabled:opacity-60"
            >
              {saving
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Template"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Existing Templates</h2>
          {loading && <span className="text-gray-500 text-sm">Loading...</span>}
        </div>

        {templates.length === 0 ? (
          <p className="text-sm text-gray-500">No templates found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left text-gray-600">Name</th>
                  <th className="px-4 py-2 text-left text-gray-600">Version</th>
                  <th className="px-4 py-2 text-left text-gray-600">Type</th>
                  <th className="px-4 py-2 text-left text-gray-600">Created At</th>
                  <th className="px-4 py-2 text-right text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((tpl) => (
                  <tr key={tpl.contractTemplateId} className="border-b">
                    <td className="px-4 py-2">{tpl.contractTemplateName}</td>
                    <td className="px-4 py-2">{tpl.version}</td>
                    <td className="px-4 py-2">
                      {tpl.type === "PROVIDER_CONTRACT"
                        ? "Provider Contract"
                        : "Driver Contract"}
                    </td>
                    <td className="px-4 py-2">{formatDate(tpl.createdAt)}</td>
                    <td className="px-4 py-2 text-right space-x-3">
                      <button
                        onClick={() => handleEdit(tpl)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tpl)}
                        className="text-red-600 hover:text-red-800 font-medium"
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
