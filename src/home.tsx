import { NavLink } from "react-router-dom";
export default function Home() {
  return (
    <>
      <main className="min-w-screen min-h-screen bg-amber-700 p-10 relative">
        <header className="w-90/100 absolute top-5 left-1/2 -translate-x-1/2 bg-white h-15 rounded-full flex justify-between items-center px-10">
          <div className="flex items-center justify-center gap-2">
            <img src={"mano.jpg"} alt="logo" className="aspect-square h-13" />
            <h1 className="font-bold text-2xl">Gravity Falls</h1>
          </div>
          <NavLink
            to={"/cartas"}
            className={
              "bg-gray-200 p-1 px-4 text-xl rounded-full cursor-pointer hover:bg-gray-300 active:bg-gray-400"
            }
          >
            Cartas
          </NavLink>
        </header>
      </main>
    </>
  );
}
