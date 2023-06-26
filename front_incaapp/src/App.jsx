import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserPage from "./pages/userPage";
import UserForm from "./pages/userForm";
import NavBar from "./components/NavBar";
import { UserContextProvider } from "./context/UserProvider";

function App() {
  return (
    <>
    <div className="bg-zinc-900 h-screen">
      <div className="container mx-auto px-20">
        <BrowserRouter>
    <NavBar />
          <UserContextProvider>
            <Routes>
              <Route path="/" element={<UserPage />} />
              <Route path="/new" element={<UserForm />} />
              <Route path="/edit/:id" element={<UserForm />} />
            </Routes>
          </UserContextProvider>
        </BrowserRouter>
      </div>
    </div>
    </>
  );
}

export default App;
