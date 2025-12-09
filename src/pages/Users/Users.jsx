import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  EllipsisVertical,
} from "lucide-react";
import { apiDelete, apiGet, apiPost } from "../../lib/api.js";
import { GET_USERS } from "../../constants/api/user.js";
import { useSearchParams } from "react-router-dom";
import LoadingPage from "../Loading/loading.jsx";
import { Popover } from "../../components/ui/popover.jsx";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { ValidateUser } from "./ValidateUser.js";
import ObjectReducer from "../../reducer/ObjectReducer.js";

export default function Users() {
  const { darkMode } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, dispatchErrors] = useReducer(ObjectReducer, {});
  const [popup, showPopup] = useState(false);
  const [popupAction, setPopupAction] = useState(() => { });
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupYes, setPopupYes] = useState(null);
  const [popupStyle, setPopupStyle] = useState(null);
  const formRef = useRef(null);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1,
  );
  const limit = parseInt(searchParams.get("limit")) || 5;
  const [showModal, setShowModal] = useState(false);
  const [showResetPw, setShowResetPw] = useState(false);
  const [resetId, setResetId] = useState(false);

  const columns = [
    { name: "Name", className: "text-left" },
    { name: "Role", className: "text-left" },
    { name: "Email", className: "text-left" },
    { name: "Kontak", className: "text-left" },
    { name: "Alamat", className: "text-left" },
    { name: "Aksi" },
  ];

  const fetchData = useCallback(() => {
    setLoading(true);

    let debounceTimer = setTimeout(
      async () => {
        try {
          setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set("search", search.trim());
            return newParams;
          });

          const result = await apiGet(GET_USERS, {
            page: currentPage,
            limit,
            search: search.trim(),
          });
          setData(result.data.result);
        } catch (err) {
          dispatchErrors({
            type: "patch",
            data: {
              table: "Failed to fetch data",
            },
          });
        } finally {
          setLoading(false);
        }
      },
      search ? 500 : 0,
    );

    return () => clearTimeout(debounceTimer);
  }, [search, setSearchParams, currentPage, limit]);

  useEffect(() => {
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("search", search.trim());
        return newParams;
      });
    }, 500);

    return () => clearTimeout(debounceTimer);
  });

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > data.total_page || newPage === data.page)
      return;

    setCurrentPage(newPage);

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());
      return newParams;
    });
  };

  useEffect(() => {
    if (showModal) formRef.current.reset();
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {};
    for (let [key, value] of formData.entries()) payload[key] = value;
    try {
      ValidateUser.validateSync(payload, { abortEarly: false });
      const result = await apiPost("/users", payload);
      if (result.error)
        return dispatchErrors({
          type: "patch",
          data: { [result.data.detail[0]]: result.data.message },
        });
      fetchData();
      setShowModal(false);
    } catch (err) {
      if (err.inner?.length > 0) {
        const fieldErrors = {};
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
        dispatchErrors({ type: "put", data: fieldErrors });
      } else {
        dispatchErrors({ type: "put", data: { form: err.message } });
      }
    }
  };

  const handleDelete = (id) => {
    setPopupAction(() => async () => {
      const res = await apiDelete(`/users/${id}`);
      if (res.error) {
        setPopupTitle("Gagal menghapus pengguna");
        setPopupMessage(res.data.message);
        setPopupYes("Coba lagi");
      }
      fetchData();
    });
    setPopupTitle("Hapus Pengguna");
    setPopupMessage("Yakin ingin menghapus user ini?");
    setPopupYes("Ya, hapus");
    setPopupStyle("warning");
    showPopup(true);
  };

  const handleTambahUser = () => {
    setShowModal(true);
    dispatchErrors({ type: "put", data: {} });
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-background">
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            className={`px-8 py-6 rounded-xl shadow-xl text-center max-w-sm
              ${darkMode ? "bg-card text-card-foreground" : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"}`}
          >
            <h2 className="text-xl font-semibold mb-2">{popupTitle}</h2>
            <p>{popupMessage || "Harap login untuk melanjutkan."}</p>
            <div className="flex flex-row gap-3 [&>*]:flex-1">
              <button
                onClick={() => {
                  showPopup(false);
                  window.history.replaceState({}, "");
                }}
                className={`mt-4 px-4 py-2 rounded-lg ${darkMode ? "bg-secondary hover:bg-secondary/80 text-secondary-foreground" : "bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-100"}`}
              >
                Batal
              </button>
              <button
                onClick={() => {
                  popupAction();
                  showPopup(false);
                }}
                className={`mt-4 px-4 font-bold py-2 text-white rounded-lg ${popupStyle == "warning" ? "bg-red-500" : "bg-green-600"}`}
              >
                {popupYes || "Oke"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={() => {
          setShowModal(true);
        }}
        className={`sm:hidden fixed bottom-5 right-5 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all ${darkMode ? "bg-card text-card-foreground hover:bg-accent" : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600"}`}
      >
        <Plus size={28} />
      </button>
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? "text-white" : "bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent"}`}>
            Manajemen User
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-muted-foreground" : "text-gray-400 dark:text-gray-500"}`}
              size={20}
            />
            <input
              type="text"
              placeholder="Cari user atau email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full ${darkMode ? "bg-card border-input text-card-foreground placeholder:text-muted-foreground focus:border-primary" : "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-800 dark:focus:border-gray-500"} rounded-lg pl-12 pr-4 py-2 md:py-3 transition-all`}
            />
          </div>
          
          <button
            onClick={fetchData}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg ${darkMode ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white"}`}
          >
            <RefreshCw size={20} />
          </button>

          <button
            onClick={handleTambahUser}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg ${darkMode ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white"}`}
          >
            <Plus size={20} />
            Tambah User
          </button>
        </div>

        <div className={`${darkMode ? "bg-card" : "bg-white dark:bg-gray-800"} rounded-xl border-2 ${darkMode ? "border-border" : "border-gray-300 dark:border-gray-600"} overflow-hidden shadow-lg`}>
          <div className="overflow-x-auto">
            {loading ? (
              <LoadingPage full />
            ) : errors.table ? (
              <div className={`w-full h-full p-20 flex items-center justify-center ${darkMode ? "text-card-foreground" : "text-gray-800 dark:text-gray-100"}`}>
                {errors.table}
              </div>
            ) : (
              <table className="w-full">
                <thead className={`${darkMode ? "bg-muted" : "bg-gradient-to-r from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 text-white"}`}>
                  <tr>
                    {columns.map((column) => {
                      return (
                        <th
                          key={column.name}
                          className={`px-6 py-4 text-sm font-semibold ${column.className} ${darkMode ? "text-muted-foreground" : "text-white"}`}
                        >
                          {column.name}
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className={`${darkMode ? "divide-border" : "divide-gray-200 dark:divide-gray-700"} divide-y`}>
                  {data.data && data.data.map((user) => {
                    return (
                      <tr
                        key={user.id_user}
                        className={`${darkMode ? "bg-card hover:bg-accent/50 text-card-foreground" : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-100"} transition-colors`}
                      >
                        <td className="px-6 py-4">
                          <div className={`font-medium ${darkMode ? "text-card-foreground" : "text-gray-800 dark:text-gray-100"}`}>
                            {user.name}
                          </div>
                          <div className={`text-sm ${darkMode ? "text-muted-foreground" : "text-gray-500 dark:text-gray-400"}`}>
                            {user.username}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-sky-200 dark:bg-sky-900/30 text-sky-800 dark:text-sky-400"
                              }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        {["email", "contact", "address"].map((field) => (
                          <td className={`px-6 py-4 ${darkMode ? "text-card-foreground" : "text-gray-800 dark:text-gray-100"}`} key={field}>
                            {user[field] || "Tidak ada"}
                          </td>
                        ))}

                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className={`rounded-md p-1 ${darkMode ? "hover:bg-accent text-card-foreground" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                                  <EllipsisVertical />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-40 p-2">
                                <div className={`flex flex-col space-y-1 ${darkMode ? "bg-card border-border text-card-foreground" : "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"} shadow-xl border rounded-md p-2`}>
                                  <button
                                    className={`px-3 py-2 text-red-500 rounded-md ${darkMode ? "hover:bg-accent" : "hover:bg-gray-100 dark:hover:bg-gray-700"} text-sm text-left w-full`}
                                    onClick={() => handleDelete(user.id_user)}
                                  >
                                    Hapus
                                  </button>
                                  <button
                                    className={`px-3 py-2 rounded-md ${darkMode ? "hover:bg-accent text-card-foreground" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"} text-sm text-left w-full`}
                                  >
                                    Reset password
                                  </button>
                                </div>
                              </PopoverContent>
                            </Popover>
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
          <div className={`mt-6 flex items-center justify-between ${darkMode ? "bg-card border-border text-card-foreground" : "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"} rounded-xl border p-4`}>
            <div className={`text-sm ${darkMode ? "text-muted-foreground" : "text-gray-600 dark:text-gray-400"}`}>
              Menampilkan {data.limit * (data.page - 1) + 1} -{" "}
              {data.limit * data.page} dari {data.count} user
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(data.page - 1)}
                disabled={data.page === 1}
                className={`p-2 rounded-lg transition-all ${data.page === 1
                    ? `${darkMode ? "bg-muted text-muted-foreground" : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600"} cursor-not-allowed`
                    : `${darkMode ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-gray-800 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white"}`
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
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${data.page === pageNumber
                          ? `${darkMode ? "bg-primary text-primary-foreground" : "bg-gray-900 dark:bg-gray-700 text-white"}`
                          : `${darkMode ? "bg-muted text-muted-foreground hover:bg-accent" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`
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
                className={`p-2 rounded-lg transition-all ${data.page === data.total_page
                    ? `${darkMode ? "bg-muted text-muted-foreground" : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600"} cursor-not-allowed`
                    : `${darkMode ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-gray-800 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white"}`
                  }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {showResetPw && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ">
            <div className={`${darkMode ? "bg-card border-border text-card-foreground" : "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"} rounded-xl border p-6 w-full max-w-md shadow-2xl max-h-[80vh]`}>
              <h2 className="text-2xl font-bold mb-6">
                Reset Password
              </h2>

              <form
                ref={null}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4"
              >
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-card-foreground" : "text-gray-700 dark:text-gray-300"} mb-2`}>
                    Password*
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`w-full ${darkMode ? "bg-card border-input text-card-foreground placeholder:text-muted-foreground" : "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"} rounded-lg px-4 py-2 focus:outline-none ${darkMode ? "focus:border-primary" : "focus:border-gray-800 dark:focus:border-gray-500"}`}
                    placeholder="Password"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-card-foreground" : "text-gray-700 dark:text-gray-300"} mb-2`}>
                    Konfirmasi Password*
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    className={`w-full ${darkMode ? "bg-card border-input text-card-foreground placeholder:text-muted-foreground" : "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"} rounded-lg px-4 py-2 focus:outline-none ${darkMode ? "focus:border-primary" : "focus:border-gray-800 dark:focus:border-gray-500"}`}
                    placeholder="Password"
                  />
                  {errors.confirm_password && (
                    <p className="text-xs text-red-500">
                      {errors.confirm_password}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className={`flex-1 ${darkMode ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white"} py-2 rounded-lg font-semibold transition-all`}
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`flex-1 ${darkMode ? "bg-secondary hover:bg-secondary/80 text-secondary-foreground" : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"} py-2 rounded-lg font-semibold transition-all`}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? "bg-card border-border text-card-foreground" : "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"} rounded-xl border p-6 w-full max-w-md shadow-2xl max-h-[80vh] overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']`}>
              <h2 className="text-2xl font-bold mb-6">
                Tambah Pengguna Baru
              </h2>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4"
              >
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-card-foreground" : "text-gray-700 dark:text-gray-300"} mb-2`}>
                    Username*
                  </label>
                  <input
                    type="text"
                    name="username"
                    className={`w-full ${darkMode ? "bg-card border-input text-card-foreground placeholder:text-muted-foreground" : "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"} rounded-lg px-4 py-2 focus:outline-none ${darkMode ? "focus:border-primary" : "focus:border-gray-800 dark:focus:border-gray-500"}`}
                    placeholder="johndoe"
                  />
                  {errors.username && (
                    <p className="text-xs text-red-500">{errors.username}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-card-foreground" : "text-gray-700 dark:text-gray-300"} mb-2`}>
                    Nama Pengguna*
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`w-full ${darkMode ? "bg-card border-input text-card-foreground placeholder:text-muted-foreground" : "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"} rounded-lg px-4 py-2 focus:outline-none ${darkMode ? "focus:border-primary" : "focus:border-gray-800 dark:focus:border-gray-500"}`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-card-foreground" : "text-gray-700 dark:text-gray-300"} mb-2`}>
                    Role*
                  </label>
                  <select
                    name="role"
                    className={`w-full ${darkMode ? "bg-card border-input text-card-foreground" : "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"} rounded-lg px-4 py-2 focus:outline-none ${darkMode ? "focus:border-primary" : "focus:border-gray-800 dark:focus:border-gray-500"}`}
                    placeholder="0"
                    min="0"
                  >
                    <option value="user">Karyawan</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && (
                    <p className="text-xs text-red-500">{errors.role}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-card-foreground" : "text-gray-700 dark:text-gray-300"} mb-2`}>
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`w-full ${darkMode ? "bg-card border-input text-card-foreground placeholder:text-muted-foreground" : "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"} rounded-lg px-4 py-2 focus:outline-none ${darkMode ? "focus:border-primary" : "focus:border-gray-800 dark:focus:border-gray-500"}`}
                    placeholder="johndoe@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-card-foreground" : "text-gray-700 dark:text-gray-300"} mb-2`}>
                    Password*
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`w-full ${darkMode ? "bg-card border-input text-card-foreground placeholder:text-muted-foreground" : "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"} rounded-lg px-4 py-2 focus:outline-none ${darkMode ? "focus:border-primary" : "focus:border-gray-800 dark:focus:border-gray-500"}`}
                    placeholder="Password"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-card-foreground" : "text-gray-700 dark:text-gray-300"} mb-2`}>
                    Konfirmasi Password*
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    className={`w-full ${darkMode ? "bg-card border-input text-card-foreground placeholder:text-muted-foreground" : "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"} rounded-lg px-4 py-2 focus:outline-none ${darkMode ? "focus:border-primary" : "focus:border-gray-800 dark:focus:border-gray-500"}`}
                    placeholder="Password"
                  />
                  {errors.confirm_password && (
                    <p className="text-xs text-red-500">
                      {errors.confirm_password}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-card-foreground" : "text-gray-700 dark:text-gray-300"} mb-2`}>
                    No. Telepon/Kontak
                  </label>
                  <input
                    type="string"
                    name="contact"
                    className={`w-full ${darkMode ? "bg-card border-input text-card-foreground placeholder:text-muted-foreground" : "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"} rounded-lg px-4 py-2 focus:outline-none ${darkMode ? "focus:border-primary" : "focus:border-gray-800 dark:focus:border-gray-500"}`}
                    placeholder="6281234567890"
                  />
                  {errors.contact && (
                    <p className="text-xs text-red-500">{errors.contact}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-card-foreground" : "text-gray-700 dark:text-gray-300"} mb-2`}>
                    Alamat
                  </label>
                  <textarea
                    name="address"
                    className={`w-full ${darkMode ? "bg-card border-input text-card-foreground placeholder:text-muted-foreground" : "bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"} rounded-lg px-4 py-2 focus:outline-none ${darkMode ? "focus:border-primary" : "focus:border-gray-800 dark:focus:border-gray-500"}`}
                    placeholder="Jl. Apel No. 9"
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500">{errors.address}</p>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className={`flex-1 ${darkMode ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white"} py-2 rounded-lg font-semibold transition-all`}
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`flex-1 ${darkMode ? "bg-secondary hover:bg-secondary/80 text-secondary-foreground" : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100"} py-2 rounded-lg font-semibold transition-all`}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}