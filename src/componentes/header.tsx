import { NavLink, useNavigate } from "react-router-dom";

const claseLink =
  "inline-flex min-h-11 items-center rounded-full bg-gray-200 px-1.5 text-xs hover:bg-gray-300 active:bg-gray-400 sm:min-h-0 sm:px-4 sm:py-1 sm:text-xl";

export default function Header() {
  const navegar = useNavigate();

  return (
    <header className="w-90/100 fixed top-5 left-1/2 -translate-x-1/2 bg-gray-100/90 border-b shadow-lg border-zinc-500 z-10 backdrop-blur-md h-15 rounded-full flex justify-between items-center gap-2 px-2 sm:px-5 md:px-10">
      <NavLink
        to="/"
        className="flex min-h-11 shrink-0 items-center gap-2 rounded-full font-bold sm:text-xl md:text-2xl"
      >
        <img
          src="/mano.jpg"
          alt=""
          className="aspect-square h-8 sm:h-13"
        />
        <span className="sr-only sm:not-sr-only">Gravity Falls</span>
      </NavLink>
      <nav
        aria-label="Navegación principal"
        className="flex items-center gap-0.5 sm:gap-3"
      >
        <NavLink to={"/cartas"} className={claseLink}>
          Cartas
        </NavLink>
        <NavLink to={"/paquetes"} className={claseLink}>
          Paquetes
        </NavLink>
        <NavLink to={"/inventario"} className={claseLink}>
          Inventario
        </NavLink>
        <button
          type="button"
          onClick={() => navegar(-1)}
          className="ml-1 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-amber-900 hover:bg-amber-950 px-2 text-xs font-bold text-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900 sm:px-4 sm:text-base"
        >
          <span aria-hidden="true" className="hidden sm:inline">
            ←
          </span>
          Volver
        </button>
      </nav>
    </header>
  );
}
