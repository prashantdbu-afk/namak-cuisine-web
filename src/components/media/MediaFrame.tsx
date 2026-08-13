export function MediaFrame({
  children,
  aspectRatio,
  className,
}: {
  children: React.ReactNode;
  aspectRatio: number;
  className?: string;
}) {
  return (
    <div
      className={`media-frame ${className ?? ""}`}
      style={{ aspectRatio }}
      data-media-frame
    >
      {children}
    </div>
  );
}
