import type { Locale } from "@/i18n/config";

/**
 * Photo sets for page heroes. The first image leads (large arch), the next two
 * stack beside it. All files live in /public/images. Swap any entry to change a
 * page's hero without touching the page itself.
 */
type Photo = { src: string; alt: { en: string; es: string } };

const photo = {
  genWithStudent: { src: "/images/campus/gen-with-student.jpg", alt: { en: "Gen Henriquez guiding a student at a manicure station", es: "Gen Henriquez guiando a una estudiante en una estación de manicura" } },
  genTeaching: { src: "/images/campus/gen-teaching.jpg", alt: { en: "Gen Henriquez teaching in the academy classroom", es: "Gen Henriquez dando clase en el salón de la academia" } },
  genFounder: { src: "/images/campus/gen-henriquez-founder.jpg", alt: { en: "Gen Henriquez, founder of Tha Nail Artistry Academy", es: "Gen Henriquez, fundadora de Tha Nail Artistry Academy" } },
  storefront: { src: "/images/campus/storefront.jpg", alt: { en: "Tha Nail Artistry Academy storefront in Northwest Houston", es: "Fachada de Tha Nail Artistry Academy en el noroeste de Houston" } },
  studentKit: { src: "/images/campus/student-kit.jpg", alt: { en: "The all-inclusive professional student kit", es: "El kit profesional completo de estudiante" } },
  graduates: { src: "/images/campus/graduates.jpg", alt: { en: "Graduates celebrating in purple caps and gowns", es: "Graduadas celebrando con toga y birrete morados" } },
  lobby: { src: "/images/facility/lobby-reception.jpg", alt: { en: "Academy lobby with a white marble reception desk", es: "Recepción de la academia con mostrador de mármol blanco" } },
  classroom: { src: "/images/facility/nail-classroom.jpg", alt: { en: "Classroom with white desks and lavender walls", es: "Salón de clases con escritorios blancos y paredes lavanda" } },
  stations: { src: "/images/facility/inside-station.jpg", alt: { en: "Row of white manicure stations by the front windows", es: "Fila de estaciones de manicura blancas junto a las ventanas" } },
  pediChairs: { src: "/images/facility/pedi-chairs.jpg", alt: { en: "Leather pedicure spa chairs against a lavender wall", es: "Sillones de pedicura de piel frente a una pared lavanda" } },
  backBar: { src: "/images/facility/back-bar.jpg", alt: { en: "Back bar area with shelves of supplies", es: "Área de back bar con estantes de productos" } },
  workFrench: { src: "/images/work/neon-french-tip-nail-art.jpg", alt: { en: "Neon French tip nail art by a student", es: "Nail art de puntas francesas neón hecho por una estudiante" } },
  workAbstract: { src: "/images/work/neon-abstract-nail-art.jpg", alt: { en: "Neon abstract nail art", es: "Nail art abstracto neón" } },
  workChrome: { src: "/images/work/stiletto-chrome-animal-print-nails.jpg", alt: { en: "Chrome stiletto nails with animal print", es: "Uñas stiletto cromadas con estampado animal" } },
  workCroc: { src: "/images/work/pink-croc-stiletto-nails.jpg", alt: { en: "Pink croc-texture stiletto nails", es: "Uñas stiletto rosas con textura croc" } },
  workCrystal: { src: "/images/work/crystal-stiletto-nails.png", alt: { en: "Crystal-studded stiletto nails", es: "Uñas stiletto con cristales" } },
  workCelestial: { src: "/images/work/gold-celestial-nail-art.png", alt: { en: "Gold celestial nail art", es: "Nail art celestial dorado" } },
  workButterfly: { src: "/images/work/lavender-butterfly-nail-art.png", alt: { en: "Lavender butterfly nail art", es: "Nail art de mariposas lavanda" } },
  workOmbre: { src: "/images/work/soft-ombre-nails.png", alt: { en: "Soft ombre nails", es: "Uñas ombré suave" } },
  wsHardGel: { src: "/images/workshops/hard-gel-workshops.jpg", alt: { en: "Hard gel application close-up", es: "Aplicación de gel duro de cerca" } },
  wsNailArt: { src: "/images/workshops/nail-art-workshops.jpg", alt: { en: "Detailed nail art in progress", es: "Nail art detallado en proceso" } },
  wsAcrylic: { src: "/images/workshops/acrylic-workshops.jpg", alt: { en: "Acrylic sculpting workshop", es: "Taller de esculpido en acrílico" } },
  svcAcrylic: { src: "/images/services/acrylic-full-set.jpg", alt: { en: "Acrylic full set", es: "Set completo de acrílico" } },
  svcGelX: { src: "/images/services/gel-x-full-set.jpg", alt: { en: "Gel-X full set", es: "Set completo de Gel-X" } },
  svcRussian: { src: "/images/services/russian-manicure.jpg", alt: { en: "Russian manicure", es: "Manicura rusa" } },
} satisfies Record<string, Photo>;

type Key = keyof typeof photo;

const sets: Record<string, Key[]> = {
  apply: ["genWithStudent", "workFrench", "stations"],
  courses: ["classroom", "genTeaching", "workOmbre"],
  tuition: ["studentKit", "workCelestial", "backBar"],
  financialAid: ["genTeaching", "workButterfly", "lobby"],
  whichProgram: ["stations", "workCroc", "workCrystal"],
  workshops: ["wsHardGel", "wsNailArt", "wsAcrylic"],
  services: ["svcAcrylic", "svcGelX", "svcRussian"],
  team: ["genTeaching", "stations", "genWithStudent"],
  faqs: ["backBar", "workChrome", "lobby"],
  contact: ["storefront", "lobby", "pediChairs"],
  waitlist: ["classroom", "workAbstract", "genWithStudent"],
  assessment: ["genWithStudent", "workButterfly", "stations"],
  press: ["genFounder", "storefront", "graduates"],
};

export function heroImages(locale: Locale, page: keyof typeof sets): { src: string; alt: string }[] {
  return sets[page].map((k) => ({ src: photo[k].src, alt: photo[k].alt[locale] }));
}
