/** Slowly drifting, softly blurred colour blobs for section backgrounds. */
export function BlobBackground({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)] ${className}`}
    >
      <div className="animate-blob absolute -left-[10%] top-[5%] h-[45vmax] w-[45vmax] rounded-full bg-blush/70 blur-3xl" />
      <div
        className="animate-blob absolute -right-[15%] top-[30%] h-[40vmax] w-[40vmax] rounded-full bg-sage/30 blur-3xl"
        style={{ animationDelay: '-7s' }}
      />
      <div
        className="animate-blob absolute bottom-[-20%] left-[30%] h-[35vmax] w-[35vmax] rounded-full bg-rose/20 blur-3xl"
        style={{ animationDelay: '-14s' }}
      />
    </div>
  )
}
