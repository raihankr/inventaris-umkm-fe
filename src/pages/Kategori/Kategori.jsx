import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, Tag, X } from 'lucide-react';
import { useTheme } from "../../contexts/ThemeContext";

export default function KategoriUMKM() {
  const { darkMode } = useTheme();
  
  const [kategoriList, setKategoriList] = useState([
    { id: 1, nama: 'Pakaian', deskripsi: 'Produk fashion dan pakaian tradisional', jumlahProduk: 12 },
    { id: 2, nama: 'Makanan', deskripsi: 'Makanan ringan dan olahan', jumlahProduk: 25 },
    { id: 3, nama: 'Kerajinan', deskripsi: 'Kerajinan tangan dan seni', jumlahProduk: 8 },
    { id: 4, nama: 'Minuman', deskripsi: 'Minuman tradisional dan modern', jumlahProduk: 15 },
    { id: 5, nama: 'Aksesoris', deskripsi: 'Aksesoris dan perhiasan', jumlahProduk: 7 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [formData, setFormData] = useState({
    nama: '', deskripsi: ''
  });

  const filteredKategori = kategoriList.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKategori.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredKategori.length / itemsPerPage) || 1;

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleSubmit = () => {
    if (!formData.nama || !formData.deskripsi) {
      alert('Mohon lengkapi semua field');
      return;
    }

    if (editingId) {
      const updatedKategori = kategoriList.map(item => 
        item.id === editingId ? { ...item, ...formData } : item
      );
      setKategoriList(updatedKategori);
    } else {
      const newItem = { ...formData, id: Date.now(), jumlahProduk: 0 };
      setKategoriList([...kategoriList, newItem]);
      const newTotal = filteredKategori.length + 1;
      const newPages = Math.ceil(newTotal / itemsPerPage);
      setCurrentPage(newPages);
    }

    closeModal();
  };

  const handleEdit = (item) => {
    setFormData({ nama: item.nama, deskripsi: item.deskripsi });
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus kategori ini?')) {
      setKategoriList(prev => prev.filter(item => item.id !== id));
      const newFiltered = filteredKategori.length - 1;
      const newPages = Math.ceil(newFiltered / itemsPerPage) || 1;
      if (currentPage > newPages) setCurrentPage(newPages);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ nama: '', deskripsi: '' });
  };

  const openModal = () => {
    setShowModal(true);
    setEditingId(null);
    setFormData({ nama: '', deskripsi: '' });
  };

  const totalProduk = kategoriList.reduce((sum, item) => sum + item.jumlahProduk, 0);

  return (
    <div className="min-h-screen p-4 sm:p-6 transition-colors duration-200 bg-[--background] text-[--foreground]">

      {/* Mobile floating add button */}
      <button
        onClick={openModal}
        className="sm:hidden fixed bottom-5 right-5 bg-gray-900 hover:bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-50"
      >
        <Plus size={28} />
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Manajemen Kategori</h1>
          <p className="text-[--foreground]">
            Kelola kategori produk UMKM Anda
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className={`rounded-xl p-5 border-2 transition-all ${
            darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                  Total Kategori
                </p>
                <p className="text-3xl font-bold">{kategoriList.length}</p>
              </div>
              <Tag size={36} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            </div>
          </div>

          <div className={`rounded-xl p-5 border-2 transition-all ${
            darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                  Total Produk
                </p>
                <p className="text-3xl font-bold">{totalProduk}</p>
              </div>
              <Tag size={36} className={darkMode ? 'text-green-400' : 'text-green-600'} />
            </div>
          </div>

          <div className={`rounded-xl p-5 border-2 transition-all ${
            darkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                  Rata-rata Produk
                </p>
                <p className="text-3xl font-bold">
                  {kategoriList.length > 0 ? Math.round(totalProduk / kategoriList.length) : 0}
                </p>
              </div>
              <Tag size={36} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
            </div>
          </div>
        </div>

        {/* Search + add */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[--foreground]" size={20} />
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className={`w-full rounded-lg pl-12 pr-4 py-3 transition-all ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>

          <button
            onClick={openModal}
            className="hidden sm:flex bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold items-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            Tambah Kategori
          </button>
        </div>

        {/* Mobile List */}
        <div className="sm:hidden space-y-3 mb-6">
          {currentItems.map(item => (
            <div key={item.id} className={`rounded-xl p-4 border transition-all ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.nama}</h3>
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.deskripsi}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    darkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.jumlahProduk} Produk
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className={`p-2 rounded-lg transition-all ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 hover:bg-black'
                    } text-white`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className={`p-2 rounded-lg transition-all ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-800'
                    } text-white`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {currentItems.length === 0 && (
            <div className={`px-4 py-6 text-center rounded-xl border ${
              darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'
            }`}>
              Tidak ada kategori yang ditemukan.
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="rounded-xl overflow-hidden border-2 transition-all hidden sm:block bg-[--background] text-[--foreground]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-gray-800 to-black'}>
                <tr className="text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nama Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Deskripsi</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Jumlah Produk</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                </tr>
              </thead>

              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {currentItems.map((item) => (
                  <tr key={item.id} className={`transition-colors ${
                    darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'
                  }`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag size={18} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                        <span className="font-medium">{item.nama}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {item.deskripsi}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        darkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.jumlahProduk} Produk
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className={`p-2 rounded-lg transition-all ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 hover:bg-black'
                          } text-white`}
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className={`p-2 rounded-lg transition-all ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-800'
                          } text-white`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className={`px-6 py-8 text-center ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Tidak ada kategori yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredKategori.length > itemsPerPage && (
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 ${
              darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white'
            }`}>
              <div className={darkMode ? 'text-gray-300' : 'text-sm text-gray-600'}>
                Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredKategori.length)} dari {filteredKategori.length} kategori
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === 1 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-800 text-white hover:bg-black'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          currentPage === pageNumber 
                            ? 'bg-gray-900 text-white' 
                            : darkMode 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === totalPages 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-800 text-white hover:bg-black'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Pagination */}
        {filteredKategori.length > itemsPerPage && (
          <div className="md:hidden flex flex-col items-center mt-6 pb-6">
            <div className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredKategori.length)} dari {filteredKategori.length} kategori
            </div>
        
            <div className="flex items-center gap-3">
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
              
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {currentPage} / {totalPages}
              </span>
              
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-md rounded-xl border-2 p-6 shadow-2xl transition-all ${
              darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                </h2>
                <button 
                  onClick={closeModal}
                  className={`transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Nama Kategori
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className={`w-full rounded-lg px-4 py-2 transition-all ${
                      darkMode 
                        ? 'bg-gray-700 border border-gray-600 text-gray-100' 
                        : 'bg-white border-2 border-gray-300 text-gray-800'
                    }`}
                    placeholder="Contoh: Makanan"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className={`w-full rounded-lg px-4 py-2 transition-all ${
                      darkMode 
                        ? 'bg-gray-700 border border-gray-600 text-gray-100' 
                        : 'bg-white border-2 border-gray-300 text-gray-800'
                    }`}
                    placeholder="Deskripsi kategori..."
                    rows="3"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={handleSubmit}
                    className="flex-1 bg-gray-900 hover:bg-black text-white py-2 rounded-lg font-semibold transition-all"
                  >
                    {editingId ? 'Update' : 'Simpan'}
                  </button>
                  <button 
                    onClick={closeModal}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                      darkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
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
    </div>
  );
}