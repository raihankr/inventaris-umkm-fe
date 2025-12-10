import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Tag } from 'lucide-react';
import { useTheme } from "../../contexts/ThemeContext";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";

const GET_KATEGORI = "/categories";

export default function Kategori() {
  const { darkMode } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ nama: '', deskripsi: '' });

  // Fetch
  const fetchKategori = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet(GET_KATEGORI);

      let kategoriBaru = [];

      if (response?.data?.data && Array.isArray(response.data.data)) {
        kategoriBaru = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        kategoriBaru = response.data;
      } else if (Array.isArray(response)) {
        kategoriBaru = response;
      }

      setCategories(kategoriBaru);
    } catch (err) {
      const errorMsg = err?.response?.status === 401 
        ? "Autentikasi diperlukan. Silakan login ulang." 
        : "Gagal memuat data kategori";
      setError(errorMsg);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ nama: '', deskripsi: '' });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ 
      nama: category.name || '', 
      deskripsi: category.description || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.nama?.trim() || !formData.deskripsi?.trim()) {
      alert('Mohon lengkapi semua field');
      return;
    }
    
    try {
      const payload = {
        name: formData.nama,
        description: formData.deskripsi
      };

      // FIXED → pakai id_category
      if (editingCategory) {
        await apiPatch(`/categories/${editingCategory.id_category}`, payload);
      } else {
        await apiPost('/categories', payload);
      }
      
      await fetchKategori();
      setShowModal(false);
      setFormData({ nama: '', deskripsi: '' });
      setEditingCategory(null);
    } catch (err) {
      alert('Gagal menyimpan kategori: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
    
    try {
      await apiDelete(`/categories/${id}`); // id sudah benar → id_category
      await fetchKategori();
    } catch (err) {
      alert('Gagal menghapus kategori');
    }
  };

  // Filter
  const filteredCategories = categories.filter(cat => {
    const nama = (cat.name || '').toLowerCase();
    const desc = (cat.description || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return nama.includes(search) || desc.includes(search);
  });

  const totalProduk = categories.reduce((sum, cat) => sum + (cat.jumlahProduk || 0), 0);
  const kategoriAktif = categories.filter(cat => (cat.jumlahProduk || 0) > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center bg-[--background]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-[--background]">
        <div className="max-w-7xl mx-auto">
          <div className={`p-6 rounded-xl border ${
            darkMode ? 'bg-red-900/20 border-red-800 text-red-400' 
                     : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[--background] text-[--foreground]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Manajemen Kategori</h1>

        {/* Search + Add */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[--foreground] opacity-50" size={20} />
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-lg pl-12 pr-4 py-3 transition-all ${
                darkMode ? 'bg-gray-800 border border-gray-700 text-white' :
                           'bg-white border-2 border-gray-300 text-gray-800'
              }`}
            />
          </div>

          <button
            onClick={handleAdd}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
          >
            <Plus size={20} /> Tambah Kategori
          </button>
        </div>

        {/* Table */}
        <div className={`rounded-xl overflow-hidden border-2 ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-900' : 'bg-gray-800'}>
              <tr className="text-white">
                <th className="px-6 py-4 text-left text-sm font-semibold">Nama Kategori</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Deskripsi</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Jumlah Produk</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody className={darkMode ? 'divide-gray-700 divide-y' : 'divide-gray-200 divide-y'}>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  
                  // FIXED → key pakai id_category
                  <tr 
                    key={category.id_category ?? `cat-${index}`} 
                    className={darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'}
                  >

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag size={18} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                        <span className="font-medium">{category.name || '-'}</span>
                      </div>
                    </td>

                    <td className={darkMode ? 'px-6 py-4 text-gray-300' : 'px-6 py-4 text-gray-600'}>
                      {category.description || '-'}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        darkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {(category.jumlahProduk || 0) + " produk"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        
                        {/* FIXED → EDIT */}
                        <button
                          onClick={() => handleEdit(category)}
                          className={`p-2 rounded-lg ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 
                                       'bg-gray-800 hover:bg-black'
                          } text-white`}
                        >
                          <Edit2 size={16} />
                        </button>

                        {/* FIXED → DELETE pakai id_category */}
                        <button
                          onClick={() => handleDelete(category.id_category)}
                          className={`p-2 rounded-lg ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600' :
                                       'bg-gray-700 hover:bg-gray-800'
                          } text-white`}
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={4} 
                    className={`px-6 py-12 text-center ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {searchTerm ? 'Tidak ada kategori yang ditemukan' : 'Belum ada kategori'}
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* MODAL tetap sama */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl border-2 p-6 shadow-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
          }`}>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium mb-2">Nama Kategori</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className={`w-full rounded-lg px-4 py-3 ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600 text-white' 
                      : 'bg-white border-2 border-gray-300 text-gray-800'
                  }`}
                  placeholder="Contoh: Elektronik"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className={`w-full rounded-lg px-4 py-3 h-24 resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border border-gray-600 text-white' 
                      : 'bg-white border-2 border-gray-300 text-gray-800'
                  }`}
                  placeholder="Deskripsi kategori..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-semibold"
                >
                  {editingCategory ? 'Update' : 'Simpan'}
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className={`flex-1 py-3 rounded-lg font-semibold ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                             : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                  }`}
                >
                  Batal
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
