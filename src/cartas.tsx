import { useState, useEffect } from "react";

export default function Cartas() {
  const [personajes, setPersonajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const URL =
      "https://api.disneyapi.dev/character?tvShows=Gravity%20Falls&page=1&pageSize=104";

    fetch(URL)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPersonajes(data.data || []);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Fallo al cargar personajes:", err);
        setError(err.message);
        setCargando(false);
      });
  }, []);

  return (
    <main className="min-w-screen min-h-screen bg-amber-700 p-10 px-20">
      <section className="bg-white rounded-2xl w-full min-h-90 p-10 grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-10 justify-items-center">
        {cargando ? (
          <p>Cargando personajes</p>
        ) : (
          personajes.map((personaje) => (
            <Cartas
              key={personaje._id}
              nombre={personaje.name}
              imagen={personaje.imageUrl}
            />
          ))
        )}
      </section>
      {error && (
        <p className="text-red-600 font-black bg-white rounded-full px-2 w-fit">
          Hubo un error cargando los personajes
        </p>
      )}
    </main>
  );
}
