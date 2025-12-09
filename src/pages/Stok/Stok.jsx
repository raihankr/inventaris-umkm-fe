import React, { useState } from 'react';
import { useTheme } from "../../contexts/ThemeContext";
import { Plus, Edit2, Trash2, Search, Package, AlertTriangle, XCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function StokUMKM() {
  const { darkMode: isDark } = useTheme();

  const [stokBarang, setStokBarang] = useState([
    { id: 1, nama: 'Kemeja Batik', kategori: 'Pakaian', stok: 45, harga: 150000, satuan: 'pcs', minimal: 10 },
    { id: 2, nama: 'Keripik Singkong', kategori: 'Makanan', stok: 120, harga: 15000, satuan: 'pack', minimal: 20 },
    { id: 3, nama: 'Tas Anyaman', kategori: 'Kerajinan', stok: 8, harga: 85000, satuan: 'pcs', minimal: 20 },
    { id: 4, nama: 'Kopi Arabika', kategori: 'Minuman', stok: 3, harga: 45000, satuan: 'pack', minimal: 15 },
    { id: 5, nama: 'Sarung Tenun', kategori: 'Pakaian', stok: 0, harga: 200000, satuan: 'pcs', minimal: 5 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [formData, setFormData] = useState({
    nama: '', kategori: '', stok: '', harga: '', satuan: '', minimal: ''
  });

  const getStatus = (stok, minimal) => {
    if (stok === 0) {
      return {
        label: 'Habis',
        color: `${isDark ? 'bg-red-900/40 text-red-300 border-red-800' : 'bg-red-500/20 text-red-600 border-red-500/30'}`,
        icon: XCircle
      };
    } else if (stok <= minimal) {
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

  const totalNilai = stokBarang.reduce((total, item) => total + (item.stok * item.harga), 0);

  const filteredStok = stokBarang.filter(item => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const namaMatch = item.nama.toLowerCase().includes(term);
    const kategoriMatch = item.kategori.toLowerCase().includes(term);
    return namaMatch || kategoriMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStok.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStok.length / itemsPerPage) || 1;

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleSubmit = () => {
    // basic validation
    if (!formData.nama || !formData.kategori || formData.stok === '' || formData.stok === null ||
        formData.harga === '' || formData.satuan === '' || formData.minimal === '') {
      alert('Mohon lengkapi semua field');
      return;
    }

    // normalize numeric fields
    const normalized = {
      ...formData,
      stok: Number(formData.stok),
      harga: Number(formData.harga),
      minimal: Number(formData.minimal)
    };

    if (editingId) {
      const updatedStok = stokBarang.map(item => item.id === editingId ? { ...normalized, id: editingId } : item);
      setStokBarang(updatedStok);
    } else {
      const newItem = { ...normalized, id: Date.now() };
      setStokBarang(prev => [...prev, newItem]);
      // move to last page to show newly added item
      const newTotal = filteredStok.length + 1;
      const newPages = Math.ceil(newTotal / itemsPerPage);
      setCurrentPage(newPages);
    }

    closeModal();
  };

  const handleEdit = (item) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus barang ini?')) {
      setStokBarang(prev => prev.filter(item => item.id !== id));
      // adjust page if needed
      const newFiltered = filteredStok.length - 1;
      const newPages = Math.ceil(newFiltered / itemsPerPage) || 1;
      if (currentPage > newPages) setCurrentPage(newPages);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ nama: '', kategori: '', stok: '', harga: '', satuan: '', minimal: '' });
  };

  const openModal = () => {
    setShowModal(true);
    setEditingId(null);
    setFormData({ nama: '', kategori: '', stok: '', harga: '', satuan: '', minimal: '' });
  };

  const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors duration-200
      ${'bg-[--background] text-[--foreground]'}
    `}>

      {/* Mobile floating add button */}
      <button
        onClick={openModal}
        className="sm:hidden fixed bottom-5 right-5 bg-gray-900 hover:bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-50"
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
  onClick={openModal}
  className="hidden sm:flex bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg"
>
  <Plus size={20} />
  Tambah Barang
</button>

        </div>

        {/* ============================
             MOBILE LIST (visible on < sm)
             ============================ */}
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

        {/* ============================
             TABLE (visible on >= sm)
             ============================ */}
        <div className={`rounded-xl overflow-hidden border-2 transition-all hidden sm:block
          ${'bg-[--background] text-[--foreground]'}
        `}>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className={`${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-r from-gray-800 to-black text-white'}`}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nama Barang</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Kategori</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Stok</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Harga</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                </tr>
              </thead>

              <tbody className={`divide-y transition-colors ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {currentItems.map((item) => {
                  const status = getStatus(item.stok, item.minimal);
                  const StatusIcon = status.icon;
                  return (
                    <tr key={item.id} className={`${isDark ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'} transition-colors`}> 
                      <td className="px-6 py-4">
                        <div className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{item.nama}</div>
                        <div className={`${isDark ? 'text-gray-400' : 'text-sm text-gray-500'}`}>{item.satuan}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-gray-700/40 text-gray-200' : 'bg-gray-200 text-gray-800'}`}>
                          {item.kategori}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{item.stok}</span>
                      </td>

                      <td className="px-6 py-4 text-right font-medium">
                        {formatRupiah(item.harga)}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 ${status.color} border rounded-full text-sm font-medium inline-flex items-center gap-1`}> 
                          <StatusIcon size={14} /> {status.label}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className={`p-2 rounded-lg transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-800 hover:bg-black text-white'}`}>
                            <Edit2 size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className={`p-2 rounded-lg transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-700 hover:bg-gray-800 text-white'}`}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className={`px-6 py-8 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Tidak ada barang yang ditemukan.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
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
                  <input
                    type="text"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className={`w-full rounded-lg px-4 py-2 transition-all ${isDark ? 'bg-gray-700 border border-gray-600 text-gray-100' : 'bg-white border-2 border-gray-300 text-gray-800'}`}
                    placeholder="Contoh: Pakaian"
                  />
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
