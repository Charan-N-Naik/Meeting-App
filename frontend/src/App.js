import LandingPage from "./pages/landing";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Authonthication from "./pages/Authontication"
import { AuthProvider } from "./contexts/AuthComnntext";
import Video from "./pages/videoMeet"
import Home from "./pages/Home";
import History from "./pages/histrory"
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authonthication></Authonthication>}/>
          <Route path="/:roomId" element={<Video />} />
          <Route path="/history" element={<History></History>}/>
          <Route path="/home" element={<Home></Home>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
