import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cartas from "./cartas.tsx";
import Home from "./home.tsx";
import Inicio from "./inicio.tsx";
import Paquetes from "./paquetes.tsx";
import Inventario from "./inventario.tsx";

export type Personaje = {
  _id: number;
  name: string;
  imageUrl: string;
};

export type Carta = {
  id: string;
  personajeId: number;
  nombre: string;
  imagen: string;
};

function App() {
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [inventario, setInventario] = useState<Carta[]>([]);
  const [paquetes, setPaquetes] = useState(3);

  useEffect(() => {
    const URL =
      "https://api.disneyapi.dev/character?tvShows=Gravity%20Falls&page=1&pageSize=104";

    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        const lista: Personaje[] = data.data || [];
        setPersonajes(lista.filter((personaje) => personaje.imageUrl));
      })
      .catch((err) => console.error("Fallo al cargar personajes:", err));
  }, []);

  function agregarCartas(nuevas: Carta[]) {
    setInventario((actual) => [...actual, ...nuevas]);
    setPaquetes((actual) => actual - 1);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cartas" element={<Cartas />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route
          path="/paquetes"
          element={
            <Paquetes
              personajes={personajes}
              paquetes={paquetes}
              onAbrir={agregarCartas}
            />
          }
        />
        <Route
          path="/inventario"
          element={<Inventario inventario={inventario} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
