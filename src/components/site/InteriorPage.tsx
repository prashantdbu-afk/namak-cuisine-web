import Link from "next/link";
export function InteriorPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <section className="interior-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      {children ?? (
        <section className="interior-body section">
          <p>Come experience Namak on Greenville Avenue in Dallas.</p>
          <Link className="button button-dark" href="/visit">
            Plan your visit
          </Link>
        </section>
      )}
    </>
  );
}
