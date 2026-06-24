export function PlanetHero() {
  return (
    <>
      <div className="planet-hero">
        <span className="badge"><i />Available</span>
        <h1>Jeel Vankhede</h1>
        <p className="role">Lead Full Stack Engineer · 9+ years</p>
      </div>

      {/* persistent orbit hint, bottom-centered */}
      <div className="orbit-hint">
        ↻ drag to orbit · tap an island, satellite or beacon to explore · launch a rocket ↗
      </div>
    </>
  );
}
