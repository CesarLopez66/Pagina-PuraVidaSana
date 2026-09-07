export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="h-12 w-12 animate-spin rounded-full border-4 border-soft border-t-leaf" />
        <p className="text-ink/60">Cargando...</p>
      </div>
    </div>
  );
}
