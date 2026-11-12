import { useState, useEffect } from "react";
import type { Carta, Personaje } from "./App.tsx";

export const ESPERA_MS = 5 * 60 * 1000; 
export const CARTAS_POR_PAQUETE = 5;

// Cuánto falta (en ms) para que se cumpla la espera desde `ultimaVez`
export function tiempoRestante(ultimaVez: number | null, ahora: number) {
  return ultimaVez === null ? 0 : Math.max(0, ultimaVez + ESPERA_MS - ahora);
}

export function formatearTiempo(ms: number) {
  const totalSegundos = Math.ceil(ms / 1000);
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  return `${minutos}:${String(segundos).padStart(2, "0")}`;
}

// Devuelve la hora actual y se actualiza cada segundo (para cuentas regresivas)
export function useAhora() {
  const [ahora, setAhora] = useState(() => Date.now());
  useEffect(() => {
    const intervalo = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, []);
  return ahora;
}

export function generarPaquete(personajes: Personaje[]): Carta[] {
  return Array.from({ length: CARTAS_POR_PAQUETE }, () => {
    const personaje = personajes[Math.floor(Math.random() * personajes.length)];
    return {
      id: crypto.randomUUID(),
      personajeId: personaje._id,
      nombre: personaje.name,
      imagen: personaje.imageUrl,
    };
  });
}
