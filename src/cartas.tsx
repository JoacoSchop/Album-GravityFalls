import Cartas from "./componentes/figuritas.tsx";
import Header from "./componentes/header";
import type { Personaje } from "./App.tsx";

type CartasProps = { personajes: Personaje[] };

export default function CartasPage({ personajes }: CartasProps) {

  return (
    <main className="min-w-screen min-h-screen bg-amber-700 p-10 px-20">
      <Header />
      <section className="bg-white rounded-2xl mt-15 w-full min-h-90 p-10 grid grid-cols-4 gap-10">
        {personajes.map((personaje) => (
            <Cartas
              key={personaje._id}
              nombre={personaje.name}
              imagen={personaje.imageUrl}
            >
              <span className="absolute left-2 top-2 rounded bg-amber-950 px-2 py-1 font-mono text-sm font-bold text-amber-50">
                {String(personaje.numeroAlbum).padStart(3, "0")}
              </span>
            </Cartas>
          ))}
      </section>
    </main>
  );
}
