export interface LinkItem {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface NavGroup {
  label: string;
  href?: string;
  children?: LinkItem[];
}

export interface Feature {
  title: string;
  text: string;
}

export interface Program {
  slug: "core" | "specialty" | "complete";
  name: string;
  shortName: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  daysPerWeek: number;
  schedule: string;
  lengthLabel: string;
  format: string;
  bestFor: string;
  highlights: string[];
  curriculum: { title: string; text: string }[];
  includes: string[];
  /** Leave undefined to show "Tuition shared during your tour". */
  price?: string;
  featured?: boolean;
}

export interface Workshop {
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  tagline?: string;
  price?: string;
  duration?: string;
  description: string;
  seoDescription: string;
  eligibility?: string;
  bookLabel: string;
  /** Wix path used for Book Now */
  wixPath: string;
}

export interface Service {
  slug: string;
  name: string;
  price: string;
  duration: string;
  category: "repairs" | "manipedi" | "enhancements";
  description: string;
  image: string;
  imageAlt: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  bio: string[];
  isPlaceholderBio?: boolean;
  /** ISO instant (UTC). After this moment the member is dropped from the roster at request time. */
  activeUntil?: string;
}

export interface Review {
  name: string;
  source: string;
  text: string;
  rating: number;
}

export interface Faq {
  q: string;
  a: string;
}

export interface QuizOption {
  label: string;
  /** points toward each program */
  scores: Partial<Record<Program["slug"], number>> & { workshops?: number };
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export interface PageMeta {
  title: string;
  description: string;
  eyebrow?: string;
  h1: string;
  lede?: string;
}

export interface SiteContent {
  locale: "en" | "es";
  meta: {
    siteName: string;
    titleTemplate: string;
    defaultTitle: string;
    defaultDescription: string;
  };
  common: {
    applyNow: string;
    bookTour: string;
    courseInfo: string;
    learnMore: string;
    bookNow: string;
    readMore: string;
    viewAll: string;
    callUs: string;
    textUs: string;
    emailUs: string;
    directions: string;
    login: string;
    cart: string;
    hablamos: string;
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    switchLanguage: string;
    switchLanguageShort: string;
    backToTop: string;
    opensWix: string;
    tuitionOnTour: string;
    paymentPlans: string;
    noCreditCheck: string;
    nextClassBegins: string;
    enrollmentDeadline: string;
    nowEnrolling: string;
    oneDayPerWeek: string;
    /** "{n}" is replaced with the number */
    daysPerWeek: string;
    months: string;
    hybrid: string;
    home: string;
    breadcrumbHome: string;
    classHours: string;
    officeHours: string;
    closed: string;
    monFri: string;
    satSun: string;
    saturday: string;
    sunday: string;
    partnersHeading: string;
    partnersKicker: string;
    reviewsKicker: string;
    reviewsHeading: string;
    reviewsMore: string;
    prev: string;
    next: string;
    readFullStory: string;
    placeholderNote: string;
    and: string;
    designedBy: string;
    allRights: string;
    footerTagline: string;
    footerCustomerCare: string;
    footerLocation: string;
    footerPrograms: string;
    footerAcademy: string;
    footerFollow: string;
    notFoundTitle: string;
    notFoundText: string;
    notFoundCta: string;
  };
  nav: NavGroup[];
  home: {
    hero: {
      kicker: string;
      h1: string;
      h1Accent: string;
      lede: string;
      primary: string;
      secondary: string;
      imageAlts: string[];
    };
    intro: { kicker: string; heading: string; text: string; cta: string };
    features: Feature[];
    programs: { kicker: string; heading: string; text: string; cta: string; quizCta: string };
    founder: { kicker: string; quote: string; name: string; role: string; cta: string };
    hours: { kicker: string; heading: string; text: string; cta: string };
    gallery: { kicker: string; heading: string; cta: string };
    closing: { heading: string; text: string; primary: string; secondary: string };
  };
  pages: {
    about: PageMeta & {
      body: string[];
      missionHeading: string;
      mission: string;
      visionHeading: string;
      vision: string[];
      serving: string;
      cta: string;
      founderKicker: string;
      founderHeading: string;
      founderText: string[];
      founderImageAlt: string;
    };
    founder: PageMeta & {
      name: string;
      role: string;
      quote: string;
      story: string[];
      bio: string[];
      missionHeading: string;
      mission: string;
      workHeading: string;
      pressKicker: string;
      pressQuote: string;
      pressCta: string;
      cta: string;
    };
    team: PageMeta & { members: TeamMember[]; closing: string; cta: string };
    courses: PageMeta & {
      overviewHeading: string;
      overview: string;
      scheduleHeading: string;
      schedule: string[];
      campusHours: string;
      learnHeading: string;
      learn: { title: string; text: string }[];
      compareHeading: string;
      compareText: string;
      pickHelp: string;
      pickCta: string;
      tuitionCta: string;
      tourCta: string;
    };
    programs: Program[];
    programPage: {
      kicker: string;
      atAGlance: string;
      schedule: string;
      length: string;
      format: string;
      bestFor: string;
      curriculumHeading: string;
      includesHeading: string;
      tuitionHeading: string;
      tuitionText: string;
      otherPrograms: string;
      nextStart: string;
    };
    tuition: PageMeta & {
      intro: string[];
      feeHeading: string;
      feeText: string;
      programHeading: string;
      program: string[];
      includedHeading: string;
      included: Feature[];
      kitsHeading: string;
      kitsText: string;
      kitsAlt: string;
      paymentHeading: string;
      payment: string[];
      cta: string;
      refundCta: string;
    };
    financialAid: PageMeta & {
      intro: string;
      noPell: string;
      noCombine: string;
      optionsHeading: string;
      options: Feature[];
      scholarshipCta: string;
      workStudyHeading: string;
      workStudyIntro: string;
      workStudy: { title: string; items: string[] }[];
      readyHeading: string;
      readyText: string;
      cta: string;
    };
    apply: PageMeta & {
      intro: string;
      stepsHeading: string;
      steps: Feature[];
      feeNote: string;
      cta: string;
      readyHeading: string;
      tourCta: string;
    };
    scholarships: PageMeta & {
      intro: string;
      detailsHeading: string;
      details: string;
      responsibleHeading: string;
      responsible: string[];
      qualifyHeading: string;
      steps: Feature[];
      cta: string;
      ctaNote: string;
    };
    waitlist: PageMeta & { intro: string; cta: string; note: string; emailLabel: string };
    workshops: PageMeta & {
      kicker: string;
      heading: string;
      text: string;
      membershipHeading: string;
      membershipText: string;
      membershipCta: string;
      listHeading: string;
      eligibility: string;
      items: Workshop[];
    };
    workshopPage: {
      kicker: string;
      descriptionHeading: string;
      eligibilityHeading: string;
      policyHeading: string;
      policy: string[];
      otherHeading: string;
      backLabel: string;
    };
    services: PageMeta & {
      intro: string;
      note: string;
      categories: Record<Service["category"], string>;
      allLabel: string;
      filterLabel: string;
      countLabel: string;
      items: Service[];
      supervised: string;
      friendsFamilyCta: string;
    };
    tour: PageMeta & {
      intro: string;
      inPerson: { title: string; text: string; cta: string };
      virtual: { title: string; text: string; cta: string };
      knowHeading: string;
      know: Feature[];
      closing: string;
      facilityKicker: string;
      facilityHeading: string;
      facility: { src: string; alt: string }[];
      heroAlt: string;
    };
    contact: PageMeta & {
      intro: string;
      phoneHeading: string;
      emailHeading: string;
      visitHeading: string;
      socialHeading: string;
      hoursHeading: string;
      faqCta: string;
      tourCta: string;
      mapTitle: string;
    };
    faqs: PageMeta & { items: Faq[]; stillHeading: string; stillCta: string };
    press: PageMeta & {
      intro: string;
      inquiries: string;
      features: { outlet: string; title: string; date: string; summary: string; quote: string; href: string }[];
      readLabel: string;
    };
    careers: PageMeta & {
      intro: string;
      heroAlt: string;
      openingsHeading: string;
      jobs: { slug: string; title: string; type: string; summary: string; cta: string }[];
    };
    job: PageMeta & {
      summaryHeading: string;
      summary: string;
      qualificationsHeading: string;
      required: string[];
      preferredLabel: string;
      preferred: string[];
      scheduleHeading: string;
      schedules: { label: string; items: string[] }[];
      compensationHeading: string;
      compensation: { label: string; items: string[] }[];
      cta: string;
      ctaNote: string;
    };
    refund: PageMeta & { sections: { heading: string; blocks: (string | string[])[] }[] };
    privacy: PageMeta & { sections: { heading: string; blocks: (string | string[])[] }[]; placeholder: string };
    graduation: PageMeta & {
      intro: string;
      overviewHeading: string;
      locationHeading: string;
      location: string[];
      date: string;
      ceremonyHeading: string;
      ceremonyTime: string;
      ceremonyText: string;
      expectHeading: string;
      expect: string[];
      dressHeading: string;
      dress: string;
      photosHeading: string;
      photos: string;
      diningHeading: string;
      diningTime: string;
      dining: string[];
      ticketsHeading: string;
      ticketsCta: string;
    };
    friendsFamily: PageMeta & {
      intro: string[];
      quote: string;
      servicesHeading: string;
      cta: string;
    };
    quiz: PageMeta & {
      intro: string;
      questions: QuizQuestion[];
      next: string;
      back: string;
      seeResult: string;
      restart: string;
      resultKicker: string;
      /** "{name}" is replaced with the program name */
      resultHeading: string;
      resultText: Record<Program["slug"] | "workshops", string>;
      workshopsName: string;
      viewProgram: string;
      viewWorkshops: string;
      bookTour: string;
      /** "{n}" and "{total}" are replaced */
      progress: string;
    };
  };
  reviews: Review[];
  partners: { name: string; file: string; dark?: boolean }[];
}
