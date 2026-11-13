import type { Personaje } from "../App.tsx";
import Cartas from "./figuritas.tsx";

type EspacioFiguritaProps = {
  personaje: Personaje;
  conseguida: boolean;
};

export default function EspacioFigurita({ personaje, conseguida }: EspacioFiguritaProps) {
  const numero = String(personaje.numeroAlbum).padStart(3, "0");

  return (
    <li className="flex min-w-0 items-start justify-center">
      {conseguida ? (
        <Cartas nombre={personaje.name} imagen={personaje.imageUrl}>
          <span className="absolute left-2 top-2 rounded bg-amber-950 px-2 py-1 font-mono text-sm font-bold text-amber-50">
            {numero}
          </span>
          <span className="sr-only">Conseguida</span>
        </Cartas>
      ) : (
        <div className="flex aspect-3/4 w-50 max-w-full flex-col rounded-2xl border-2 border-dashed border-gray-300 bg-gray-100 text-center">
          <span className="grid flex-1 place-items-center text-xl font-bold tabular-nums text-gray-600 sm:text-2xl">
            {numero}
          </span>
          <p className="break-words px-2 py-2 text-sm font-bold text-gray-700 sm:text-base">
            {personaje.name}
          </p>
          <span className="sr-only">Por conseguir</span>
        </div>
      )}
    </li>
  );
}
