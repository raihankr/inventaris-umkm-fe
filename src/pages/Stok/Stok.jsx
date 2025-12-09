import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Package, AlertTriangle, XCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function StokUMKM() {
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
    if (stok === 0) return { label: 'Habis', color: 'bg-red-500/20 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-500/30 dark:border-red-800', icon: XCircle };
    if (stok <= minimal) return { label: 'Perlu Restock', color: 'bg-yellow-500/20 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 dark:border-yellow-800', icon: AlertTriangle };
    return { label: 'Tersedia', color: 'bg-green-500/20 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-500/30 dark:border-green-800', icon: Package };
  };

  const getStats = () => {
    const tersedia = stokBarang.filter(i => getStatus(i.stok, i.minimal).label === 'Tersedia').length;
    const perluRestock = stokBarang.filter(i => getStatus(i.stok, i.minimal).label === 'Perlu Restock').length;
    const habis = stokBarang.filter(i => getStatus(i.stok, i.minimal).label === 'Habis').length;
    return { tersedia, perluRestock, habis };
  };

  const stats = getStats();
  const totalNilai = stokBarang.reduce((t, i) => t + (i.stok * i.harga), 0);
  const filtered = stokBarang.filter(i => 
    i.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const current = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleSubmit = () => {
    if (!formData.nama || !formData.kategori || formData.stok === '' || !formData.harga || !formData.satuan || !formData.minimal) {
      alert('Mohon lengkapi semua field');
      return;
    }
    
    if (editingId) {
      setStokBarang(stokBarang.map(i => i.id === editingId ? { ...formData, id: editingId } : i));
    } else {
      setStokBarang([...stokBarang, { ...formData, id: Date.now() }]);
    }
    closeModal();
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus barang ini?')) {
      setStokBarang(stokBarang.filter(i => i.id !== id));
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 sm:p-6">
      <button onClick={openModal}
        className="sm:hidden fixed bottom-5 right-5 bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all z-40">
        <Plus size={28} />
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-black dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Manajemen Stok UMKM
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola inventaris produk UMKM Anda dengan mudah</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border-2 border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 dark:text-green-400 text-sm mb-1">Tersedia</p>
                <p className="text-3xl font-bold text-green-800 dark:text-green-300">{stats.tersedia}</p>
              </div>
              <Package className="text-green-600 dark:text-green-400" size={36} />
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-5 border-2 border-yellow-200 dark:border-yellow-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-700 dark:text-yellow-400 text-sm mb-1">Perlu Restock</p>
                <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-300">{stats.perluRestock}</p>
              </div>
              <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={36} />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border-2 border-red-200 dark:border-red-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 dark:text-red-400 text-sm mb-1">Habis</p>
                <p className="text-3xl font-bold text-red-800 dark:text-red-300">{stats.habis}</p>
              </div>
              <XCircle className="text-red-600 dark:text-red-400" size={36} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 rounded-xl p-6 mb-6 text-white shadow-lg">
          <p className="text-gray-300 dark:text-gray-400 text-sm mb-1">Total Nilai Inventaris</p>
          <p className="text-2xl sm:text-3xl font-bold">{formatRupiah(totalNilai)}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input type="text" placeholder="Cari barang atau kategori..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg pl-12 pr-4 py-2 md:py-3 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500 transition-all" />
          </div>
          
          <button onClick={openModal}
            className="bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg">
            <Plus size={20} />
            Tambah Barang
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nama Barang</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Kategori</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Stok</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Harga</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {current.map((item) => {
                  const status = getStatus(item.stok, item.minimal);
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800 dark:text-gray-200">{item.nama}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{item.satuan}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.stok}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-800 dark:text-gray-200">
                        {formatRupiah(item.harga)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 ${status.color} border rounded-full text-sm font-medium inline-flex items-center gap-1`}>
                          <StatusIcon size={14} /> {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(item)}
                            className="p-2 bg-gray-800 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white rounded-lg transition-all">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)}
                            className="p-2 bg-gray-700 dark:bg-gray-600 hover:bg-gray-900 dark:hover:bg-gray-500 text-white rounded-lg transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filtered.length > itemsPerPage && (
          <div className="mt-6 flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} dari {filtered.length} barang
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${currentPage === 1 ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'bg-gray-800 dark:bg-gray-700 text-white hover:bg-black dark:hover:bg-gray-600'}`}>
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === i + 1 ? 'bg-gray-900 dark:bg-gray-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>

              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all ${currentPage === totalPages ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'bg-gray-800 dark:bg-gray-700 text-white hover:bg-black dark:hover:bg-gray-600'}`}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 p-6 w-full max-w-md shadow-2xl relative">
              <button onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                {editingId ? 'Edit Barang' : 'Tambah Barang Baru'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Barang</label>
                  <input type="text" value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500"
                    placeholder="Contoh: Kemeja Batik" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
                  <input type="text" value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-500 dark:focus:border-gray-500"
                    placeholder="Contoh: Pakaian" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stok</label>
                    <input type="number" value={formData.stok}
                      onChange={(e) => setFormData({ ...formData, stok: e.target.value === '' ? '' : parseInt(e.target.value) })}
                      className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500"
                      placeholder="0" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Satuan</label>
                    <input type="text" value={formData.satuan}
                      onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                      className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500"
                      placeholder="pcs" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Harga</label>
                  <input type="number" value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: parseInt(e.target.value) || '' })}
                    className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500"
                    placeholder="150000" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stok Minimal</label>
                  <input type="number" value={formData.minimal}
                    onChange={(e) => setFormData({ ...formData, minimal: parseInt(e.target.value) || '' })}
                    className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500"
                    placeholder="10" />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button onClick={handleSubmit}
                    className="flex-1 bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition-all">
                    {editingId ? 'Update' : 'Simpan'}
                  </button>
                  <button onClick={closeModal}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 py-2 rounded-lg font-semibold transition-all">
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