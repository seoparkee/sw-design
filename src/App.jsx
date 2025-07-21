import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage/Login";
import Toto from "./pages/SecondPage/Toto"; // ✅ 변수명과 파일명 일치

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/toto" element={<Toto />} /> {/* ✅ URL도 깔끔하게 */}
      </Routes>
    </Router>
  );
}

export default App;
