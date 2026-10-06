/*
  Copy statis situs publik. Data dinamis (nama, role, proyek, skill, kontak)
  datang dari API lewat SiteContext — file ini hanya untuk teks yang tidak ada di admin.
*/

export const CLOCK_TIMEZONE = 'Asia/Jakarta'
export const CLOCK_LABEL = 'Jakarta'

export const HEADER_LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Projects', href: '#projects' },
]

export const MENU_LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact'  },
]

/* Section About: 4 kata per slide (baris 1: w1 w2, baris 2: w3 w4 — w3 berwarna ink) */
export const ABOUT_HEADLINES = [
  ['Clean', 'Scalable', 'Backend', 'Systems'],
  ['Clean', 'Intuitive', 'UI/UX', 'Design'],
  ['Always', 'Learning', 'Always', 'Shipping'],
]

export const ABOUT_BADGE = {
  index: '#01',
  title: 'Built end to end',
}

export const EXPERTISE = [
  { index: '01', name: 'Backend Development',    description: 'Laravel, ASP.NET (C#), and Node.js — business logic, APIs, and clean architecture.' },
  { index: '02', name: 'Frontend & UI/UX',       description: 'Responsive React and Tailwind interfaces, designed in Figma with care for the details.' },
  { index: '03', name: 'Database Design',        description: 'Relational schemas and queries in PostgreSQL and SQL Server.' },
  { index: '04', name: 'Linux & Infrastructure', description: 'Ubuntu and Windows Server, Hyper-V and Proxmox, Docker, Nginx, and SSH.' },
  { index: '05', name: 'Enterprise Systems',     description: 'LDAP authentication, approval workflows, and IT asset management.' },
]

export const PROJECTS_INTRO = {
  lines: ['Selected', 'Real-World', 'Projects'],
  body: 'Systems built for real teams and real workflows — from internal enterprise tools to self-hosted infrastructure.',
}

/* Sumber: CV terbaru (Okt 2026) */
export const HIGHLIGHTS = [
  {
    quote: 'Built the login, asset inventory, approval, and reporting modules of an enterprise IT Asset Management system with ASP.NET (C#) and LDAP.',
    image: 'lotte',
    name: 'PT Lotte Chemical Titan Nusantara',
    role: 'IT Intern · Web Developer · Jun–Jul 2026',
  },
  {
    quote: 'Developed and deployed AppLoanTools V1, a loan warehouse management system built with Laravel, PostgreSQL, and LDAP — used in production by internal teams.',
    name: 'PT Lestari Banten Energi',
    role: 'IT Intern · Web Developer · Jan–Apr 2026',
  },
  {
    quote: 'Studying Information Systems while building enterprise applications and running my own virtualized infrastructure.',
    name: 'Telkom University',
    role: 'B.Sc. Information Systems · GPA 3.38/4.00',
  },
  {
    quote: 'Second Place Winner in the Essay Category at Mini Contest InovAction 2025.',
    name: 'InovAction 2025',
    role: 'Essay Category · 2nd Place',
  },
  {
    quote: 'Led and supervised 5 work programs across 5 divisions, coordinating teams and resolving conflicts to keep execution on track.',
    name: 'Bantenese Telkom University',
    role: 'Vice President · 2025–2026',
  },
  {
    quote: 'Developed sponsorship proposals and managed relationships with sponsors, securing partnerships that supported event execution.',
    name: 'SPACES 2024',
    role: 'Head of Sponsorship Division',
  },
]
