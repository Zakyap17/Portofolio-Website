/*
  Data situs — edit file ini untuk memperbarui konten (tanpa admin panel / database).

  - personal : profil, kontak, dan link
  - skills   : chip tech stack (warna = warna titik)
  - projects : daftar proyek. Urutan = urutan tampil (2 pertama jadi kartu utama).
               Untuk menambah gambar proyek: taruh file di src/assets/images/projects/,
               lalu `import shot from '../assets/images/projects/nama.jpg'` dan isi `images: [shot]`.
*/

import lotteMobileLogin from '../assets/images/projects/lotte-mobile-login.webp'
import lotteDashboard from '../assets/images/projects/lotte-dashboard.webp'
import lotteAssets from '../assets/images/projects/lotte-assets.webp'
import lotteApproval from '../assets/images/projects/lotte-approval.webp'
import lotteLogin from '../assets/images/projects/lotte-login.webp'
import lotteHandheld from '../assets/images/projects/lotte-handheld.webp'
import lestariV2Poster from '../assets/images/projects/lestari-v2-poster.webp'
import etaniHome from '../assets/images/projects/etani-home.webp'
import etaniSchedule from '../assets/images/projects/etani-schedule.webp'
import etaniAnalysis from '../assets/images/projects/etani-analysis.webp'
import etaniAi from '../assets/images/projects/etani-ai.webp'
import lestariDashboard from '../assets/images/projects/lestari-dashboard.webp'
import lestariLoans from '../assets/images/projects/lestari-loans.webp'
import lestariTools from '../assets/images/projects/lestari-tools.webp'
import lestariLogin from '../assets/images/projects/lestari-login.webp'
import lestariEmail from '../assets/images/projects/lestari-email.webp'

export const personal = {
  name: 'Zaky Aprilian',
  role: 'Full-Stack Developer',
  description:
    'Information Systems student at Telkom University with hands-on experience building enterprise applications in the manufacturing and energy industries. Skilled across the stack — Laravel and ASP.NET backends, PostgreSQL and SQL Server, React and Tailwind interfaces, and Linux server administration — with a strong interest in UI/UX design.',
  yearsExp: '1+',
  linkedin: 'https://linkedin.com/in/zaky-aprilian-38113529b',
  email: 'zakyaprilian17@gmail.com',
  github: '',
  cvUrl: '/cv/ZAKY_APRILIAN_CV.pdf',
  photo: null, // null → pakai portraitPhoto dari src/assets/images/index.js
}

export const skills = [
  { id: 1,  label: 'Laravel',    color: '#FF2D20' },
  { id: 2,  label: 'ASP.NET',    color: '#512BD4' },
  { id: 3,  label: 'PostgreSQL', color: '#336791' },
  { id: 4,  label: 'Linux',      color: '#FCC624' },
  { id: 5,  label: 'Node.js',    color: '#68A063' },
  { id: 6,  label: 'C#',         color: '#9B4F96' },
  { id: 7,  label: 'PHP',        color: '#7B7FB5' },
  { id: 8,  label: 'SQL Server', color: '#CC2927' },
  { id: 9,  label: 'Docker',     color: '#2496ED' },
  { id: 10, label: 'Nginx',      color: '#009639' },
  { id: 11, label: 'Proxmox',    color: '#E57000' },
  { id: 12, label: 'Git',        color: '#F05032' },
  { id: 13, label: 'React',      color: '#61DAFB' },
  { id: 14, label: 'Tailwind CSS', color: '#38BDF8' },
  { id: 15, label: 'JavaScript', color: '#F7DF1E' },
  { id: 16, label: 'Figma',      color: '#F24E1E' },
  { id: 17, label: 'Flutter',    color: '#02569B' },
]

export const projects = [
  {
    id: 1,
    title: 'IT Asset Management System',
    company: 'PT Lotte Chemical Titan Nusantara',
    year: '2026',
    description:
      'Enterprise web application for IT asset tracking — inventory, goods receive and issue, asset transfer, approval workflows, QR asset labels, stock audits, and reporting — with LDAP login using corporate credentials. Integrated with a Honeywell EDA51 handheld app for goods receive, goods issue, transfer, stock audits, and asset lookup.',
    tech: ['ASP.NET Framework 4', 'C#', 'LDAP', 'Honeywell EDA51'],
    github: null,
    demo: null,
    highlight: lotteHandheld, // gambar untuk carousel About (default: images[0])
    images: [lotteMobileLogin, lotteHandheld, lotteDashboard, lotteAssets, lotteApproval, lotteLogin],
  },
  {
    id: 2,
    title: 'AppLoanTools V1',
    company: 'PT Lestari Banten Energi',
    year: '2026',
    description:
      'Internal web application for warehouse asset tracking with borrowing requests, approvals, and return tracking — deployed to production with LDAP authentication.',
    tech: ['Laravel', 'PostgreSQL', 'LDAP', 'Ubuntu LTS'],
    github: null,
    demo: null,
    images: [lestariLogin, lestariDashboard, lestariLoans, lestariTools, lestariEmail],
  },
  {
    id: 4,
    title: 'AppLoanTools V2',
    company: 'PT Lestari Banten Energi',
    year: '',
    status: 'coming-soon', // tampil dengan label "Coming soon"
    description:
      'The next version of the loan tools system, developed for the Material Management Department — RFID, handheld-based, and real-time.',
    tech: ['RFID', 'Handheld', 'Real-time'],
    github: null,
    demo: null,
    images: [lestariV2Poster],
  },
  {
    id: 5,
    title: 'E-Tani',
    company: '',
    year: '',
    label: 'Volunteer team project', // tampil di kartu & modal (opsional)
    layout: 'side', // kartu teks kiri + gambar kanan (cocok untuk screenshot mobile)
    description:
      'A volunteer project built to support farmers in their day-to-day farming. A cross-platform Flutter app (Android and web) that combines satellite GPS and weather data with field planning — daily conditions, weather warnings, hourly forecasts, and per-block task schedules — plus Tani-AI, an assistant that answers questions and diagnoses plants from photos.',
    facts: [
      { label: 'Team', value: '5 developers — 1 UI, 2 frontend, 2 backend' },
      { label: 'My role', value: 'Frontend and backend development, through to server deployment' },
      { label: 'Users', value: 'Farmers in Parongpong, Lembang' },
    ],
    tech: ['Flutter', 'Android', 'Web', 'GPS', 'AI assistant'],
    github: null,
    demo: null,
    images: [etaniHome, etaniSchedule, etaniAnalysis, etaniAi],
  },
]
