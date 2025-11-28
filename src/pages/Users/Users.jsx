import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { apiGet } from "../../lib/api.js";
import { GET_USERS } from "../../constants/api/user.js";
import { useSearchParams } from "react-router-dom";
import LoadingPage from "../Loading/loading.jsx";

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { name: "Name", className: "text-left" },
    { name: "Role", className: "text-left" },
    { name: "Email", className: "text-left" },
    { name: "Kontak", className: "text-left" },
    { name: "Aksi" },
  ];

  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  const limit = parseInt(searchParams.get("limit") || "5");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet(GET_USERS(currentPage, limit));
      setData(result.data.result);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [stokBarang, setStokBarang] = useState([
    {
      id: 1,
      nama: "Kemeja Batik",
      kategori: "Pakaian",
      stok: 45,
      harga: 150000,
      satuan: "pcs",
      minimal: 10,
    },
    {
      id: 2,
      nama: "Keripik Singkong",
      kategori: "Makanan",
      stok: 120,
      harga: 15000,
      satuan: "pack",
      minimal: 20,
    },
    {
      id: 3,
      nama: "Tas Anyaman",
      kategori: "Kerajinan",
      stok: 8,
      harga: 85000,
      satuan: "pcs",
      minimal: 20,
    },
    {
      id: 4,
      nama: "Kopi Arabika",
      kategori: "Minuman",
      stok: 3,
      harga: 45000,
      satuan: "pack",
      minimal: 15,
    },
    {
      id: 5,
      nama: "Sarung Tenun",
      kategori: "Pakaian",
      stok: 0,
      harga: 200000,
      satuan: "pcs",
      minimal: 5,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    stok: "",
    harga: "",
    satuan: "",
    minimal: "",
  });

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > data.total_page || newPage === data.page) return;
    setCurrentPage(newPage)

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());
      return newParams;
    });
  };

  const handleSubmit = () => {
    if (
      !formData.nama ||
      !formData.kategori ||
      formData.stok === "" ||
      formData.stok === null ||
      !formData.harga ||
      !formData.satuan ||
      !formData.minimal
    ) {
      alert("Mohon lengkapi semua field");
      return;
    }

    if (editingId) {
      const updatedStok = stokBarang.map((item) => {
        if (item.id === editingId) {
          return { ...formData, id: editingId };
        }
        return item;
      });
      setStokBarang(updatedStok);
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
      };
      setStokBarang([...stokBarang, newItem]);
    }

    setShowModal(false);
    setEditingId(null);
    setFormData({
      nama: "",
      kategori: "",
      stok: "",
      harga: "",
      satuan: "",
      minimal: "",
    });
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus barang ini?");
    if (confirmDelete) {
      const updatedStok = stokBarang.filter((item) => item.id !== id);
      setStokBarang(updatedStok);
    }
  };

  const handleTambahBarang = () => {
    setShowModal(true);
    setEditingId(null);
    setFormData({
      nama: "",
      kategori: "",
      stok: "",
      harga: "",
      satuan: "",
      minimal: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-3 sm:p-6">
      {/* btn tambah barang buat di mobile */}
      <button
        onClick={() => {
          setShowModal(true);
          setEditingId(null);
          setFormData({
            nama: "",
            kategori: "",
            stok: "",
            harga: "",
            satuan: "",
            minimal: "",
          });
        }}
        className="sm:hidden fixed bottom-5 right-5 bg-gray-900 hover:bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all"
      >
        <Plus size={28} />
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
            Manajemen User
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari barang atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-gray-300 rounded-lg pl-12 pr-4 py-2 md:py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-800 transition-all"
            />
          </div>
          <button
            onClick={fetchData}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg"
          >
            <RefreshCw size={20} />
          </button>

          <button
            onClick={handleTambahBarang}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg"
          >
            <Plus size={20} />
            Tambah User
          </button>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-300 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            {loading ? (
              <LoadingPage full />
            ) : error ? (
              <div className="w-full h-full p-20 flex items-center justify-center">
                {error}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
                  <tr>
                    {columns.map((column) => {
                      return (
                        <th
                          className={`px-6 py-4 text-sm fmnt-semibold ${column.className}`}
                        >
                          {column.name}
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {data.data.map((user) => {
                    return (
                      <tr
                        key={user.id_user}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.username}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                            {user.role}
                          </span>
                        </td>

                        {["email", "contact"].map((field) => (
                          <td className="px-6 py-4" key={field}>
                            {user[field] || "Tidak ada"}
                          </td>
                        ))}

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 bg-gray-800 hover:bg-black text-white rounded-lg transition-all"
                            >
                              <Edit2 size={16} />
                            </button>

                            <button
                              onClick={() => handleDelete(user.id_user)}
                              className="p-2 bg-gray-700 hover:bg-gray-900 text-white rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {data.total_page > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-xl border-2 border-gray-300 p-4">
            <div className="text-sm text-gray-600">
              Menampilkan {data.limit * (data.page - 1) + 1} -{" "}
              {data.limit * data.page} dari {data.count /* total user */}{" "}
              user
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(data.page - 1)}
                disabled={data.page === 1}
                className={`p-2 rounded-lg transition-all ${
                  data.page === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-black"
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-1">
                {[...Array(data.total_page)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        data.page === pageNumber
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(data.page + 1)}
                disabled={data.page == data.total_page}
                className={`p-2 rounded-lg transition-all ${
                  data.page === data.total_page
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-black"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl border-2 border-gray-300 p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {editingId ? "Edit Barang" : "Tambah Barang Baru"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Barang
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                    placeholder="Contoh: Kemeja Batik"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={formData.kategori}
                    onChange={(e) =>
                      setFormData({ ...formData, kategori: e.target.value })
                    }
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                    placeholder="Contoh: Pakaian"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stok
                    </label>
                    <input
                      type="number"
                      value={formData.stok}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({
                          ...formData,
                          stok: value === "" ? "" : parseInt(value),
                        });
                      }}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Satuan
                    </label>
                    <input
                      type="text"
                      value={formData.satuan}
                      onChange={(e) =>
                        setFormData({ ...formData, satuan: e.target.value })
                      }
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                      placeholder="pcs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga
                  </label>
                  <input
                    type="number"
                    value={formData.harga}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        harga: parseInt(e.target.value) || "",
                      })
                    }
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                    placeholder="150000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stok Minimal
                  </label>
                  <input
                    type="number"
                    value={formData.minimal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimal: parseInt(e.target.value) || "",
                      })
                    }
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                    placeholder="10"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gray-900 hover:bg-black text-white py-2 rounded-lg font-semibold transition-all"
                  >
                    {editingId ? "Update" : "Simpan"}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition-all"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
