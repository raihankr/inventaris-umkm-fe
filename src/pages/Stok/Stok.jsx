import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Package, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    nama: '', kategori: '', stok: '', harga: '', satuan: '', minimal: ''
  });

  const getStatus = (stok, minimal) => {
    if (stok === 0) {
      return { label: 'Habis', color: 'bg-gray-900/20 text-gray-900 border-gray-900/30', icon: XCircle };
    } else if (stok <= minimal * 0.25) {
      return { label: 'Hampir Habis', color: 'bg-gray-800/20 text-gray-800 border-gray-800/30', icon: AlertCircle };
    } else if (stok <= minimal * 0.5) {
      return { label: 'Stok Menipis', color: 'bg-gray-600/20 text-gray-700 border-gray-600/30', icon: AlertTriangle };
    } else {
      return { label: 'Tersedia', color: 'bg-gray-300/50 text-gray-800 border-gray-400/30', icon: Package };
    }
  };

  const getStatsData = () => {
    const tersedia = stokBarang.filter(item => {
      const status = getStatus(item.stok, item.minimal);
      return status.label === 'Tersedia';
    }).length;

    const menipis = stokBarang.filter(item => {
      const status = getStatus(item.stok, item.minimal);
      return status.label === 'Stok Menipis';
    }).length;

    const hampirHabis = stokBarang.filter(item => {
      const status = getStatus(item.stok, item.minimal);
      return status.label === 'Hampir Habis';
    }).length;

    const habis = stokBarang.filter(item => {
      const status = getStatus(item.stok, item.minimal);
      return status.label === 'Habis';
    }).length;

    return { tersedia, menipis, hampirHabis, habis };
  };

  const stats = getStatsData();
  const totalNilai = stokBarang.reduce((acc, item) => acc + (item.stok * item.harga), 0);

  const filteredStok = stokBarang.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!formData.nama || !formData.kategori || formData.stok === '' || !formData.harga || !formData.satuan || !formData.minimal) {
      alert('Mohon lengkapi semua field');
      return;
    }
    
    if (editingId) {
      setStokBarang(stokBarang.map(item =>
        item.id === editingId ? { ...formData, id: editingId } : item
      ));
    } else {
      setStokBarang([...stokBarang, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingId(null);
    setFormData({ nama: '', kategori: '', stok: '', harga: '', satuan: '', minimal: '' });
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus barang ini?')) {
      setStokBarang(stokBarang.filter(item => item.id !== id));
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
            Manajemen Stok UMKM
          </h1>
          <p className="text-gray-600">Kelola inventaris produk UMKM Anda dengan mudah</p>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tersedia</p>
                <p className="text-3xl font-bold text-gray-800">{stats.tersedia}</p>
              </div>
              <Package className="text-gray-800" size={36} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border-2 border-gray-300 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Stok Menipis</p>
                <p className="text-3xl font-bold text-gray-700">{stats.menipis}</p>
              </div>
              <AlertTriangle className="text-gray-700" size={36} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border-2 border-gray-400 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Hampir Habis</p>
                <p className="text-3xl font-bold text-gray-800">{stats.hampirHabis}</p>
              </div>
              <AlertCircle className="text-gray-800" size={36} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border-2 border-gray-900 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Habis</p>
                <p className="text-3xl font-bold text-gray-900">{stats.habis}</p>
              </div>
              <XCircle className="text-gray-900" size={36} />
            </div>
          </div>
        </div>

      
        <div className="bg-gradient-to-r from-gray-800 to-black rounded-xl p-6 mb-6 text-white shadow-lg">
          <p className="text-gray-300 text-sm mb-1">Total Nilai Inventaris</p>
          <p className="text-3xl font-bold">{formatRupiah(totalNilai)}</p>
        </div>

       
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari barang atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-gray-300 rounded-lg pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-800 transition-all"
            />
          </div>
          <button
            onClick={() => {
              setShowModal(true);
              setEditingId(null);
              setFormData({ nama: '', kategori: '', stok: '', harga: '', satuan: '', minimal: '' });
            }}
            className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg"
          >
            <Plus size={20} />
            Tambah Barang
          </button>
        </div>

    
        <div className="bg-white rounded-xl border-2 border-gray-300 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nama Barang</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Kategori</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Stok</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Harga</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStok.map((item) => {
                  const status = getStatus(item.stok, item.minimal);
                  const StatusIcon = status.icon;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{item.nama}</div>
                        <div className="text-sm text-gray-500">{item.satuan}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-semibold text-gray-800">{item.stok}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-800">{formatRupiah(item.harga)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 ${status.color} border rounded-full text-sm font-medium inline-flex items-center gap-1`}>
                          <StatusIcon size={14} /> {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 bg-gray-800 hover:bg-black text-white rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
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
          </div>
        </div>

        
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl border-2 border-gray-300 p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingId ? 'Edit Barang' : 'Tambah Barang Baru'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Barang</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <input
                    type="text"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
                    <input
                      type="number"
                      value={formData.stok}
                      onChange={(e) => setFormData({ ...formData, stok: parseInt(e.target.value) || '' })}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Satuan</label>
                    <input
                      type="text"
                      value={formData.satuan}
                      onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Harga</label>
                  <input
                    type="number"
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: parseInt(e.target.value) || '' })}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stok Minimal</label>
                  <input
                    type="number"
                    value={formData.minimal}
                    onChange={(e) => setFormData({ ...formData, minimal: parseInt(e.target.value) || '' })}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-gray-800"
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