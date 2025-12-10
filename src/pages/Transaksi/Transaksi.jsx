import React, { useEffect, useState } from 'react';
import {
  Plus, Search, TrendingUp, TrendingDown, Calendar,
  ChevronLeft, ChevronRight, XIcon
} from 'lucide-react';
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogClose, DialogContent,
  DialogDescription, DialogOverlay, DialogTitle
} from '@radix-ui/react-dialog';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { LIST_TRX } from '@/constants/api/transaction';
import { apiGet } from '@/lib/api';

export default function TransaksiUMKM() {
  const { darkMode: isDark } = useTheme();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    tanggal: '', jenis: 'Masuk', barang: '', jumlah: '', harga: '', keterangan: ''
  });

  const [selected, setSelected] = useState(null);

  async function loadData() {
    setLoading(true);

    const res = await apiGet(
      `${LIST_TRX}?page=${currentPage}&limit=${itemsPerPage}`
    );

    if (res?.error) {
      setError(res.message || "Gagal memuat data transaksi");
      setLoading(false);
      return;
    }

    const mapped = (res?.data?.data?.data || []).map((trx) => ({
      id: trx.id_transaction,
      tanggal: trx.createdAt,
      jenis: trx.type === "buy" ? "Masuk" : "Keluar",
      barang: "-",
      jumlah: 0,
      harga: 0,
      total: trx.total_price,
      keterangan: trx.description || "-"
    }));

    setData(mapped);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const getStats = () => {
    const masuk = data.filter(t => t.jenis === 'Masuk');
    const keluar = data.filter(t => t.jenis === 'Keluar');
    return {
      jumlahMasuk: masuk.length,
      jumlahKeluar: keluar.length,
      totalMasuk: masuk.reduce((s, t) => s + t.total, 0),
      totalKeluar: keluar.reduce((s, t) => s + t.total, 0),
      profit: keluar.reduce((s, t) => s + t.total, 0) -
        masuk.reduce((s, t) => s + t.total, 0)
    };
  };

  const stats = getStats();

  const filteredTransaksi = data.filter(t =>
    (t.barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.keterangan.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterJenis === 'Semua' || t.jenis === filterJenis)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransaksi.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredTransaksi.length / itemsPerPage));

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const formatRupiah = (n) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(n);

  const formatTanggal = (t) =>
    new Date(t).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

  const handleTambahTransaksi = () => {
    setShowModal(true);
    setEditingId(null);
  };


  // helper class yg bakal ke pake
  const bg = isDark ? 'bg-slate-900' : 'bg-white';
  const cardBg = isDark ? 'bg-slate-800 border-slate-700 shadow-none' : 'bg-white border-gray-300';
  const text = isDark ? 'text-gray-100' : 'text-gray-800';
  const subText = isDark ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDark ? 'bg-slate-800 border-slate-700 text-gray-100 placeholder:text-slate-400' : 'bg-white border-gray-300 text-gray-800 placeholder:text-gray-400';
  const tableHeadBg = isDark ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white' : 'bg-gradient-to-r from-gray-800 to-black text-white';
  const rowHover = isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-50';
  const badgeMasukBg = isDark ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-700';
  const badgeKeluarBg = isDark ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-700';

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors duration-200 ${'bg-[--background] text-[--foreground]'}`}>
      <div className="max-w-7xl mx-auto">

        {/* Mobile floating add button */}
        <button
          onClick={handleTambahTransaksi}
          className={`sm:hidden fixed bottom-5 right-5 bg-gray-900 hover:bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-50
                  ${isDark
              ? 'bg-gray-800 text-white hover:bg-white hover:text-black'
              : 'bg-black text-white hover:bg-gray-900'
            }`}
        >
          <Plus size={28} />
        </button>

        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${'bg-[--background] text-[--foreground]'}`}>Manajemen Transaksi</h1>
          <p className={`${subText}`}>Kelola transaksi masuk dan keluar barang</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className={`${cardBg} rounded-xl p-5 border-2 shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${isDark ? 'text-green-300' : 'text-green-700'}`}>Transaksi Masuk</p>
                <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-green-200' : 'text-green-800'}`}>{stats.jumlahMasuk} Transaksi</p>
                <p className={`text-lg font-semibold ${isDark ? 'text-green-200' : 'text-green-700'}`}>{formatRupiah(stats.totalMasuk)}</p>
              </div>
              <TrendingDown className={isDark ? "text-green-300" : "text-green-600"} size={40} />
            </div>
          </div>

          <div className={`${cardBg} rounded-xl p-5 border-2 shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>Transaksi Keluar</p>
                <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>{stats.jumlahKeluar} Transaksi</p>
                <p className={`text-lg font-semibold ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>{formatRupiah(stats.totalKeluar)}</p>
              </div>
              <TrendingUp className={isDark ? "text-blue-300" : "text-blue-600"} size={40} />
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-gray-800 to-black'} rounded-xl p-6 mb-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 dark:text-gray-400 text-xs sm:text-sm mb-1">Keuntungan Bersih</p>
              <p className="text-2xl sm:text-3xl font-bold">{formatRupiah(Math.abs(stats.profit))}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-row gap-3 mb-6">

          {/* SEARCH */}
          <div className="flex-1 relative">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}
              size={20}
            />
            <input
              type="text"
              placeholder="Cari barang atau keterangan..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className={`w-full ${inputBg} rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-gray-500 transition-all`}
            />
          </div>

          {/* FILTER */}
          <select
            value={filterJenis}
            onChange={(e) => { setFilterJenis(e.target.value); setCurrentPage(1); }}
            className={`
              w-32 md:w-40
              ${inputBg} rounded-lg px-3 py-3 text-sm 
              focus:outline-none focus:border-gray-500 transition-all
            `}
          >
            <option value="Semua">Semua Transaksi</option>
            <option value="Masuk">Transaksi Masuk</option>
            <option value="Keluar">Transaksi Keluar</option>
          </select>



          <button
            onClick={handleTambahTransaksi}
            className={`hidden sm:flex px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg ${isDark
              ? "bg-gray-800 text-white hover:bg-white hover:text-black"
              : "bg-black text-white hover:bg-gray-900"
              }`}
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Tambah Transaksi</span>
            <span className="inline sm:hidden text-sm">Tambah</span>
          </button>
        </div>

        {/* Desktop Table view */}
        <div className={`hidden md:block ${cardBg} rounded-xl overflow-hidden ${isDark ? 'border-slate-700' : 'border-gray-300'}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className={tableHeadBg}>
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold">Tanggal</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold">Jenis Transaksi</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-sm font-semibold">Total</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-sm font-semibold">Aksi</th>
                </tr>
              </thead>

              <tbody className={`${isDark ? 'divide-slate-700' : 'divide-gray-200'}`}>
                {currentItems.map((item) => (
                  <tr key={item.id} className={`${rowHover} transition-colors`}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className={isDark ? "text-slate-400" : "text-gray-400"} />
                        <span className={`text-sm ${text}`}>{formatTanggal(item.tanggal)}</span>
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 py-4">
                      {item.jenis === 'Masuk' ? (
                        <span className={`px-3 py-1 ${badgeMasukBg} rounded-full text-sm font-medium inline-flex items-center gap-1`}>
                          <TrendingDown size={14} /> Masuk
                        </span>
                      ) : (
                        <span className={`px-3 py-1 ${badgeKeluarBg} rounded-full text-sm font-medium inline-flex items-center gap-1`}>
                          <TrendingUp size={14} /> Keluar
                        </span>
                      )}
                    </td>

                    <td className="px-4 sm:px-6 py-4 text-right">
                      <span className={`text-lg font-bold ${text}`}>{formatRupiah(item.total)}</span>
                    </td>

                    <td className="px-4 sm:px-6 py-4 text-right font-medium">
                      <Button variant="outline" onClick={() => setSelected(item)}>
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 sm:px-6 py-8 text-center text-sm text-gray-500">
                      Tidak ada transaksi yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile: Card/List view */}
        <div className="md:hidden space-y-3">
          {currentItems.length === 0 && (
            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'}`}>
              <p className="text-sm text-center text-gray-400">Tidak ada transaksi yang cocok.</p>
            </div>
          )}

          {/* MOBILE LIST VIEW */}
          <div className="md:hidden space-y-4 mt-4">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}
              >
                <div className="flex justify-between items-start">
                  <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formatTanggal(item.tanggal)}
                  </p>

                  <span
                    className={`px-2 py-1 text-xs rounded-md font-semibold flex items-center gap-1 
                  ${item.jenis === 'Masuk'
                        ? (isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700')
                        : (isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700')
                      }`}
                  >
                    {item.jenis === 'Masuk' ? (
                      <TrendingDown size={14} />
                    ) : (
                      <TrendingUp size={14} />
                    )}
                    {item.jenis}
                  </span>
                </div>


                <div className="flex justify-between items-end mt-3">
                  <div className="text-right ml-auto">
                    <p className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      {formatRupiah(item.total)}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {formatRupiah(item.harga)} × {item.jumlah}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {filteredTransaksi.length > itemsPerPage && (
          <div className={`${cardBg} mt-6 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3`}>
            <div className={`text-sm ${subText}`}>
              Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredTransaksi.length)} dari {filteredTransaksi.length} transaksi
            </div>

            {/* Desktop pagination */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${currentPage === 1 ? 'bg-slate-600/40 text-slate-400 cursor-not-allowed' : (isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-800 text-white hover:bg-black')}`}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-1 overflow-x-auto">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${currentPage === pageNumber ? (isDark ? 'bg-slate-700 text-white' : 'bg-gray-900 text-white') : (isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all ${currentPage === totalPages ? 'bg-slate-600/40 text-slate-400 cursor-not-allowed' : (isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-800 text-white hover:bg-black')}`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className={`w-full mx-2 sm:mx-0 max-w-md rounded-xl border-2 p-6 shadow-2xl transition-all ${isDark
                ? "bg-gray-800 border-gray-700 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
                }`}
            >
              <h2 className="text-2xl font-bold mb-6">
                Tambah Transaksi Baru
              </h2>

              <div className="space-y-4">
                {/* Tanggal */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className={`w-full rounded-lg px-4 py-2 transition-all ${isDark
                      ? "bg-gray-700 border border-gray-600 text-gray-100"
                      : "bg-white border-2 border-gray-300 text-gray-800"
                      }`}
                  />
                </div>

                {/* Jenis Transaksi */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Jenis Transaksi
                  </label>
                  <select
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    className={`w-full rounded-lg px-4 py-2 transition-all ${isDark
                      ? "bg-gray-700 border border-gray-600 text-gray-100"
                      : "bg-white border-2 border-gray-300 text-gray-800"
                      }`}
                  >
                    <option value="Masuk">Transaksi Masuk (Pembelian)</option>
                    <option value="Keluar">Transaksi Keluar (Penjualan)</option>
                  </select>
                </div>

                {/* Nama Barang */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Nama Barang
                  </label>
                  <input
                    type="text"
                    value={formData.barang}
                    onChange={(e) => setFormData({ ...formData, barang: e.target.value })}
                    className={`w-full rounded-lg px-4 py-2 transition-all ${isDark
                      ? "bg-gray-700 border border-gray-600 text-gray-100"
                      : "bg-white border-2 border-gray-300 text-gray-800"
                      }`}
                    placeholder="Contoh: Kemeja Batik"
                  />
                </div>

                {/* Jumlah & Harga */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      Jumlah
                    </label>
                    <input
                      type="number"
                      value={formData.jumlah}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, jumlah: value === "" ? "" : parseInt(value) });
                      }}
                      className={`w-full rounded-lg px-4 py-2 transition-all ${isDark
                        ? "bg-gray-700 border border-gray-600 text-gray-100"
                        : "bg-white border-2 border-gray-300 text-gray-800"
                        }`}
                      placeholder="0"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      Harga Satuan
                    </label>
                    <input
                      type="number"
                      value={formData.harga}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, harga: value === "" ? "" : parseInt(value) });
                      }}
                      className={`w-full rounded-lg px-4 py-2 transition-all ${isDark
                        ? "bg-gray-700 border border-gray-600 text-gray-100"
                        : "bg-white border-2 border-gray-300 text-gray-800"
                        }`}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Total */}
                {formData.jumlah && formData.harga && (
                  <div className={`rounded-lg p-3 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                    <p className="text-sm opacity-70">Total Transaksi:</p>
                    <p className="text-xl font-bold">
                      {formatRupiah(formData.jumlah * formData.harga)}
                    </p>
                  </div>
                )}

                {/* Keterangan */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Keterangan (Opsional)
                  </label>
                  <textarea
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    className={`w-full rounded-lg px-4 py-2 transition-all ${isDark
                      ? "bg-gray-700 border border-gray-600 text-gray-100"
                      : "bg-white border-2 border-gray-300 text-gray-800"
                      }`}
                    placeholder="Catatan transaksi..."
                    rows="3"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    // onClick={handleSubmit}
                    className={`
                      flex-1 py-2 rounded-lg font-semibold transition-all
                      ${isDark
                        ? "bg-white text-black hover:bg-gray-900 hover:text-white"
                        : "bg-gray-900 text-white hover:bg-black"
                      }
                    `}
                  >
                    Simpan
                  </button>

                  <button
                    onClick={() => setShowModal(false)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-300 text-gray-800 hover:bg-gray-400"}`}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Dialog
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
        >
          <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
          <DialogContent className="sm:max-w-[520px]" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Detail Transaksi</DialogTitle>
              <DialogDescription>
                Rincian pembelian {selected?.id_transaction}
              </DialogDescription>
            </DialogHeader>

            <DialogClose asChild>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 shadow-none"
              >
                <XIcon />
              </Button>
            </DialogClose>

            {selected && (
              <div className="space-y-3">
                {selected.items?.map((item) => (
                  <div key={item.id_trx_item} className="flex justify-between text-sm">
                    <span>
                      {item.product?.name} x {item.amount}
                    </span>
                    <span>
                      Rp {item.price?.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}

                <div className="border-t pt-2 text-sm font-semibold flex justify-between">
                  <span>Total</span>
                  <span>Rp {selected.total_price?.toLocaleString("id-ID")}</span>
                </div>

                <DialogFooter>
                  <div className="flex justify-between mt-4 sticky bottom-0 bg-background py-2 border-t">
                    <Button variant="outline" onClick={() => setSelected(null)}>
                      Tutup
                    </Button>
                  </div>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Pagination khusus mobile */}
        {filteredTransaksi.length > itemsPerPage && (
          <div className="md:hidden flex flex-col items-center mt-6 pb-6">

            {/* paginate btn div */}
            <div className="flex items-center gap-3">

              {/* preview */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full transition-all ${currentPage === 1
                  ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-800 text-white'
                  }`}
              >
                <ChevronLeft size={18} />
              </button>

              {/* page sekarang */}
              <span className={`${isDark ? 'text-white' : 'text-gray-800'} font-semibold`}>
                {currentPage} / {totalPages}
              </span>

              {/* button Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full transition-all ${currentPage === totalPages
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
