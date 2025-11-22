import { useEffect } from "react";
import AppRoutes from "@/routes";

function App() {

  // Temporary test API call
  
  // fetch(`${import.meta.env.VITE_BASE_URL_API_DOMAIN}/auth/login`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     email: "admin-umkm@yopmail.com",
  //     password: "test",
  //   }),
  // })
  //   .then(res => res.json())
  //   .then(data => console.log("API OK:", data))
  //   .catch(err => console.error("Error:", err));

  // Jangan buka komentarnya kalo ga mau dipake

  return <AppRoutes />;
}

export default App;
