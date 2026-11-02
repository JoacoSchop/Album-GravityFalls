import { useState } from "react";
import Cartas from "./componentes/figuritas.tsx";
import Header from "./componentes/header";
import Contenedor from "./componentes/contenedor.tsx";
import type { Carta, Personaje } from "./App.tsx";

type PaquetesProps = {
  personajes: Personaje[];
  paquetes: number;
  onAbrir: (cartas: Carta[]) => void;
};

const CARTAS_POR_PAQUETE = 5;

export default function Paquetes({ personajes, paquetes, onAbrir }: PaquetesProps) {
  const [ultimas, setUltimas] = useState<Carta[]>([]);

  function abrirPaquete() {
    const nuevas = Array.from({ length: CARTAS_POR_PAQUETE }, () => {
      const personaje = personajes[Math.floor(Math.random() * personajes.length)];
      return {
        id: crypto.randomUUID(),
        personajeId: personaje._id,
        nombre: personaje.name,
        imagen: personaje.imageUrl,
      };
    });
    setUltimas(nuevas);
    onAbrir(nuevas);
  }

  const sinPaquetes = paquetes === 0;

  return (
    <main className="min-w-screen min-h-screen bg-amber-700 p-10 px-20">
      <Header />
      <Contenedor titulo="Paquetes">
        <div className="flex items-center gap-6 mb-8">
          <p className="text-xl font-bold">
            Paquetes disponibles: {paquetes}
          </p>
          <button
            onClick={abrirPaquete}
            disabled={sinPaquetes || personajes.length === 0}
            className="bg-amber-900 text-amber-100 font-bold text-xl px-6 py-2 rounded-full cursor-pointer hover:bg-amber-800 active:bg-amber-950 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Abrir paquete
          </button>
        </div>

        {personajes.length === 0 && <p>Cargando personajes</p>}

        {sinPaquetes && (
          <p className="text-red-600 font-bold mb-6">
            No te quedan paquetes para abrir
          </p>
        )}

        {ultimas.length > 0 && (
          <>
            <h3 className="text-2xl font-bold mb-4">Te tocaron:</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {ultimas.map((carta) => (
                <Cartas key={carta.id} nombre={carta.nombre} imagen={carta.imagen} />
              ))}
            </div>
          </>
        )}
      </Contenedor>
    </main>
  );
}
