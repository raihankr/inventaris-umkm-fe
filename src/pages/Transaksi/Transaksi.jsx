import React, { useState } from 'react';
import { Plus, Search, TrendingUp, TrendingDown, Calendar, ChevronLeft, ChevronRight, ShoppingCart, Package, X } from 'lucide-react';

export default function TransaksiUMKM() {
  const [transaksiList, setTransaksiList] = useState([
    { id: 1, tanggal: '2024-01-15', jenis: 'Masuk', barang: 'Kemeja Batik', jumlah: 50, harga: 150000, total: 7500000, keterangan: 'Restock dari supplier' },
    { id: 2, tanggal: '2024-01-16', jenis: 'Keluar', barang: 'Keripik Singkong', jumlah: 30, harga: 15000, total: 450000, keterangan: 'Penjualan retail' },
    { id: 3, tanggal: '2024-01-16', jenis: 'Keluar', barang: 'Tas Anyaman', jumlah: 5, harga: 85000, total: 425000, keterangan: 'Penjualan online' },
    { id: 4, tanggal: '2024-01-17', jenis: 'Masuk', barang: 'Kopi Arabika', jumlah: 100, harga: 45000, total: 4500000, keterangan: 'Pembelian stok baru' },
    { id: 5, tanggal: '2024-01-18', jenis: 'Keluar', barang: 'Sarung Tenun', jumlah: 3, harga: 200000, total: 600000, keterangan: 'Penjualan ke toko' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [formData, setFormData] = useState({
    tanggal: '', jenis: 'Masuk', barang: '', jumlah: '', harga: '', keterangan: ''
  });

  const getStats = () => {
    const masuk = transaksiList.filter(t => t.jenis === 'Masuk');
    const keluar = transaksiList.filter(t => t.jenis === 'Keluar');
    return {
      jumlahMasuk: masuk.length,
      jumlahKeluar: keluar.length,
      totalMasuk: masuk.reduce((s, t) => s + t.total, 0),
      totalKeluar: keluar.reduce((s, t) => s + t.total, 0),
      profit: keluar.reduce((s, t) => s + t.total, 0) - masuk.reduce((s, t) => s + t.total, 0)
    };
  };

  const stats = getStats();
  const filtered = transaksiList.filter(t => 
    (t.barang.toLowerCase().includes(searchTerm.toLowerCase()) || 
     t.keterangan.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterJenis === 'Semua' || t.jenis === filterJenis)
  );

  const current = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleSubmit = () => {
    if (!formData.tanggal || !formData.barang || !formData.jumlah || !formData.harga) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }
    const newItem = {
      ...formData, id: Date.now(),
      total: parseInt(formData.jumlah) * parseInt(formData.harga),
      jumlah: parseInt(formData.jumlah), harga: parseInt(formData.harga)
    };
    setTransaksiList([...transaksiList, newItem]);
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ tanggal: '', jenis: 'Masuk', barang: '', jumlah: '', harga: '', keterangan: '' });
  };

  const openModal = () => {
    setShowModal(true);
    setFormData({ ...formData, tanggal: new Date().toISOString().split('T')[0] });
  };

  const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
  const formatTanggal = (t) => new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-black dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Manajemen Transaksi
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 sm:p-5 border-2 border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 dark:text-green-400 text-xs sm:text-sm mb-1">Transaksi Masuk</p>
                <p className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300 mb-1">{stats.jumlahMasuk} Transaksi</p>
                <p className="text-base sm:text-lg font-semibold text-green-700 dark:text-green-400">{formatRupiah(stats.totalMasuk)}</p>
              </div>
              <TrendingDown className="text-green-600 dark:text-green-400" size={32} />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 sm:p-5 border-2 border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 dark:text-blue-400 text-xs sm:text-sm mb-1">Transaksi Keluar</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-300 mb-1">{stats.jumlahKeluar} Transaksi</p>
                <p className="text-base sm:text-lg font-semibold text-blue-700 dark:text-blue-400">{formatRupiah(stats.totalKeluar)}</p>
              </div>
              <TrendingUp className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 rounded-xl p-4 sm:p-6 mb-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 dark:text-gray-400 text-xs sm:text-sm mb-1">Keuntungan Bersih</p>
              <p className="text-2xl sm:text-3xl font-bold">{formatRupiah(Math.abs(stats.profit))}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input type="text" placeholder="Cari barang atau keterangan..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg pl-12 pr-4 py-3 text-sm sm:text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500 transition-all"
            />
          </div>

          <select value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)}
            className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm sm:text-base text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500 transition-all appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2.5rem' }}>
            <option value="Semua">Semua Transaksi</option>
            <option value="Masuk">Transaksi Masuk</option>
            <option value="Keluar">Transaksi Keluar</option>
          </select>
          
          <button onClick={openModal}
            className="bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg text-sm sm:text-base">
            <Plus size={20} />
            <span className="hidden sm:inline">Tambah Transaksi</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gradient-to-r from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 text-white">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold">Tanggal</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold">Jenis</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold">Barang</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold">Jumlah</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold">Harga Satuan</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold">Total</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {current.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400 dark:text-gray-500 hidden sm:block" />
                        <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">{formatTanggal(item.tanggal)}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {item.jenis === 'Masuk' ? (
                        <span className="px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-1">
                          <Package size={12} className="hidden sm:block" /> Masuk
                        </span>
                      ) : (
                        <span className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-1">
                          <ShoppingCart size={12} className="hidden sm:block" /> Keluar
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="font-medium text-gray-800 dark:text-gray-200 text-xs sm:text-base">{item.barang}</div>
                      {item.keterangan && <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{item.keterangan}</div>}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                      <span className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">{item.jumlah}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right font-medium text-gray-800 dark:text-gray-200 text-xs sm:text-base">
                      {formatRupiah(item.harga)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-100">{formatRupiah(item.total)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filtered.length > itemsPerPage && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 p-4">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} dari {filtered.length} transaksi
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${currentPage === 1 ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'bg-gray-800 dark:bg-gray-700 text-white hover:bg-black dark:hover:bg-gray-600'}`}>
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-sm ${currentPage === i + 1 ? 'bg-gray-900 dark:bg-gray-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>

              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all ${currentPage === totalPages ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'bg-gray-800 dark:bg-gray-700 text-white hover:bg-black dark:hover:bg-gray-600'}`}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 p-5 sm:p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto relative">
              <button onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                <X size={24} />
              </button>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100">Tambah Transaksi Baru</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tanggal</label>
                  <input type="date" value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm sm:text-base text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jenis Transaksi</label>
                  <select value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm sm:text-base text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500">
                    <option value="Masuk">Transaksi Masuk (Pembelian)</option>
                    <option value="Keluar">Transaksi Keluar (Penjualan)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Barang</label>
                  <input type="text" value={formData.barang}
                    onChange={(e) => setFormData({ ...formData, barang: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm sm:text-base text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500"
                    placeholder="Contoh: Kemeja Batik" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jumlah</label>
                    <input type="number" value={formData.jumlah}
                      onChange={(e) => setFormData({ ...formData, jumlah: e.target.value === '' ? '' : parseInt(e.target.value) })}
                      className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm sm:text-base text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500"
                      placeholder="0" min="1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Harga Satuan</label>
                    <input type="number" value={formData.harga}
                      onChange={(e) => setFormData({ ...formData, harga: e.target.value === '' ? '' : parseInt(e.target.value) })}
                      className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm sm:text-base text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500"
                      placeholder="0" min="0" />
                  </div>
                </div>

                {formData.jumlah && formData.harga && (
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Transaksi:</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                      {formatRupiah(parseInt(formData.jumlah || 0) * parseInt(formData.harga || 0))}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Keterangan (Opsional)</label>
                  <textarea value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm sm:text-base text-gray-800 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500"
                    placeholder="Catatan transaksi..." rows="3" />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button onClick={handleSubmit}
                    className="flex-1 bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base">
                    Simpan
                  </button>
                  <button onClick={closeModal}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base">
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