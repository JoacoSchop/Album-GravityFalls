type CartasProps = {
    nombre: string;
    imagen: string;
};

export default function Cartas({ nombre, imagen }: CartasProps) {
    return (
        <div className="aspect-3/4 w-50 flex flex-col overflow-hidden rounded-2xl border-4 border-amber-900 bg-amber-50 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex-1 overflow-hidden bg-amber-50">
                <img src={imagen} alt={nombre} className="h-55 w-60" />
            </div>
            <div className="flex items-center justify-center bg-amber-900 px-2 py-2">
                <p className="text-center font-bold text-amber-100">{nombre}</p>
            </div>
        </div>
    );
}
