import {
  barStockCandidates,
  barStockPresentation,
  type BarStockSlotId,
} from "@/media/bar-stock";

const slotNames: Record<BarStockSlotId, string> = {
  "bar-stock-hero": "Bar hero",
  "bar-stock-draft-beer": "Draft Beer",
  "bar-stock-beer": "Beer",
  "bar-stock-whiskey": "Whiskey",
  "bar-stock-gin": "Gin",
  "bar-stock-vodka": "Vodka",
  "bar-stock-tequila": "Tequila",
  "bar-stock-rum": "Rum",
  "bar-stock-aperitivo-liquor": "Aperitivo / Liquor",
  "bar-stock-white-wine": "White Wine",
  "bar-stock-red-wine": "Red Wine",
  "bar-stock-sparkling-wine": "Sparkling Wine",
};

export function BarStockReview() {
  return (
    <div className="stock-review-slots">
      {Object.entries(slotNames).map(([slotId, slotName]) => (
        <section className="stock-review-slot" key={slotId}>
          <div className="section-head">
            <div>
              <p className="eyebrow dark">Editorial category image</p>
              <h2>{slotName}</h2>
            </div>
          </div>
          <div className="stock-candidate-grid">
            {barStockCandidates
              .filter((candidate) => candidate.slotId === slotId)
              .map((candidate) => {
                const previewUrl =
                  candidate.role === "recommended"
                    ? `/media/bar/${barStockPresentation[candidate.slotId].output}`
                    : candidate.previewUrl;
                return (
                  <article
                    className="stock-candidate"
                    key={candidate.candidateId}
                  >
                    <p className="stock-decision">
                      {candidate.role === "recommended"
                        ? "Recommended"
                        : candidate.role === "alternate-1"
                          ? "Alternate 1"
                          : "Alternate 2"}
                    </p>
                    <div
                      className="stock-full-preview"
                      role="img"
                      aria-label={candidate.title}
                      style={{ backgroundImage: `url(${previewUrl})` }}
                    />
                    <div className="stock-crops">
                      <div
                        style={{
                          backgroundImage: `url(${previewUrl})`,
                        }}
                        aria-label="Proposed desktop crop"
                        role="img"
                      />
                      <div
                        style={{
                          backgroundImage: `url(${previewUrl})`,
                        }}
                        aria-label="Proposed mobile crop"
                        role="img"
                      />
                    </div>
                    <div className="stock-candidate-copy">
                      <h3>{candidate.title}</h3>
                      <p>{candidate.rationale}</p>
                      <dl>
                        <div>
                          <dt>Score</dt>
                          <dd>{candidate.score}/5</dd>
                        </div>
                        <div>
                          <dt>Provider</dt>
                          <dd>Pexels</dd>
                        </div>
                        <div>
                          <dt>Photographer</dt>
                          <dd>{candidate.photographer}</dd>
                        </div>
                        <div>
                          <dt>License</dt>
                          <dd>{candidate.licenseName}</dd>
                        </div>
                        <div>
                          <dt>Brand/logo</dt>
                          <dd>{candidate.brandCheck}</dd>
                        </div>
                        <div>
                          <dt>People</dt>
                          <dd>{candidate.peopleCheck}</dd>
                        </div>
                      </dl>
                      <a
                        href={candidate.sourcePageUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Review source page
                      </a>
                    </div>
                  </article>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
