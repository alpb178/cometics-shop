"use client";

import Image from "next/image";

export function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="Error"
          width={100}
          height={100}
          className="mx-auto mb-6 rounded-full border-2 border-primary"
        />
        <h1 className="text-2xl font-bold mb-4">Error al cargar la página</h1>
        <p className="text-gray-600 mb-4">
          No se pudo cargar el contenido de la página principal. Por favor,
          inténtalo de nuevo.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="min-h-[44px] px-6 py-3 border-2 border-primary rounded-full text-primary hover:bg-primary hover:text-white transition-colors font-medium"
          aria-label="Reintentar cargar la página"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
