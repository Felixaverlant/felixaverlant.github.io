export const SITE_URL = 'https://www.felixaverlant.com'

export const PROFILE_IMAGE = '/profile.jpg'

export type Bilingual = { fr: string; en: string };

export interface Experience {
  company: Bilingual;
  companyType?: Bilingual;
  companyUrl?: string;
  role: Bilingual;
  location: Bilingual;
  period: Bilingual;
  responsibilities: {
    category: Bilingual;
    items: Bilingual[];
  }[];
}

export const experiences: Experience[] = [
  {
    company: { fr: 'SustainSoft', en: 'SustainSoft' },
    companyType: { fr: 'SaaS B2B', en: 'SaaS B2B' },
    role: { fr: 'Co-founder & CPTO', en: 'Co-founder & CPTO' },
    location: { fr: 'Remote', en: 'Remote' },
    period: { fr: '2021 - 2026', en: '2021 - 2026' },
    responsibilities: [
      {
        category: { fr: 'Founder', en: 'Founder' },
        items: [
          { fr: "Techstars Paris '22 / Seed round / croissance à 100+ clients B2B", en: "Techstars Paris '22 / raised seed / grew to 100+ B2B clients" },
          { fr: 'Membre du board / représentation du produit dans la gouvernance et les décisions stratégiques', en: 'Board member / represented product in governance and strategic decisions' },
        ],
      },
      {
        category: { fr: 'Tech', en: 'Tech' },
        items: [
          { fr: "Construction et opération du SaaS B2B de A à Z (solo) : auth, infra, front/back end, DB, CI/CD...", en: 'Built and operated B2B SaaS end-to-end (solo): auth, infra, front/back end, DB, CI/CD' },
          { fr: "Recrutement et direction de l'équipe tech et produit / définition des rôles, rituels de delivery...", en: 'Recruited and led tech and product team / defined roles, hiring bar and delivery rituals' },
        ],
      },
      {
        category: { fr: 'Produit', en: 'Product' },
        items: [
          { fr: 'Stratégie et roadmap produit de l\'idéation au MVP à la production', en: 'Drove product strategy and roadmap from ideation to MVP and beyond' },
          { fr: 'Animation discovery, sprint planning et rituels / direction UX/UI et handoff', en: 'Ran discovery, sprint planning and rituals / set UX/UI direction and handoff' },
        ],
      },
    ],
  },
  {
    company: { fr: 'Adot (acq. by Veepee)', en: 'Adot (acq. by Veepee)' },
    companyType: { fr: 'AdTech', en: 'AdTech' },
    role: { fr: 'Head of Product', en: 'Head of Product' },
    location: { fr: 'Paris, France', en: 'Paris, France' },
    period: { fr: '2017 - 2021', en: '2017 - 2021' },
    responsibilities: [
      {
        category: { fr: 'Produit', en: 'Product' },
        items: [
          { fr: 'Définition et livraison des nouveaux produits / scope, lancement et itération', en: 'Defined and shipped new product lines / scope, launch and iteration' },
          { fr: 'Documentation produit et cadrage juridique/compliance pour les nouvelles offres', en: 'Product documentation and legal/compliance framing for new offerings' },
          { fr: 'Alignement interne sur la roadmap / présentation de la vision et roadmap produit aux clients et prospects pour la rétention et l\'upsell', en: 'Drove internal alignment on roadmap / presented product vision and roadmap to clients and prospects to support retention and upsell' },
        ],
      },
      {
        category: { fr: 'Team management', en: 'Team management' },
        items: [
          { fr: 'Scaling de 30 à 100+ employés et du CA de 6M à 24M€', en: 'Drove scaling from 30 to 100+ employees and revenue from €6M to €24M' },
          { fr: 'Direction des équipes produit et projets / priorisation, capacité et livraison', en: 'Led product and project teams / prioritization, capacity and delivery' },
          { fr: 'Partenariat avec les C-suite sur la stratégie produit et la roadmap', en: 'Partnered with C-suite on product strategy and roadmap' },
        ],
      },
    ],
  },
  {
    company: { fr: 'Altima (acq. by Accenture)', en: 'Altima (acq. by Accenture)' },
    companyType: { fr: 'E-commerce / Lead gen', en: 'E-commerce / Lead gen' },
    role: { fr: 'Director of Analytics', en: 'Director of Analytics' },
    location: { fr: 'New York City, États-Unis', en: 'New York City, USA' },
    period: { fr: '2016-2017', en: '2016-2017' },
    responsibilities: [
      {
        category: { fr: 'UX', en: 'UX' },
        items: [
          { fr: "CRO sur interfaces e-commerce et lead-gen / gains de conversion de -4 % à +9 %", en: 'Drove CRO for e-commerce and lead-gen interfaces / delivered -4% to +9% conversion gains' },
          { fr: "audits UX et recommandations", en: 'Led UX audits and recommended prioritised improvement backlogs for clients' },
        ],
      },
      {
        category: { fr: 'Sales', en: 'Sales' },
        items: [
          { fr: "Conception des offres clients et suivi des optimisations / communication des résultats", en: 'Designed client proposals and led client follow-up for optimization programs / scope and results communication' },
        ],
      },
      {
        category: { fr: 'Tech', en: 'Tech' },
        items: [
          { fr: "Analyse de données et configuration d'outils de test/analytics et ses restitutions", en: 'Ran data analysis and configured testing/analytics tools to support experiment design and readouts' },
        ],
      },
      {
        category: { fr: 'Management', en: 'Management' },
        items: [
          { fr: "Direction de l'équipe optimisation (consultants, développeurs, designers) / staffing, livraison et résultats clients", en: 'Led optimization team (consultants, developers, designers) / staffing, delivery and client outcomes' },
        ],
      },
    ],
  },
  {
    company: { fr: 'MFG Labs (acq. by Havas)', en: 'MFG Labs (acq. by Havas)' },
    companyType: { fr: 'Big data / Web agency', en: 'Big data / Web agency' },
    role: { fr: 'Account Manager', en: 'Account Manager' },
    location: { fr: 'Paris, France', en: 'Paris, France' },
    period: { fr: '2013-2016', en: '2013-2016' },
    responsibilities: [
      {
        category: { fr: 'Gestion de projet', en: 'Project management' },
        items: [
          { fr: 'Animation sprint planning et standups / QA produit et release readiness pour les comptes clés', en: 'Ran sprint planning and standups / product QA and release readiness for key accounts' },
          { fr: 'Livraison des projets Warner Bros France : site institutionnel, e-commerce et app second screen', en: 'Led project delivery for Warner Bros France: corporate site, e-commerce and second-screen app' },
          { fr: 'Coordination prestataires et parties prenantes client / scope, planning et handover', en: 'Coordinated vendors and client stakeholders / scope, timeline and handover' },
        ],
      },
      {
        category: { fr: 'Data', en: 'Data' },
        items: [
          { fr: 'Définition et suivi des KPI produit / reporting et prise de décision avec les parties prenantes', en: 'Defined and tracked product KPIs / reported on performance and drove decisions with stakeholders' },
        ],
      },
    ],
  },
  {
    company: { fr: 'Altima (acq. by Accenture)', en: 'Altima (acq. by Accenture)' },
    companyType: { fr: 'E-commerce / Lead gen', en: 'E-commerce / Lead gen' },
    role: { fr: 'Consultant conversion', en: 'Conversion consultant' },
    location: { fr: 'Paris, France', en: 'Paris, France' },
    period: { fr: '2012 - 2013', en: '2012 - 2013' },
    responsibilities: [
      {
        category: { fr: 'UX', en: 'UX' },
        items: [
          { fr: "CRO via A/B testing sur e-commerce et lead-gen / gains de conversion jusqu'à +19 %", en: 'Drove CRO via A/B testing for e-commerce and lead-gen / achieved up to +19% conversion lift' },
          { fr: "QA des tests d'optimisation et des livrables clients", en: 'QA for optimization tests and client deliverables' },
        ],
      },
      {
        category: { fr: 'Sales', en: 'Sales' },
        items: [
          { fr: "Contribution à l'avant-vente : cadrage, démos", en: 'Contributed to pre-sales: scoping, demos and proposal input' },
          { fr: "Conception des propositions d'optimisation et suivi client / présentation des résultats", en: 'Designed optimization proposals and led client follow-up and results presentations' },
        ],
      },
      {
        category: { fr: 'Tech', en: 'Tech' },
        items: [
          { fr: "Analyse de données et configuration d'outils A/B", en: 'Performed data analysis and configured A/B testing tools to support experiments' },
        ],
      },
    ],
  },
];

export interface Education {
  institution: string;
  degree: string;
  period: string;
}

export const educations: Education[] = [
  {
    institution: 'HETIC',
    degree: 'Master of Computer Science',
    period: '2011 - 2013',
  },
  {
    institution: 'La Sorbonne - Paris 1',
    degree: 'Licence de Droit',
    period: '2007 - 2010',
  },
];

export interface Skill {
  category: Bilingual;
  items: Bilingual[];
}

export interface Interest {
  fr: string;
  en: string;
}

export const interests: Interest[] = [
  { fr: 'Lire / Écrire', en: 'Reading / Writing' },
  { fr: 'E-sports', en: 'E-sports' },
  { fr: 'MAO / DAO', en: 'MAO / DAO' },
  { fr: 'Escalade', en: 'Climbing' },
];

export const skills: Skill[] = [
  {
    category: { fr: 'Produit & delivery', en: 'Product & delivery' },
    items: [
      {
        fr: 'Stratégie produit, roadmap et specs (BMAD, AI-assisted specs)',
        en: 'Product strategy, roadmap and specs (BMAD, AI-assisted requirements)',
      },
      {
        fr: 'User research, discovery, feedback et interviews',
        en: 'User research, discovery, feedback and interviews',
      },
      {
        fr: 'SCRUM / Kanban / sprint planning / priorisation du backlog',
        en: 'SCRUM / Kanban / sprint planning / backlog prioritization',
      },
      {
        fr: 'Alignement parties prenantes, mitigation des risques, delivery cross-fonctionnelle',
        en: 'Stakeholder alignment, risk mitigation, cross-functional delivery',
      },
    ],
  },
  {
    category: { fr: 'Tech & data', en: 'Tech & data' },
    items: [
      {
        fr: 'Javascript / Typescript / React',
        en: 'Javascript / Typescript / React',
      },
      {
        fr: 'Next.js / Nest.js',
        en: 'Next.js / Nest.js',
      },
      {
        fr: 'Storybook / Playwright / Algolia',
        en: 'Storybook / Playwright / Algolia',
      },
      {
        fr: 'GraphQl / SQL / NoSQL',
        en: 'GraphQl / SQL / NoSQL',
      },
      {
        fr: 'Vibe coding / prompt engineering',
        en: 'Vibe coding / prompt engineering',
      },
    ],
  },
  {
    category: { fr: 'UX & design', en: 'UX & design' },
    items: [
      {
        fr: 'Design system / Prototypage / Wireframes',
        en: 'Design system / Prototyping / Wireframes',
      },
      {
        fr: 'Parcours utilisateur / Audits UX',
        en: 'User journey  / Audits UX',
      },
      {
        fr: 'A/B tests / Optimisation de la conversion (CRO)',
        en: 'A/B testing / Conversion rate optimization (CRO)',
      },
    ],
  },
  {
    category: { fr: 'Software', en: 'Software' },
    items: [
      { fr: 'Figma / Blender', en: 'Figma / Blender' },
      { fr: 'Notion / Atlassian', en: 'Notion / Atlassian' },
      { fr: 'Obsidian / Office', en: 'Obsidian / Office' },
      { fr: 'Tableau / GA / GTM', en: 'Tableau / GA / GTM' },
      { fr: 'Gcloud / Sentry', en: 'Gcloud / Sentry' },
      { fr: 'Cursor / Warp', en: 'Cursor / Warp' },
    ],
  },
];

export const schemaKnowsAbout: Bilingual[] = [
  { fr: 'Stratégie produit', en: 'Product strategy' },
  { fr: 'Roadmap et discovery', en: 'Roadmap and discovery' },
  { fr: 'Expérience utilisateur', en: 'User experience' },
  { fr: 'Gestion d\'équipe et delivery', en: 'Team management and delivery' },
  { fr: 'Optimisation de la conversion (CRO)', en: 'Conversion optimization (CRO)' },
  { fr: 'Infrastructure et stack technique', en: 'Technical infrastructure and stack' },
];

export interface Publication {
  title: string;
  url: string;
  description: {
    fr: string;
    en: string;
  };
}

export const publications: Publication[] = [
  {
    title: 'LeLynx — Quote Page Auto (PDF)',
    url: '/publications/CaseStudy-LeLynx-QuotePageAuto.pdf',
    description: {
      fr: '+19%. Étude de cas sur l\'optimisation de la page de devis auto assurance.',
      en: '+19%. Case study on auto insurance quote page optimization.',
    },
  },
  {
    title: 'Nature & Découvertes (PDF)',
    url: '/publications/CaseStudy-NatureEtDecouvertes.pdf',
    description: {
      fr: '+6.5%. Étude de cas sur l\'optimisation pour Nature & Découvertes.',
      en: '+6.5%. Case study on optimization for Nature & Découvertes.',
    },
  },
  {
    title: 'EDF ENR (PDF)',
    url: '/publications/Case-study-EDFENR.pdf',
    description: {
      fr: '+19%. Étude de cas sur l\'optimisation pour EDF ENR (énergies renouvelables).',
      en: '+19%. Case study on optimization for EDF ENR (renewable energy).',
    },
  },
  {
    title: 'Best Western — Checkout (PDF)',
    url: '/publications/Case-Study-Best-Western-Checkout.pdf',
    description: {
      fr: '+9% tunnel de réservation. Étude de cas sur l\'optimisation du tunnel de réservation Best Western.',
      en: '+9% booking funnel. Case study on Best Western booking funnel optimization.',
    },
  },
  {
    title: 'Best Western — Fiche produit (PDF)',
    url: '/publications/CaseStudy-Bestwestern-fiche_produit.pdf',
    description: {
      fr: '+7% fiches produit. Étude de cas sur l\'optimisation des fiches produit Best Western.',
      en: '+7% product page optimization.',
    },
  },
  {
    title: 'Best Western (PDF)',
    url: '/publications/CaseStudy-BestWestern.pdf',
    description: {
      fr: '+30% tablettes. Étude de cas sur l\'optimisation pour Best Western.',
      en: '+30% tablets. Case study on optimization for Best Western.',
    },
  },
  {
    title: 'Aramis Auto (PDF)',
    url: '/publications/CaseStudy-AramisAuto-fr.pdf',
    description: {
      fr: '+7%. Étude de cas sur l\'optimisation pour Aramis Auto (achat de véhicules d\'occasion).',
      en: '+7%. Case study on optimization for Aramis Auto (used car sales).',
    },
  },
];

export interface Project {
  title: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  longDescription?: Bilingual;
  paragraphs?: Bilingual[];
  slug: string;
  url: string;
  category: 'data' | 'tech' | 'ux' | 'product';
  year?: number;
  images?: string[];
}

export const projects: Project[] = [
  {
    title: {
      fr: 'SustainSoft',
      en: 'SustainSoft',
    },
    description: {
      fr: 'CPTO du projet SustainSoft, un outil de comptabilité extra-financière pour les entreprises.',
      en: 'CPTO of the SustainSoft project, an extra-financial accounting tool for companies.',
    },
    longDescription: {
      fr: 'CPTO du projet SustainSoft, un outil de comptabilité extra-financière pour les entreprises. Seul associé ayant une expérience dans la tech, j\'ai créé l\'ensemble du produit, de l\'infra, du front-end, du back-end, de la DB, du CI/CD, etc.',
      en: 'CPTO of the SustainSoft project, an extra-financial accounting tool for companies. The goal was to create an extra-financial accounting tool for companies. The tool allows managing extra-financial transactions and importing them into the accounting.',
    },
    paragraphs: [
      {
        fr: 'J\'ai fondé SustainSoft avec 2 associés. Nous sommes alumni Techstars Paris 2022, avons levé un seed et comptons aujourd\'hui plus de 100 clients. J\'ai siègé au board en tant que CPTO.',
        en: 'I founded SustainSoft with 2 co-founders. We are Techstars Paris 2022 alumni, raised a seed round and have over 100 customers today. I sit on the board as the product representative.',
      },
      {
        fr: 'Seul associé ayant une expérience dans la tech, j’ai créé l’ensemble du produit from scratch : UX, UI, principes fondamentaux et fonctionnels, infra, front-end, back-end, base de données, CI/CD, auth, etc.',
        en: 'As the only co-founder with a tech background, I built the entire product from scratch: infra, front-end, back-end, database, CI/CD, auth, etc. I then recruited and managed the tech and product team.',
      },
      {
        fr: 'Très formateur puisqu\'il s\'agissait de la première fois que je construisais un produit seul ayant vocation à être vendu. J’ai ensuite recruté et managé l’équipe tech et produit.',
        en: 'Very formative since it was the first time I built a product alone with the intention of being sold. I then recruited and managed the tech and product team.',
      },
      {
        fr: 'Pour présenter rapidement le produit, SustainSoft est un outil de comptabilité extra-financière pour les entreprises. L’objectif était de créer un outil permettant de gérer les écritures extra-financières afin de publier des états financiers transparents.',
        en: 'To briefly present the product: SustainSoft is an extra-financial accounting tool for companies. The goal was to create a tool to manage extra-financial entries and publish transparent financial statements.',
      },
      {
        fr:"J\'ai voulu l\'interface comme étant une version spécialisée 'Notion like' afin de gérer le brouillard quant à notre business model au lancement du projet. Le principe de blocks, d'éléments et de documents permettait d'anticiper et tester plusieurs frameworks / certifications sans avoir à redévelopper à chaque fois de nouvelles fonctionnalités.",
        en: "I wanted the interface to be a 'Notion like' version to manage the ambiguity about our business model at the launch of the project. The principle of blocks and documents allowed to anticipate and test several frameworks / certifications without having to redevelop new features each time.",
      },
      {
        fr: 'Disclaimer : Il ne s\'agit pas ci-dessous des screenshots du produit tel qu\'il est aujourd\'hui mais d\'anciennes maquettes et captures d\'écran pour des raisons de confidentialité.',
        en: 'Disclaimer: The screenshots below are not of the product as it is today but of old mockups and screenshots for reasons of confidentiality.',
      },
    ],
    slug: 'sustainsoft',
    url: '/projects/sustainsoft.html',
    category: 'product',
    images: [
      '/images/projects/sustainsoft/Sustainsoft.jpg',
      '/images/projects/sustainsoft/Desktop - 55.jpg',
      '/images/projects/sustainsoft/Questions - Détail.jpg',
      '/images/projects/sustainsoft/Action - Détails.jpg',
      '/images/projects/sustainsoft/Document - Rich Text - Add After - Search type to insert.jpg',
    ],
  },
  {
    title: {
      fr: 'Hip Hop Featurings (2018)',
      en: 'Hip Hop Featurings (2018)',
    },
    description: {
      fr: 'Visualisation interactive d\'un graphe de 70K artistes et 75K featurings dans le hip-hop.',
      en: 'Interactive visualization of a graph with 70K artists and 75K featurings in hip-hop.',
    },
    longDescription: {
      fr: 'Visualisation interactive d\'un graphe de 70K artistes et 75K featurings dans le hip-hop. Les données ont été scrapées sur last.fm. L\'interface avait été faite en utilisant Sigma.js.',
      en: 'Interactive visualization of a graph with 70K artists and 75K featurings in hip-hop. Data was scraped from last.fm. The interface was built with Sigma.js.',
    },
    slug: 'hiphopfeaturings',
    url: '/projects/hiphopfeaturings.html',
    category: 'data',
    year: 2018,
  },
  {
    title: {
      fr: 'Baseball Score Calendar (2017)',
      en: 'Baseball Score Calendar (2017)',
    },
    description: {
      fr: 'Visualisation des scores de baseball par équipe de 1921 à 2016 en format calendar.',
      en: 'Baseball team scores visualization from 1921 to 2016 in calendar format.',
    },
    longDescription: {
      fr: 'Visualisation des scores de baseball par équipe de 1921 à 2016 en format calendar. L\'objectif était d\'apprendre react et d3.',
      en: 'Baseball team scores visualization from 1921 to 2016 in calendar format. The goal was to learn React and D3.',
    },
    slug: 'baseball-score-calendar',
    url: '/projects/baseball-score-calendar.html',
    category: 'data',
    year: 2017,
  },
  {
    title: {
      fr: 'Baseball Stats Comparator (2017)',
      en: 'Baseball Stats Comparator (2017)',
    },
    description: {
      fr: 'Comparaison visuelle des statistiques de joueurs de baseball.',
      en: 'Visual comparison of baseball players statistics.',
    },
    longDescription: {
      fr: 'Comparaison visuelle des statistiques de joueurs de baseball. L\'objectif était d\'apprendre react et d3. Un drag and drop sur le graph permet de filtrer les données. Un hover sur les joueurs highlight les statistiques correspondantes.',
      en: 'Visual comparison of baseball players statistics. The goal was to learn React and D3. Drag and drop on the chart filters the data; hovering over players highlights the corresponding statistics.',
    },
    slug: 'baseball-stats-comparator',
    url: '/projects/baseball-stats-comparator.html',
    category: 'data',
    year: 2017,
  },
  {
    title: {
      fr: 'Kriptyq (2019)',
      en: 'Kriptyq (2019)',
    },
    description: {
      fr: 'Projet d\'art génératif de posters à partir de texte client.',
      en: 'Generative posters from client text, real-time representation.',
    },
    longDescription: {
      fr: 'Kriptyq était un projet d\'art génératif commencé avec un ami en 2019. L\'objectif était de produire des posters basés sur un texte rédigé par le client. Le changement de texte impactant les types de représentation en temps réel.',
      en: 'Kriptyq is a project started with a friend in 2019 during the generative art trend, with the goal of producing posters based on text written by the client. The text influenced the types of representation in real time.',
    },
    slug: 'kriptyq',
    url: '/projects/kriptyq.html',
    category: 'tech',
    year: 2019,
    images: ['/images/projects/kriptyq/landing.jpg', '/images/projects/kriptyq/kriptyq-modal.jpg'],
  },
  {
    title: {
      fr: 'Last Metro (2012)',
      en: 'Last Metro (2012)',
    },
    description: {
      fr: 'App vous envoyant une notification de l\'heure du dernier métro et du moment où il faut quitter votre soirée',
      en: 'App that notifies you of the last metro time and when you need to leave to catch it',
    },
    longDescription: {
      fr: "Projet en 2012 issu d'un hackaton entre amis. L'objectif était d'offrir une app permettant de vous prévenir, suivant où vous êtes et où vous voulez rentrer, de l'heure du dernier métro. Un prototype fonctionnel, quelques intérêts de la RATP. Rien de plus.",
      en: "A 2012 project born from a hackathon among friends. The goal was to provide an app that would notify you, based on where you are and where you want to get home, of the time of the last metro. A working prototype, some interest from the RATP. Nothing more.",
    },
    slug: 'last-metro',
    url: '/projects/last-metro.html',
    category: 'product',
    year: 2012,
    images: [
      '/images/projects/lastmetro/1.png',
      '/images/projects/lastmetro/2.png',
      '/images/projects/lastmetro/3.png',
      '/images/projects/lastmetro/4.png',
      '/images/projects/lastmetro/5.png',
    ],
  },
];
