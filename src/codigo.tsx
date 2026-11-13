import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import Cartas from "./componentes/figuritas.tsx";
import Contenedor from "./componentes/contenedor.tsx";
import Header from "./componentes/header";
import type { Carta, Personaje } from "./App.tsx";
import { ESPERA_MS, formatearTiempo, generarPaquete, tiempoRestante, useAhora } from "./utils.ts";

type CodigoProps = {
  personajes: Personaje[];
  onGanar: (cartas: Carta[]) => void;
};

type RondaCodigo = {
  indice: number;
  intentos: number;
  finalizadaEn: number | null;
  cartasGanadas: Carta[];
};

const CLAVE_RONDA = "rondaCodigo";
const MAX_INTENTOS = 2;
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DESPLAZAMIENTO = 3;
const FRASES = [
  "BILL ES REAL",
  "LA CABAÑA DEL MISTERIO",
  "SOOS ES EL MEJOR",
  "DIPPER ENCUENTRA EL DIARIO",
];

function prepararTexto(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

function normalizar(texto: string) {
  return prepararTexto(texto).replace(/[^A-Z0-9]/g, "");
}

function cifrarCesar(texto: string) {
  return prepararTexto(texto).replace(/[A-Z]/g, (letra) => {
    const posicion = ALFABETO.indexOf(letra);
    return ALFABETO[(posicion + DESPLAZAMIENTO) % ALFABETO.length];
  });
}

const ACERTIJOS = FRASES.map((solucion) => ({ solucion, codigo: cifrarCesar(solucion) }));

function crearRonda(indice: number): RondaCodigo {
  return { indice, intentos: 0, finalizadaEn: null, cartasGanadas: [] };
}

function cargarRonda(): RondaCodigo {
  const nueva = crearRonda(Math.floor(Math.random() * ACERTIJOS.length));

  try {
    const guardada = localStorage.getItem(CLAVE_RONDA);
    if (guardada) {
      const ronda: RondaCodigo = JSON.parse(guardada);
      if (ronda && ACERTIJOS[ronda.indice]) return ronda;
    }

    // Conservamos una espera iniciada antes de guardar rondas completas.
    const finalizadaEn = Number(localStorage.getItem("ultimoAcertijo"));
    if (Number.isFinite(finalizadaEn) && tiempoRestante(finalizadaEn, Date.now()) > 0) {
      return { ...nueva, intentos: MAX_INTENTOS, finalizadaEn };
    }
  } catch {
    // Si el almacenamiento no está disponible, la ronda funciona en memoria.
  }

  return nueva;
}

export default function Codigo({ personajes, onGanar }: CodigoProps) {
  const ahora = useAhora();
  const [ronda, setRonda] = useState(cargarRonda);
  const [respuesta, setRespuesta] = useState("");
  const acertijo = ACERTIJOS[ronda.indice];
  const finalizada = ronda.finalizadaEn !== null;
  const restante = Math.min(ESPERA_MS, tiempoRestante(ronda.finalizadaEn, ahora));
  const puedeIntentar = !finalizada && personajes.length > 0;
  const { cartasGanadas } = ronda;

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_RONDA, JSON.stringify(ronda));
    } catch (err) {
      console.error("No se pudo guardar la ronda de código:", err);
    }
  }, [ronda]);

  function comprobar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const texto = normalizar(respuesta);
    if (!puedeIntentar || !texto) return;

    const intentos = ronda.intentos + 1;
    const correcta = texto === normalizar(acertijo.solucion);
    const nuevas = correcta ? generarPaquete(personajes) : [];
    setRonda({
      ...ronda,
      intentos,
      finalizadaEn: correcta || intentos === MAX_INTENTOS ? Date.now() : null,
      cartasGanadas: nuevas,
    });
    if (correcta) onGanar(nuevas);
    setRespuesta("");
  }

  function siguienteOracion() {
    if (!finalizada || tiempoRestante(ronda.finalizadaEn, Date.now()) > 0) return;

    const desplazamiento = 1 + Math.floor(Math.random() * (ACERTIJOS.length - 1));
    const indice = (ronda.indice + desplazamiento) % ACERTIJOS.length;
    setRonda(crearRonda(indice));
  }

  return (
    <main className="min-w-screen min-h-screen bg-amber-700 p-10 px-20">
      <Header />
      <Contenedor titulo="Descifrá el código">
        <p className="text-lg">Tenés dos intentos seguidos para descifrar la oración y ganar un paquete. La próxima oración se habilita cinco minutos después de terminar la ronda.</p>
        <section className="mt-6 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
          <p className="text-lg">César: mové cada letra {DESPLAZAMIENTO} lugares hacia atrás en el alfabeto A–Z. La Ñ se trata como N.</p>
          <p className="my-4 rounded-xl bg-white p-4 font-mono text-2xl font-bold tracking-wider text-amber-900">{acertijo.codigo}</p>
          <p className="mb-4 font-semibold">Intentos: {ronda.intentos} de {MAX_INTENTOS}</p>
          {!finalizada && (
            <form className="flex flex-wrap items-center gap-3" onSubmit={comprobar}>
              <label className="sr-only" htmlFor="respuesta-codigo">Tu respuesta</label>
              <input
                id="respuesta-codigo"
                value={respuesta}
                onChange={(event) => setRespuesta(event.target.value)}
                disabled={!puedeIntentar}
                placeholder="Escribí la oración descifrada"
                className="min-w-64 flex-1 rounded-xl border border-amber-300 bg-white px-4 py-3 text-lg disabled:opacity-60"
              />
              <button type="submit" disabled={!puedeIntentar || !respuesta.trim()} className="rounded-full bg-amber-900 px-6 py-3 text-lg font-bold text-amber-100 hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-gray-400">
                Comprobar
              </button>
            </form>
          )}
          {!finalizada && ronda.intentos > 0 && (
            <p role="status" className="mt-3 font-semibold">No era esa oración. Te queda un intento.</p>
          )}
          {!finalizada && personajes.length === 0 && <p className="mt-3">Cargando personajes</p>}
          {finalizada && (
            <>
              {cartasGanadas.length > 0 ? (
                <p role="status" className="mt-4 text-xl font-bold text-green-700">¡Correcto! Ganaste un paquete. Estas son tus figuritas:</p>
              ) : (
                <p role="status" className="mt-4 text-xl font-bold text-red-700">Se acabaron los dos intentos.</p>
              )}
              {restante > 0 ? (
                <p className="mt-3 font-semibold">Próxima oración en {formatearTiempo(restante)}.</p>
              ) : (
                <button
                  type="button"
                  onClick={siguienteOracion}
                  className="mt-3 rounded-full bg-amber-900 px-6 py-3 text-lg font-bold text-amber-100 hover:bg-amber-800"
                >
                  Nueva oración
                </button>
              )}
            </>
          )}
        </section>

        {cartasGanadas.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-6">
            {cartasGanadas.map((carta) => <Cartas key={carta.id} nombre={carta.nombre} imagen={carta.imagen} />)}
          </div>
        )}
        <Link to="/paquetes" className="mt-8 inline-block rounded-full bg-gray-200 px-6 py-2 text-lg hover:bg-gray-300">Volver a paquetes</Link>
      </Contenedor>
    </main>
  );
}
