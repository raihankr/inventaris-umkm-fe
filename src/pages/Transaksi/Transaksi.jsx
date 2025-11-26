import React, { useState } from 'react';
import { Plus, Search, TrendingUp, TrendingDown, DollarSign, Calendar, ChevronLeft, ChevronRight, ShoppingCart, Package } from 'lucide-react';

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
    tanggal: '',
    jenis: 'Masuk',
    barang: '',
    jumlah: '',
    harga: '',
    keterangan: ''
  });

  const getStatsData = () => {
    const transaksiMasuk = transaksiList.filter(item => item.jenis === 'Masuk');
    const transaksiKeluar = transaksiList.filter(item => item.jenis === 'Keluar');

    const totalMasuk = transaksiMasuk.reduce((sum, item) => sum + item.total, 0);
    const totalKeluar = transaksiKeluar.reduce((sum, item) => sum + item.total, 0);
    const profit = totalKeluar - totalMasuk;

    return {
      jumlahMasuk: transaksiMasuk.length,
      jumlahKeluar: transaksiKeluar.length,
      totalMasuk,
      totalKeluar,
      profit
    };
  };

  const stats = getStatsData();

  const filteredTransaksi = transaksiList.filter(item => {
    const matchSearch = item.barang.toLowerCase().includes(searchTerm.toLowerCase()) || item.keterangan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterJenis === 'Semua' || item.jenis === filterJenis;
    return matchSearch && matchFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransaksi.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransaksi.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSubmit = () => {
    if (!formData.tanggal || !formData.jenis || !formData.barang || formData.jumlah === '' || !formData.harga) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    const total = parseInt(formData.jumlah) * parseInt(formData.harga);

    const newItem = {
      ...formData,
      id: Date.now(),
      total,
      jumlah: parseInt(formData.jumlah),
      harga: parseInt(formData.harga)
    };

    setTransaksiList([...transaksiList, newItem]);

    setShowModal(false);
    setFormData({ tanggal: '', jenis: 'Masuk', barang: '', jumlah: '', harga: '', keterangan: '' });
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleTambahTransaksi = () => {
    setShowModal(true);
    const today = new Date().toISOString().split('T')[0];
    setFormData({ tanggal: today, jenis: 'Masuk', barang: '', jumlah: '', harga: '', keterangan: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">Manajemen Transaksi</h1>
          <p className="text-gray-600">Kelola transaksi masuk dan keluar barang</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm mb-1">Transaksi Masuk</p>
                <p className="text-2xl font-bold text-green-800 mb-1">{stats.jumlahMasuk} Transaksi</p>
                <p className="text-lg font-semibold text-green-700">{formatRupiah(stats.totalMasuk)}</p>
              </div>
              <TrendingDown className="text-green-600" size={40} />
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm mb-1">Transaksi Keluar</p>
                <p className="text-2xl font-bold text-blue-800 mb-1">{stats.jumlahKeluar} Transaksi</p>
                <p className="text-lg font-semibold text-blue-700">{formatRupiah(stats.totalKeluar)}</p>
              </div>
              <TrendingUp className="text-blue-600" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-black rounded-xl p-6 mb-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm mb-1">Keuntungan Bersih</p>
              <p className="text-3xl font-bold">{formatRupiah(stats.profit)}</p>
            </div>
            <DollarSign size={48} className="text-white opacity-80" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari barang atau keterangan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-gray-300 rounded-lg pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-800 transition-all"
            />
          </div>

          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-gray-800 transition-all"
          >
            <option value="Semua">Semua Transaksi</option>
            <option value="Masuk">Transaksi Masuk</option>
            <option value="Keluar">Transaksi Keluar</option>
          </select>

          <button
            onClick={handleTambahTransaksi}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg"
          >
            <Plus size={20} />
            Tambah Transaksi
          </button>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-300 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Jenis</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Barang</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Jumlah</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Harga Satuan</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Total</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-800">{formatTanggal(item.tanggal)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {item.jenis === 'Masuk' ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium inline-flex items-center gap-1">
                          <Package size={14} /> Masuk
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium inline-flex items-center gap-1">
                          <ShoppingCart size={14} /> Keluar
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{item.barang}</div>
                      {item.keterangan && (
                        <div className="text-sm text-gray-500">{item.keterangan}</div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-semibold text-gray-800">{item.jumlah}</span>
                    </td>

                    <td className="px-6 py-4 text-right font-medium text-gray-800">{formatRupiah(item.harga)}</td>

                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-bold text-gray-900">{formatRupiah(item.total)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTransaksi.length > itemsPerPage && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-xl border-2 border-gray-300 p-4">
            <div className="text-sm text-gray-600">
              Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredTransaksi.length)} dari {filteredTransaksi.length} transaksi
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-black'}`}
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
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === pageNumber ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-black'}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl border-2 border-gray-300 p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Tambah Transaksi Baru</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi</label>
                  <select
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                  >
                    <option value="Masuk">Transaksi Masuk (Pembelian)</option>
                    <option value="Keluar">Transaksi Keluar (Penjualan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Barang</label>
                  <input
                    type="text"
                    value={formData.barang}
                    onChange={(e) => setFormData({ ...formData, barang: e.target.value })}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                    placeholder="Contoh: Kemeja Batik"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                    <input
                      type="number"
                      value={formData.jumlah}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, jumlah: value === '' ? '' : parseInt(value) });
                      }}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                      placeholder="0"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Harga Satuan</label>
                    <input
                      type="number"
                      value={formData.harga}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, harga: value === '' ? '' : parseInt(value) });
                      }}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {formData.jumlah && formData.harga && (
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Total Transaksi:</p>
                    <p className="text-xl font-bold text-gray-900">{formatRupiah((parseInt(formData.jumlah || 0) * parseInt(formData.harga || 0)))}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan (Opsional)</label>
                  <textarea
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                    placeholder="Catatan transaksi..."
                    rows="3"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gray-900 hover:bg-black text-white py-2 rounded-lg font-semibold transition-all"
                  >
                    Simpan
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
