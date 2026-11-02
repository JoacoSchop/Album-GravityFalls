import type { ReactNode } from "react";

type ContenedorProps = {
    titulo: string;
    children: ReactNode;
};

export default function Contenedor({ titulo, children }: ContenedorProps) {
    return (
        <section className="bg-white rounded-2xl mt-15 w-full min-h-90 p-10">
            <h2 className="text-3xl font-bold text-amber-900 mb-6">{titulo}</h2>
            {children}
        </section>
    );
}
