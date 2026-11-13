import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cartas from "./cartas.tsx";
import Home from "./home.tsx";
import Paquetes from "./paquetes.tsx";
import Inventario from "./inventario.tsx";
import Ruleta from "./ruleta.tsx";
import Codigo from "./codigo.tsx";

export type Personaje = {
  _id: number;
  name: string;
  imageUrl: string;
  numeroAlbum: number;
};

export type EstadoCatalogo = "cargando" | "listo" | "error";

export type Carta = {
  id: string;
  personajeId: number;
  nombre: string;
  imagen: string;
};

function App() {
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [estadoCatalogo, setEstadoCatalogo] = useState<EstadoCatalogo>("cargando");
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
    const solicitud = new AbortController();

    fetch(URL, { signal: solicitud.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Disney API: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const lista: Omit<Personaje, "numeroAlbum">[] = data.data || [];
        const conImagen = lista.filter((personaje) => personaje.imageUrl);
        const unicos = new Map(conImagen.map((personaje) => [personaje._id, personaje]));
        // El orden de la API puede variar. Numeramos a partir del ID de origen.
        const catalogo = [...unicos.values()]
          .sort((a, b) => a._id - b._id)
          .map((personaje, indice) => ({ ...personaje, numeroAlbum: indice + 1 }));

        if (solicitud.signal.aborted) return;
        setPersonajes(catalogo);
        setEstadoCatalogo("listo");
      })
      .catch((err) => {
        if (solicitud.signal.aborted) return;
        setEstadoCatalogo("error");
        console.error("Fallo al cargar personajes:", err);
      });

    return () => solicitud.abort();
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
        <Route
          path="/"
          element={
            <Home personajes={personajes} inventario={inventario} estadoCatalogo={estadoCatalogo} />
          }
        />
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
          path="/paquetes/codigo"
          element={
            <Codigo
              personajes={personajes}
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
