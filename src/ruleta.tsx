import { useState } from "react";
import Cartas from "./componentes/figuritas.tsx";
import Header from "./componentes/header";
import Contenedor from "./componentes/contenedor.tsx";
import type { Carta, Personaje } from "./App.tsx";
import { formatearTiempo, generarPaquete, tiempoRestante, useAhora } from "./utils.ts";

type RuletaProps = {
  personajes: Personaje[];
  ultimaTirada: number | null;
  onTirar: () => void;
  onGanar: (cartas: Carta[]) => void;
};

type Premio = "paquete" | "pregunta" | "nada";

type Pregunta = {
  texto: string;
  opciones: string[];
  correcta: number; 
};


const SECTORES: { premio: Premio; texto: string; color: string; colorTexto: string }[] = [
  { premio: "paquete", texto: "Paquete", color: "#78350f", colorTexto: "#fef3c7" },
  { premio: "nada", texto: "Nada", color: "#e5e7eb", colorTexto: "#374151" },
  { premio: "pregunta", texto: "Pregunta", color: "#f59e0b", colorTexto: "#451a03" },
  { premio: "nada", texto: "Nada", color: "#d1d5db", colorTexto: "#374151" },
  { premio: "pregunta", texto: "Pregunta", color: "#fbbf24", colorTexto: "#451a03" },
  { premio: "nada", texto: "Nada", color: "#e5e7eb", colorTexto: "#374151" },
];

const GRADOS_SECTOR = 360 / SECTORES.length;
const DURACION_GIRO_MS = 4000;

const PREGUNTAS: Pregunta[] = [
  {
    texto: "¿En qué estado de Estados Unidos queda Gravity Falls?",
    opciones: ["California", "Oregón", "Washington", "Colorado"],
    correcta: 1,
  },
  {
    texto: "¿Qué forma tiene Bill?",
    opciones: ["Círculo", "Cuadrado", "Triángulo", "Estrella"],
    correcta: 2,
  },
  {
    texto: "¿Cómo se llama el chancho de Mabel?",
    opciones: ["Gompers", "Pato", "Tito", "Bola"],
    correcta: 1,
  },
  {
    texto: "¿Cuál es el verdadero nombre de Dipper?",
    opciones: ["Mason", "Daniel", "Dylan", "Marcus"],
    correcta: 0,
  },
  {
    texto: "¿Cómo se llama el negocio del Tío Stan?",
    opciones: ["El Bosque Raro", "La Choza del Terror", "Museo de Rarezas", "La Cabaña del Misterio"],
    correcta: 3,
  },
  {
    texto: "¿Qué número tiene el diario que Dipper encuentra en el bosque?",
    opciones: ["1", "2", "3", "4"],
    correcta: 2,
  },
  {
    texto: "¿Cómo se llama el hermano gemelo del Tío Stan?",
    opciones: ["Ford", "Fiddleford", "Filbrick", "Fred"],
    correcta: 0,
  },
  {
    texto: "¿Quién es el empleado que arregla todo en la Cabaña?",
    opciones: ["Robbie", "Soos", "Toby", "Blubs"],
    correcta: 1,
  },
  {
    texto: "¿Cómo se llama la cabra que anda por la Cabaña del Misterio?",
    opciones: ["Pato", "Waddles", "Gompers", "Gideon"],
    correcta: 2,
  },
  {
    texto: "¿Cuántos años tienen Dipper y Mabel al empezar la serie?",
    opciones: ["10", "9", "12", "13"],
    correcta: 2,
  },
];

export default function Ruleta({ personajes, ultimaTirada, onTirar, onGanar }: RuletaProps) {
  const ahora = useAhora();
  const [rotacion, setRotacion] = useState(0);
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState<Premio | null>(null);
  const [pregunta, setPregunta] = useState<Pregunta | null>(null);
  const [respuesta, setRespuesta] = useState<number | null>(null);
  const [cartasGanadas, setCartasGanadas] = useState<Carta[]>([]);

  const restante = tiempoRestante(ultimaTirada, ahora);
  const puedeTirar = restante === 0 && !girando && personajes.length > 0;

  function ganarPaquete() {
    const nuevas = generarPaquete(personajes);
    setCartasGanadas(nuevas);
    onGanar(nuevas);
  }

  function tirar() {
    if (!puedeTirar) return;

    setResultado(null);
    setPregunta(null);
    setRespuesta(null);
    setCartasGanadas([]);
    setGirando(true);
    onTirar();

    // Elegimos el sector ganador y calculamos cuánto girar para que quede bajo la flecha
    const indice = Math.floor(Math.random() * SECTORES.length);
    const centro = indice * GRADOS_SECTOR + GRADOS_SECTOR / 2;
    const desvio = (Math.random() - 0.5) * GRADOS_SECTOR * 0.7; // para que no caiga siempre en el centro
    const destino = (360 - centro + desvio + 360) % 360;
    const actual = rotacion % 360;
    const extra = (destino - actual + 360) % 360;
    setRotacion(rotacion + 5 * 360 + extra);

    setTimeout(() => {
      const premio = SECTORES[indice].premio;
      setGirando(false);
      setResultado(premio);
      if (premio === "paquete") ganarPaquete();
      if (premio === "pregunta") {
        setPregunta(PREGUNTAS[Math.floor(Math.random() * PREGUNTAS.length)]);
      }
    }, DURACION_GIRO_MS);
  }

  function responder(opcion: number) {
    if (!pregunta || respuesta !== null) return;
    setRespuesta(opcion);
    if (opcion === pregunta.correcta) ganarPaquete();
  }

  return (
    <main className="min-w-screen min-h-screen bg-amber-700 p-10 px-20">
      <Header />
      <Contenedor titulo="Ruleta">
        <div className="flex flex-wrap items-start justify-center gap-16">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-80 h-80">
              <div
                className="absolute left-1/2 -top-4 -translate-x-1/2 z-10 w-0 h-0"
                style={{
                  borderLeft: "16px solid transparent",
                  borderRight: "16px solid transparent",
                  borderTop: "32px solid #451a03",
                }}
              />
              <div
                className="w-full h-full rounded-full border-8 border-amber-900 shadow-xl relative"
                style={{
                  background: `conic-gradient(${SECTORES.map(
                    (s, i) => `${s.color} ${i * GRADOS_SECTOR}deg ${(i + 1) * GRADOS_SECTOR}deg`
                  ).join(", ")})`,
                  transform: `rotate(${rotacion}deg)`,
                  transition: girando
                    ? `transform ${DURACION_GIRO_MS}ms cubic-bezier(0.15, 0.85, 0.25, 1)`
                    : "none",
                }}
              >
                {SECTORES.map((s, i) => (
                  <span
                    key={i}
                    className="absolute left-1/2 top-1/2 font-bold text-lg"
                    style={{
                      color: s.colorTexto,
                      transform: `translate(-50%, -50%) rotate(${
                        i * GRADOS_SECTOR + GRADOS_SECTOR / 2
                      }deg) translateY(-100px)`,
                      transition: "none",
                    }}
                  >
                    {s.texto}
                  </span>
                ))}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-900 border-4 border-amber-100" />
              </div>
            </div>

            <button
              onClick={tirar}
              disabled={!puedeTirar}
              className="bg-amber-900 text-amber-100 font-bold text-xl px-6 py-2 rounded-full cursor-pointer hover:bg-amber-800 active:bg-amber-950 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {girando ? "Girando..." : "Tirar ruleta"}
            </button>
            {!girando && restante > 0 && (
              <p className="text-lg font-bold">Podés volver a tirar en {formatearTiempo(restante)}</p>
            )}
            {personajes.length === 0 && <p>Cargando personajes</p>}
          </div>

          <div className="w-full max-w-xl">
            {resultado === "nada" && (
              <p className="text-2xl font-bold">No ganaste nada</p>
            )}

            {resultado === "pregunta" && pregunta && (
              <div>
                <h3 className="text-2xl font-bold mb-2">Respondé bien y ganás un paquete</h3>
                <p className="text-xl mb-4">{pregunta.texto}</p>
                <div className="grid grid-cols-2 gap-3">
                  {pregunta.opciones.map((opcion, i) => {
                    let color = "bg-gray-200 hover:bg-gray-300";
                    if (respuesta !== null) {
                      if (i === pregunta.correcta) color = "bg-green-500 text-white";
                      else if (i === respuesta) color = "bg-red-500 text-white";
                      else color = "bg-gray-200 opacity-60";
                    }
                    return (
                      <button
                        key={opcion}
                        onClick={() => responder(i)}
                        disabled={respuesta !== null}
                        className={`p-3 text-lg rounded-xl cursor-pointer disabled:cursor-default ${color}`}
                      >
                        {opcion}
                      </button>
                    );
                  })}
                </div>
                {respuesta !== null && (
                  <p className="text-xl font-bold mt-4">
                    {respuesta === pregunta.correcta
                      ? "Correcto, ganaste un paquete"
                      : "Incorrecto, no ganaste nada"}
                  </p>
                )}
              </div>
            )}

            {resultado === "paquete" && (
              <p className="text-2xl font-bold">¡Ganaste un paquete!</p>
            )}

            {cartasGanadas.length > 0 && (
              <>
                <h3 className="text-2xl font-bold my-4">Te tocaron:</h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {cartasGanadas.map((carta) => (
                    <Cartas key={carta.id} nombre={carta.nombre} imagen={carta.imagen} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Contenedor>
    </main>
  );
}
