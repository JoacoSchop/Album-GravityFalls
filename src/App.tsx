import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cartas from "./cartas.tsx";
import Home from "./home.tsx";
import Paquetes from "./paquetes.tsx";
import Inventario from "./inventario.tsx";
import Ruleta from "./ruleta.tsx";

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
  const [inventario, setInventario] = useState<Carta[]>(() => {
    try {
      const guardado = localStorage.getItem("inventario");
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });
  const [ultimaApertura, setUltimaApertura] = useState<number | null>(() => {
    try {
      const guardado = localStorage.getItem("ultimaApertura");
      return guardado ? Number(guardado) : null;
    } catch {
      return null;
    }
  });

  const [ultimaTirada, setUltimaTirada] = useState<number | null>(() => {
    try {
      const guardado = localStorage.getItem("ultimaTirada");
      return guardado ? Number(guardado) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (ultimaTirada !== null) {
        localStorage.setItem("ultimaTirada", String(ultimaTirada));
      }
    } catch (err) {
      console.error("No se pudo guardar la última tirada:", err);
    }
  }, [ultimaTirada]);

  useEffect(() => {
    try {
      if (ultimaApertura !== null) {
        localStorage.setItem("ultimaApertura", String(ultimaApertura));
      }
    } catch (err) {
      console.error("No se pudo guardar la última apertura:", err);
    }
  }, [ultimaApertura]);

  useEffect(() => {
    try {
      localStorage.setItem("inventario", JSON.stringify(inventario));
    } catch (err) {
      console.error("No se pudo guardar el inventario:", err);
    }
  }, [inventario]);

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
  }

  function abrirPaquete(nuevas: Carta[]) {
    agregarCartas(nuevas);
    setUltimaApertura(Date.now());
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cartas" element={<Cartas personajes={personajes} />} />
        <Route
          path="/paquetes"
          element={
            <Paquetes
              personajes={personajes}
              ultimaApertura={ultimaApertura}
              onAbrir={abrirPaquete}
            />
          }
        />
        <Route
          path="/paquetes/ruleta"
          element={
            <Ruleta
              personajes={personajes}
              ultimaTirada={ultimaTirada}
              onTirar={() => setUltimaTirada(Date.now())}
              onGanar={agregarCartas}
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
