import React, { useState, useEffect } from 'react';
import { useTheme } from "../../contexts/ThemeContext";
import api, { apiDelete, apiPost, apiGet, apiPatch } from '@/lib/api';
import { Plus, Edit2, Trash2, Search, Package, AlertTriangle, XCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function StokUMKM() {
  const { darkMode: isDark } = useTheme();

  // --- state ---
  const [stokBarang, setStokBarang] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    sku: "",
    id_category: "",
    deskripsi: "",
    nama: "",
    stok: "",
    harga: "",
    satuan: "",
    minimal: "",
  });

  // --- fetch categories (separate useEffect) ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiGet("/categories");
        // try common response shapes
        const list = res?.data?.data ?? res?.data ?? [];
        setCategories(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("FETCH CATEGORY ERROR:", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // --- fetch products (separate useEffect) ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiGet("/products");
        // products may be nested res.data.data.data in your API
        const products = res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? [];
        const mapped = (Array.isArray(products) ? products : []).map(item => ({
          id: item.id_product ?? item.id ?? item._id ?? Date.now().toString(),
          nama: item.name ?? item.nama ?? '',
          // categories from product may be string or object or array — normalize to a readable string
          kategori: Array.isArray(item.categories)
            ? item.categories.map(c => c.category || c.name || '').join(', ')
            : (typeof item.categories === 'object' && item.categories !== null)
              ? (item.categories.category || item.categories.name || '')
              : (item.categories ?? item.categories ?? ''),
          id_category: item.id_category ?? (Array.isArray(item.categories) && item.categories[0]?.id_category) ?? '',
          stok: Number(item.total_stock ?? item.stocks?.reduce((s, st) => s + (Number(st.amount) || 0), 0) ?? 0),
          harga: Number(item.stocks?.[0]?.price ?? 0),
          satuan: item.unit ?? item.satuan ?? '',
          minimal: Number(item.minimum ?? item.stock_minimum ?? 0),
          sku: item.SKU ?? item.sku ?? '',
          deskripsi: item.description ?? item.deskripsi ?? '',
          status: item.status ?? ( (Number(item.total_stock ?? 0) > 0) ? 'Tersedia' : 'Habis' ),
        }));

        setStokBarang(mapped);
      } catch (err) {
        console.error("FETCH PRODUCTS ERROR:", err);
        setStokBarang([]);
      }
    };

    fetchProducts();
  }, []);

  // --- helpers ---
  const getStatus = (stok, minimal) => {
    if ((Number(stok) || 0) === 0) {
      return {
        label: 'Habis',
        color: `${isDark ? 'bg-red-900/40 text-red-300 border-red-800' : 'bg-red-500/20 text-red-600 border-red-500/30'}`,
        icon: XCircle
      };
    } else if ((Number(stok) || 0) <= (Number(minimal) || 0)) {
      return {
        label: 'Perlu Restock',
        color: `${isDark ? 'bg-yellow-900/40 text-yellow-300 border-yellow-800' : 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30'}`,
        icon: AlertTriangle
      };
    } else {
      return {
        label: 'Tersedia',
        color: `${isDark ? 'bg-green-900/40 text-green-300 border-green-800' : 'bg-green-500/20 text-green-600 border-green-500/30'}`,
        icon: Package
      };
    }
  };

  const getStatsData = () => {
    const tersedia = stokBarang.filter(item => getStatus(item.stok, item.minimal).label === 'Tersedia').length;
    const perluRestock = stokBarang.filter(item => getStatus(item.stok, item.minimal).label === 'Perlu Restock').length;
    const habis = stokBarang.filter(item => getStatus(item.stok, item.minimal).label === 'Habis').length;
    return { tersedia, perluRestock, habis };
  };

  const stats = getStatsData();
  const totalNilai = stokBarang.reduce((total, item) => total + ((Number(item.stok) || 0) * (Number(item.harga) || 0)), 0);

  const filteredStok = stokBarang.filter(item => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const namaMatch = (item.nama || '').toString().toLowerCase().includes(term);
    const kategoriMatch = (item.kategori || '').toString().toLowerCase().includes(term);
    return namaMatch || kategoriMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStok.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredStok.length / itemsPerPage));

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // --- submit (create / update) ---
  const handleSubmit = async () => {
    // validate required fields (use id_category, not free-text kategori)
    if (
      !formData.nama ||
      !formData.id_category ||
      formData.stok === '' ||
      formData.harga === '' ||
      formData.satuan === '' ||
      formData.minimal === ''
    ) {
      alert('Mohon lengkapi semua field');
      return;
    }

    const normalized = {
      SKU: formData.sku || `SKU-${Date.now()}`, // auto gen if empty
      id_category: formData.id_category,
      description: formData.deskripsi || "Tidak ada deskripsi",
      name: formData.nama,
      unit: formData.satuan,
      minimum: Number(formData.minimal),
      isActive: true
    };

    try {
      if (editingId) {
        // update
        const response = await apiPatch(`/products/${editingId}`, normalized);
        const respData = response?.data ?? {};
        // update local state - keep UI fields consistent
        setStokBarang(prev => prev.map(it => {
          if (it.id !== editingId) return it;
          const catName = categories.find(c => (c.id_category ?? c.id) === normalized.id_category)?.category ?? categories.find(c => (c.id_category ?? c.id) === normalized.id_category)?.name ?? it.kategori;
          return {
            ...it,
            nama: normalized.name,
            deskripsi: normalized.description,
            satuan: normalized.unit,
            minimal: normalized.minimum,
            id_category: normalized.id_category,
            kategori: catName,
            sku: normalized.SKU,
            // stok & harga come from formData
            stok: Number(formData.stok) || 0,
            harga: Number(formData.harga) || 0,
          };
        }));
      } else {
        // create
        const response = await apiPost("/products", normalized);
        const resp = response?.data ?? {};
        // try to get id from various possible response shapes
        const newId = resp?.id_product ?? resp?.data?.id_product ?? resp?.data?.id ?? resp?.id ?? Date.now().toString();

        const catName = categories.find(c => (c.id_category ?? c.id) === normalized.id_category)?.category ?? categories.find(c => (c.id_category ?? c.id) === normalized.id_category)?.name ?? "";

        const newItem = {
          id: newId,
          nama: normalized.name,
          kategori: catName,
          id_category: normalized.id_category,
          stok: Number(formData.stok) || 0,
          harga: Number(formData.harga) || 0,
          satuan: normalized.unit,
          minimal: normalized.minimum,
          sku: normalized.SKU,
          deskripsi: normalized.description,
          status: (Number(formData.stok) || 0) > 0 ? 'Tersedia' : 'Habis'
        };

        setStokBarang(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error("Gagal simpan:", error);
      alert("Gagal terhubung ke API");
    }

    // reset
    setShowModal(false);
    setEditingId(null);
    setFormData({
      sku: "",
      id_category: "",
      deskripsi: "",
      nama: "",
      stok: "",
      harga: "",
      satuan: "",
      minimal: "",
    });
  };

  // --- edit handler ---
  const handleEdit = (item) => {
    setFormData({
      sku: item.sku ?? "",
      id_category: item.id_category ?? "",
      deskripsi: item.deskripsi ?? "",
      nama: item.nama ?? "",
      stok: item.stok ?? "",
      harga: item.harga ?? "",
      satuan: item.satuan ?? "",
      minimal: item.minimal ?? "",
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  // --- delete handler ---
  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus barang ini?')) return;

    try {
      await apiDelete(`/products/${id}`);
      setStokBarang(prev => prev.filter(item => item.id !== id));
      const newFiltered = filteredStok.length - 1;
      const newPages = Math.ceil(Math.max(0, newFiltered) / itemsPerPage) || 1;
      if (currentPage > newPages) setCurrentPage(newPages);
    } catch (error) {
      console.error("Gagal hapus produk:", error);
      alert("Gagal menghapus produk");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ nama: '', kategori: '', stok: '', harga: '', satuan: '', minimal: '' });
  };

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

  const handleTambahBarang = () => {
    setShowModal(true);
    setEditingId(null);
    setFormData({
      sku: "",
      id_category: "",
      deskripsi: "",
      nama: "",
      stok: "",
      harga: "",
      satuan: "",
      minimal: "",
    });
  };

  // --- render ---
  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors duration-200
      ${'bg-[--background] text-[--foreground]'}
    `}>

      {/* Mobile floating add button */}
      <button
        onClick={handleTambahBarang}
        className={`sm:hidden fixed bottom-5 right-5 bg-gray-900 hover:bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-50
                ${isDark
                ? 'bg-gray-800 text-white hover:bg-white hover:text-black'
                : 'bg-black text-white hover:bg-gray-900'
                }`}
      >
        <Plus size={28} />
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Manajemen Stok UMKM</h1>
          <p className={`${'bg-[--background] text-[--foreground]'}`}>Kelola inventaris produk UMKM Anda dengan mudah</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className={`rounded-xl p-5 border-2 transition-all
            ${isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}
          `}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1">Tersedia</p>
                <p className="text-3xl font-bold">{stats.tersedia}</p>
              </div>
              <Package size={36} className="text-green-600" />
            </div>
          </div>

          <div className={`rounded-xl p-5 border-2 transition-all
            ${isDark ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'}
          `}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1">Perlu Restock</p>
                <p className="text-3xl font-bold">{stats.perluRestock}</p>
              </div>
              <AlertTriangle size={36} className="text-yellow-600" />
            </div>
          </div>

          <div className={`rounded-xl p-5 border-2 transition-all
            ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}
          `}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1">Habis</p>
                <p className="text-3xl font-bold">{stats.habis}</p>
              </div>
              <XCircle size={36} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Total value card */}
        <div className={`rounded-xl p-6 mb-6 shadow-lg transition-all
          ${isDark ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-gray-800 to-black text-white'}
        `}>
          <p className="text-sm mb-1">Total Nilai Inventaris</p>
          <p className="text-2xl sm:text-3xl font-bold">{formatRupiah(totalNilai)}</p>
        </div>

        {/* Search + add */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${'bg-[--background] text-[--foreground]'}`} size={20} />
            <input
              type="text"
              placeholder="Cari barang atau kategori..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className={`w-full rounded-lg pl-12 pr-4 py-3 transition-all
                ${isDark ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400' : 'bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-400'}
              `}
            />
          </div>

          <button
            onClick={handleTambahBarang}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all
              ${isDark
                ? 'bg-gray-800 text-white hover:bg-white hover:text-black'
                : 'bg-black text-white hover:bg-gray-900'
              }`}
          >
            <Plus size={20} />
            Tambah Barang
          </button>
        </div>

{/* mobile list (card) */}
        <div className="sm:hidden space-y-3 mb-6">
          {currentItems.map(item => {
            const status = getStatus(item.stok, item.minimal);
            const StatusIcon = status.icon;
            return (
              <div key={item.id} className={`rounded-xl p-4 border transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{item.nama}</h3>
                      <div className="text-sm text-gray-500">{item.satuan}</div>
                    </div>

                    <div className="mt-2 text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700/30' : 'bg-gray-100'}`}>{item.kategori}</span>
                      <span className="font-semibold">Stok: {item.stok}</span>
                      <span className="ml-1">{formatRupiah(item.harga)}</span>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-2">
                      <span className={`px-3 py-1 ${status.color} border rounded-full text-sm font-medium inline-flex items-center gap-2`}>
                        <StatusIcon size={14} /> {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className={`p-2 rounded-lg transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-800 hover:bg-black text-white'}`} aria-label="Edit">
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className={`p-2 rounded-lg transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-700 hover:bg-gray-800 text-white'}`} aria-label="Hapus">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {currentItems.length === 0 && (
            <div className={`px-4 py-6 text-center rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
              Tidak ada barang yang ditemukan.
            </div>
          )}
        </div>
{/* Table visible */}
        <div className={`rounded-xl overflow-hidden border-2 transition-all hidden sm:block
          ${'bg-[--background] text-[--foreground]'}
        `}>
        
        <div
          className={`rounded-xl overflow-hidden shadow-lg border-2 transition-all
            ${isDark 
              ? 'bg-gray-900 border-gray-700 text-gray-100' 
              : 'bg-white border-gray-300 text-gray-800'
            }
          `}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
          
              {/* HEADER */}
              <thead
                className={
                  isDark
                    ? 'bg-gray-800 text-gray-100'
                    : 'bg-gradient-to-r from-gray-800 to-black text-white'
                }
              >
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nama Barang</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Kategori</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Stok</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Harga</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              
              {/* BODY */}
              <tbody
                className={`divide-y transition-colors ${
                  isDark ? 'divide-gray-700' : 'divide-gray-200'
                }`}
              >
                {currentItems.map((item) => {
                  const status = getStatus(item.stok, item.minimal);
                  const StatusIcon = status.icon;
                
                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isDark ? 'hover:bg-gray-800/60' : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* NAMA BARANG */}
                      <td className="px-6 py-4">
                        <div className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                          {item.nama}
                        </div>
                    
                        <div className={`${isDark ? 'text-gray-400' : 'text-sm text-gray-500'}`}>
                          {item.satuan}
                        </div>
                      </td>
                    
                      {/* KATEGORI */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isDark ? 'bg-gray-700/60 text-gray-200' : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {item.kategori}
                        </span>
                      </td>
                        
                      {/* STOK */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}
                        >
                          {item.stok}
                        </span>
                      </td>
                        
                      {/* HARGA */}
                      <td className="px-6 py-4 text-right font-medium">
                        {formatRupiah(item.harga)}
                      </td>
                        
                      {/* STATUS */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full border inline-flex items-center gap-1 text-sm font-medium ${status.color}`}
                        >
                          <StatusIcon size={14} /> {status.label}
                        </span>
                      </td>
                        
                      {/* AKSI */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                        
                          {/* EDIT */}
                          <button
                            onClick={() => handleEdit(item)}
                            className={`p-2 rounded-lg transition-all ${
                              isDark
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-800 hover:bg-black text-white'
                            }`}
                          >
                            <Edit2 size={16} />
                          </button>
                          
                          {/* DELETE */}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className={`p-2 rounded-lg transition-all ${
                              isDark
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-700 hover:bg-gray-800 text-white'
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  );
                })}
        
                {/* NO DATA */}
                {currentItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className={`px-6 py-8 text-center ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Tidak ada barang yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
              
          {/* Pagination area */}
          {filteredStok.length > itemsPerPage && (
            <div className={`mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isDark ? 'bg-gray-800 border-t border-gray-700' : 'bg-white'} p-4`}>
              <div className={`${isDark ? 'text-gray-300' : 'text-sm text-gray-600'}`}>
                Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredStok.length)} dari {filteredStok.length} barang
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-black'}`}>
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === pageNumber ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-black'}`}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-md rounded-xl border-2 p-6 shadow-2xl transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}>
              <button onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Barang' : 'Tambah Barang Baru'}</h2>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Nama Barang</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className={`w-full rounded-lg px-4 py-2 transition-all ${isDark ? 'bg-gray-700 border border-gray-600 text-gray-100' : 'bg-white border-2 border-gray-300 text-gray-800'}`}
                    placeholder="Contoh: Kemeja Batik"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Kategori</label>
                  <select
                    value={formData.id_category}
                    onChange={(e) => setFormData({ ...formData, id_category: e.target.value })}
                    className={`w-full rounded-lg px-4 py-2 transition-all ${isDark ? 'bg-gray-700 border border-gray-600 text-gray-100' : 'bg-white border-2 border-gray-300 text-gray-800'}`}
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(cat => (
                      <option key={cat.id_category ?? cat.id} value={cat.id_category ?? cat.id}>
                        {cat.category ?? cat.categories ?? cat.name ?? ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Stok</label>
                    <input
                      type="number"
                      value={formData.stok}
                      onChange={(e) => setFormData({ ...formData, stok: e.target.value === '' ? '' : Number(e.target.value) })}
                      className={`w-full rounded-lg px-4 py-2 transition-all ${isDark ? 'bg-gray-700 border border-gray-600 text-gray-100' : 'bg-white border-2 border-gray-300 text-gray-800'}`}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Satuan</label>
                    <input
                      type="text"
                      value={formData.satuan}
                      onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                      className={`w-full rounded-lg px-4 py-2 transition-all ${isDark ? 'bg-gray-700 border border-gray-600 text-gray-100' : 'bg-white border-2 border-gray-300 text-gray-800'}`}
                      placeholder="pcs"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Harga</label>
                  <input
                    type="number"
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value === '' ? '' : Number(e.target.value) })}
                    className={`w-full rounded-lg px-4 py-2 transition-all ${isDark ? 'bg-gray-700 border border-gray-600 text-gray-100' : 'bg-white border-2 border-gray-300 text-gray-800'}`}
                    placeholder="150000"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Stok Minimal</label>
                  <input
                    type="number"
                    value={formData.minimal}
                    onChange={(e) => setFormData({ ...formData, minimal: e.target.value === '' ? '' : Number(e.target.value) })}
                    className={`w-full rounded-lg px-4 py-2 transition-all ${isDark ? 'bg-gray-700 border border-gray-600 text-gray-100' : 'bg-white border-2 border-gray-300 text-gray-800'}`}
                    placeholder="10"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={handleSubmit} className="flex-1 bg-gray-900 hover:bg-black text-white py-2 rounded-lg font-semibold transition-all">{editingId ? 'Update' : 'Simpan'}</button>
                  <button onClick={closeModal} className={`flex-1 py-2 rounded-lg font-semibold transition-all ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}>Batal</button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Pagination khusus mobile */}
        {filteredStok.length > itemsPerPage && (
          <div className="md:hidden flex flex-col items-center mt-6 pb-6">
          
            {/* Info jumlah data */}
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3`}>
              Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredStok.length)} dari {filteredStok.length} barang
            </div>
        
            {/* Tombol pagination */}
            <div className="flex items-center gap-3">
              
              {/* Tombol Prev */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full transition-all ${
                  currentPage === 1
                    ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-800 text-white'
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              
              {/* Halaman sekarang */}
              <span className={`${isDark ? 'text-white' : 'text-gray-800'} font-semibold`}>
                {currentPage} / {totalPages}
              </span>
              
              {/* Tombol Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full transition-all ${
                  currentPage === totalPages
                    ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-800 text-white'
                }`}
              >
                <ChevronRight size={18} />
              </button>
              
            </div>
          </div>
        )}
        

      </div>
    </div>
  );
}
