/**
 * Solar System bodies with a photograph on their Wikipedia article — planets,
 * the larger moons, the dwarf planets, and the handful of asteroids and comets
 * a spacecraft has actually flown past.
 *
 * A few of the outer moons are only ever shown as a Voyager frame or a shaded
 * relief map rather than a true colour photo. Those are kept: the surface
 * markings are still the clue, which is what the round is testing.
 *
 * Titles are stored decoded — `pageInfo` percent-encodes them itself, and a
 * pre-encoded title double-encodes into a 403.
 */
export type PlanetSeed = { wiki: string; label: string; kind: string };

export const PLANETS: PlanetSeed[] = [
  { wiki: 'Sun', label: 'The Sun', kind: 'Star' },
  { wiki: 'Mercury_(planet)', label: 'Mercury', kind: 'Planet' },
  { wiki: 'Venus', label: 'Venus', kind: 'Planet' },
  { wiki: 'Earth', label: 'Earth', kind: 'Planet' },
  { wiki: 'Moon', label: 'The Moon', kind: 'Moon of Earth' },
  { wiki: 'Mars', label: 'Mars', kind: 'Planet' },
  { wiki: 'Jupiter', label: 'Jupiter', kind: 'Planet' },
  { wiki: 'Saturn', label: 'Saturn', kind: 'Planet' },
  { wiki: 'Uranus', label: 'Uranus', kind: 'Planet' },
  { wiki: 'Neptune', label: 'Neptune', kind: 'Planet' },

  { wiki: 'Phobos_(moon)', label: 'Phobos', kind: 'Moon of Mars' },
  { wiki: 'Deimos_(moon)', label: 'Deimos', kind: 'Moon of Mars' },

  { wiki: 'Io_(moon)', label: 'Io', kind: 'Moon of Jupiter' },
  { wiki: 'Europa_(moon)', label: 'Europa', kind: 'Moon of Jupiter' },
  { wiki: 'Ganymede_(moon)', label: 'Ganymede', kind: 'Moon of Jupiter' },
  { wiki: 'Callisto_(moon)', label: 'Callisto', kind: 'Moon of Jupiter' },

  { wiki: 'Titan_(moon)', label: 'Titan', kind: 'Moon of Saturn' },
  { wiki: 'Enceladus', label: 'Enceladus', kind: 'Moon of Saturn' },
  { wiki: 'Mimas_(moon)', label: 'Mimas', kind: 'Moon of Saturn' },
  { wiki: 'Iapetus_(moon)', label: 'Iapetus', kind: 'Moon of Saturn' },
  { wiki: 'Rhea_(moon)', label: 'Rhea', kind: 'Moon of Saturn' },
  { wiki: 'Dione_(moon)', label: 'Dione', kind: 'Moon of Saturn' },
  { wiki: 'Tethys_(moon)', label: 'Tethys', kind: 'Moon of Saturn' },
  { wiki: 'Hyperion_(moon)', label: 'Hyperion', kind: 'Moon of Saturn' },

  { wiki: 'Miranda_(moon)', label: 'Miranda', kind: 'Moon of Uranus' },
  { wiki: 'Titania_(moon)', label: 'Titania', kind: 'Moon of Uranus' },
  { wiki: 'Ariel_(moon)', label: 'Ariel', kind: 'Moon of Uranus' },
  { wiki: 'Oberon_(moon)', label: 'Oberon', kind: 'Moon of Uranus' },

  { wiki: 'Triton_(moon)', label: 'Triton', kind: 'Moon of Neptune' },

  { wiki: 'Pluto', label: 'Pluto', kind: 'Dwarf planet' },
  { wiki: 'Charon_(moon)', label: 'Charon', kind: 'Moon of Pluto' },
  { wiki: 'Ceres_(dwarf_planet)', label: 'Ceres', kind: 'Dwarf planet' },
  { wiki: 'Eris_(dwarf_planet)', label: 'Eris', kind: 'Dwarf planet' },
  { wiki: 'Makemake', label: 'Makemake', kind: 'Dwarf planet' },
  { wiki: 'Haumea', label: 'Haumea', kind: 'Dwarf planet' },
  { wiki: 'Arrokoth', label: 'Arrokoth', kind: 'Kuiper belt object' },

  { wiki: '4_Vesta', label: 'Vesta', kind: 'Asteroid' },
  { wiki: '2_Pallas', label: 'Pallas', kind: 'Asteroid' },
  { wiki: '433_Eros', label: 'Eros', kind: 'Near-Earth asteroid' },
  { wiki: '101955_Bennu', label: 'Bennu', kind: 'Near-Earth asteroid' },
  { wiki: '25143_Itokawa', label: 'Itokawa', kind: 'Near-Earth asteroid' },
  { wiki: '162173_Ryugu', label: 'Ryugu', kind: 'Near-Earth asteroid' },
  { wiki: '243_Ida', label: 'Ida', kind: 'Asteroid' },

  { wiki: '67P/Churyumov–Gerasimenko', label: '67P/Churyumov–Gerasimenko', kind: 'Comet' },
  { wiki: "Halley's_Comet", label: "Halley's Comet", kind: 'Comet' },
  { wiki: 'Comet_Hale–Bopp', label: 'Hale–Bopp', kind: 'Comet' },
];
