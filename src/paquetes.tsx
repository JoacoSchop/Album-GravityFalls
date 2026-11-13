import { useState } from "react";
import { Link } from "react-router-dom";
import Cartas from "./componentes/figuritas.tsx";
import Header from "./componentes/header";
import Contenedor from "./componentes/contenedor.tsx";
import type { Carta, Personaje } from "./App.tsx";
import { formatearTiempo, generarPaquete, tiempoRestante, useAhora } from "./utils.ts";

type PaquetesProps = {
  personajes: Personaje[];
  ultimaApertura: number | null;
  onAbrir: (cartas: Carta[]) => void;
};

export default function Paquetes({ personajes, ultimaApertura, onAbrir }: PaquetesProps) {
  const [ultimas, setUltimas] = useState<Carta[]>([]);
  const ahora = useAhora();
  const restante = tiempoRestante(ultimaApertura, ahora);
  const disponible = restante === 0;

  function abrirPaquete() {
    if (!disponible || personajes.length === 0) return;
    const nuevas = generarPaquete(personajes);
    setUltimas(nuevas);
    onAbrir(nuevas);
  }

  return (
    <main className="min-w-screen min-h-screen bg-amber-700 p-10 px-20">
      <Header />
      <Contenedor titulo="Paquetes">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <p className="text-xl font-bold">
            {disponible ? "Tenés 1 paquete disponible" : `Próximo paquete en ${formatearTiempo(restante)}`}
          </p>
          <button
            onClick={abrirPaquete}
            disabled={!disponible || personajes.length === 0}
            className="bg-amber-900 text-amber-100 font-bold text-xl px-6 py-2 rounded-full cursor-pointer hover:bg-amber-800 active:bg-amber-950 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Abrir paquete
          </button>
          <Link
            to="/paquetes/ruleta"
            className="bg-gray-200 text-xl px-6 py-2 rounded-full hover:bg-gray-300"
          >
            Probar suerte en la ruleta
          </Link>
          <Link
            to="/paquetes/codigo"
            className="bg-amber-200 text-amber-950 text-xl px-6 py-2 rounded-full hover:bg-amber-300"
          >
            Descifrar un código
          </Link>
        </div>

        {personajes.length === 0 && <p>Cargando personajes</p>}

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
