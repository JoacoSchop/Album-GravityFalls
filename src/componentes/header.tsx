import { NavLink } from "react-router-dom";

const claseLink =
  "bg-gray-200 p-1 px-4 text-xl rounded-full cursor-pointer hover:bg-gray-300 active:bg-gray-400";

export default function Header() {
    return (
         <header className="w-90/100 fixed top-5 left-1/2 -translate-x-1/2 bg-gray-100/90 border-b shadow-lg border-zinc-500 z-10 backdrop-blur-md h-15 rounded-full flex justify-between items-center px-10">
          <div className="flex items-center justify-center gap-2">
            <img src={"mano.jpg"} alt="logo" className="aspect-square h-13" />
            <NavLink to={"/"} className="font-bold text-2xl">Gravity Falls</NavLink>
          </div>
          <div className="flex items-center gap-3">
            <NavLink to={"/cartas"} className={claseLink}>
              Cartas
            </NavLink>
            <NavLink to={"/paquetes"} className={claseLink}>
              Paquetes
            </NavLink>
            <NavLink to={"/inventario"} className={claseLink}>
              Inventario
            </NavLink>
          </div>
        </header>
    );
}
