export default function MobileFrame() {
    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-[#F5F0E6]">
            <div className="h-12 flex items-center justify-center gap-12">

                {/* Recientes */}
                <div className="w-4 h-4 border border-gray-500 rounded-sm" />

                {/* Inicio */}
                <div className="w-5 h-5 rounded-full border border-gray-500" />

                {/* Atrás */}
                <div className="w-4 h-4 border-l-2 border-b-2 border-gray-500 rotate-45" />

            </div>
        </div>
    );
}