import { useState } from "react";
import { Link } from "react-router-dom";
import type { Carta, EstadoCatalogo, Personaje } from "./App.tsx";
import Contenedor from "./componentes/contenedor.tsx";
import EspacioFigurita from "./componentes/espacio-figurita.tsx";
import Header from "./componentes/header";

type HomeProps = {
  personajes: Personaje[];
  inventario: Carta[];
  estadoCatalogo: EstadoCatalogo;
};

const FIGURITAS_POR_PAGINA = 8;
const claseBotonPagina =
  "min-h-11 rounded-full bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-200 sm:px-6 sm:text-base";

export default function Home({ personajes, inventario, estadoCatalogo }: HomeProps) {
  const [pagina, setPagina] = useState(0);
  const obtenidas = new Set(inventario.map((carta) => carta.personajeId));
  const total = personajes.length;
  const cantidadObtenidas = personajes.filter((personaje) => obtenidas.has(personaje._id)).length;
  const porcentaje = total > 0 ? Math.floor((cantidadObtenidas / total) * 100) : 0;
  const totalPaginas = Math.ceil(total / FIGURITAS_POR_PAGINA);
  const inicio = pagina * FIGURITAS_POR_PAGINA;
  const figuritasDePagina = personajes.slice(inicio, inicio + FIGURITAS_POR_PAGINA);

  return (
    <main className="min-h-screen bg-amber-700 px-3 py-10 sm:px-10 lg:px-20">
      <Header />
      <Contenedor titulo="Álbum de figuritas">
        <div className="mb-6 flex flex-wrap items-center gap-4 sm:justify-between">
          {total > 0 && (
            <div className="w-full max-w-sm">
              <div className="mb-2 flex items-center justify-between gap-2 font-bold">
                <label htmlFor="progreso-album">{cantidadObtenidas} de {total} figuritas</label>
                <span>{porcentaje}%</span>
              </div>
              <progress
                id="progreso-album"
                value={cantidadObtenidas}
                max={total}
                className="block h-3 w-full appearance-none overflow-hidden rounded-full bg-gray-200 [&::-moz-progress-bar]:bg-amber-900 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-amber-900"
              />
            </div>
          )}
          <Link
            to="/paquetes"
            className="inline-flex min-h-11 items-center rounded-full bg-amber-900 px-4 py-2 text-center font-bold text-amber-100 hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900 sm:px-6"
          >
            Conseguir figuritas
          </Link>
        </div>

        {total > 0 ? (
          <>
            <nav aria-label="Páginas del álbum" className="mb-6 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPagina(pagina - 1)}
                disabled={pagina === 0}
                className={claseBotonPagina}
              >
                Anterior
              </button>
              <p aria-live="polite" className="-order-1 w-full text-sm font-semibold sm:order-none sm:w-auto sm:text-base">
                Página {pagina + 1} de {totalPaginas}
              </p>
              <button
                type="button"
                onClick={() => setPagina(pagina + 1)}
                disabled={pagina === totalPaginas - 1}
                className={claseBotonPagina}
              >
                Siguiente
              </button>
            </nav>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
              {figuritasDePagina.map((personaje) => (
                <EspacioFigurita
                  key={personaje._id}
                  personaje={personaje}
                  conseguida={obtenidas.has(personaje._id)}
                />
              ))}
            </ul>
          </>
        ) : (
          <p role="status">
            {estadoCatalogo === "cargando" && "Cargando el álbum…"}
            {estadoCatalogo === "error" && "No se pudo cargar el álbum. Recargá la página para volver a intentar."}
            {estadoCatalogo === "listo" && "El catálogo todavía no tiene figuritas."}
          </p>
        )}
      </Contenedor>
    </main>
  );
}
