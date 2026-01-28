import LandingPage from "./pages/landing";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authonthication from "./pages/Authontication"
import { AuthProvider } from "./contexts/AuthComnntext";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authonthication></Authonthication>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
