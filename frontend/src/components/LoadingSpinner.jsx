export default function LoadingSpinner() {
    return (
        // Ez a div biztosítja, hogy a pörgő ikon pontosan a képernyő közepén legyen, a megfelelő háttérszínnel
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Maga a Tailwind CSS spinner: egy kerek elem, aminek csak az alsó és felső szegélye van beszínezve, és forog */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
        </div>
    );
}