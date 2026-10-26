import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cartas from "./cartas.tsx"; 
import Home from "./home.tsx";
import Inicio from "./inicio.tsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cartas" element={<Cartas />} />
        <Route path="/inicio" element={<Inicio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;