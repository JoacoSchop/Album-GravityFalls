import { useState } from "react";
import Cartas from "./componentes/figuritas.tsx";
import Header from "./componentes/header";
import Contenedor from "./componentes/contenedor.tsx";
import type { Carta } from "./App.tsx";

type InventarioProps = {
  inventario: Carta[];
};

type Filtro = "todas" | "repetidas";

export default function Inventario({ inventario }: InventarioProps) {
  const [filtro, setFiltro] = useState<Filtro>("todas");

  // Una entrada por personaje, con cuántas copias tiene el jugador
  const grupos = inventario
    .filter(
      (carta, i) =>
        inventario.findIndex((otra) => otra.personajeId === carta.personajeId) === i
    )
    .map((carta) => ({
      carta,
      cantidad: inventario.filter((otra) => otra.personajeId === carta.personajeId).length,
    }))
    .sort((a, b) => b.cantidad - a.cantidad);

  const visibles =
    filtro === "repetidas" ? grupos.filter((grupo) => grupo.cantidad > 1) : grupos;

  const claseBoton = (activo: boolean) =>
    `p-1 px-4 text-xl rounded-full cursor-pointer ${
      activo ? "bg-amber-900 text-amber-100" : "bg-gray-200 hover:bg-gray-300"
    }`;

  return (
    <main className="min-w-screen min-h-screen bg-amber-700 p-10 px-20">
      <Header />
      <Contenedor titulo="Inventario">
        {inventario.length === 0 ? (
          <p className="text-xl">Todavía no tenés cartas</p>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-8">
              <p className="text-xl font-bold mr-4">
                {inventario.length} cartas · {grupos.length} distintas
              </p>
              <button onClick={() => setFiltro("todas")} className={claseBoton(filtro === "todas")}>
                Todas
              </button>
              <button
                onClick={() => setFiltro("repetidas")}
                className={claseBoton(filtro === "repetidas")}
              >
                Repetidas
              </button>
            </div>

            {visibles.length === 0 ? (
              <p className="text-xl">No tenés cartas repetidas</p>
            ) : (
              <div className="grid grid-cols-4 gap-10">
                {visibles.map(({ carta, cantidad }) => (
                  <Cartas key={carta.personajeId} nombre={carta.nombre} imagen={carta.imagen}>
                    {cantidad > 1 && (
                      <span className="absolute -top-3.5 -right-3.5 bg-amber-900 text-amber-100 font-bold rounded-full px-3 py-1">
                        {cantidad}
                      </span>
                    )}
                  </Cartas>
                ))}
              </div>
            )}
          </>
        )}
      </Contenedor>
    </main>
  );
}
