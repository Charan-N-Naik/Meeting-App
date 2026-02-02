import LandingPage from "./pages/landing";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Authonthication from "./pages/Authontication"
import { AuthProvider } from "./contexts/AuthComnntext";
import Video from "./pages/videoMeet"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authonthication></Authonthication>}/>
          <Route path="/meet/:roomId" element={<Video />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
