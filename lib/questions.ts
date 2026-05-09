export interface Question {
  id: string
  text: string
  options: string[]
}

export const QUESTIONS: Question[] = [
  {
    id: 'target_user_persona',
    text: 'Siapa target pengguna utama produk ini?',
    options: [
      'Pelajar / Mahasiswa',
      'Profesional / Karyawan',
      'Developer / Engineer',
      'Pemilik bisnis / UMKM',
      'Enterprise / Korporat',
      'Masyarakat umum',
    ],
  },
  {
    id: 'target_audience',
    text: 'Model bisnis produk ini?',
    options: ['Konsumen umum (B2C)', 'Bisnis & Tim (B2B)', 'Developer (B2D)', 'Internal tool perusahaan'],
  },
  {
    id: 'product_type',
    text: 'Apa tipe produknya?',
    options: ['Web app', 'Mobile app', 'Website statis', 'API', 'Tool CLI'],
  },
  {
    id: 'frontend_tech',
    text: 'Teknologi frontend apa yang ingin dipakai?',
    options: ['React', 'Next.js', 'Vue', 'Svelte', 'Vanilla HTML/CSS/JS', 'Terserah AI'],
  },
  {
    id: 'backend_tech',
    text: 'Teknologi backend apa yang ingin dipakai?',
    options: ['Node.js', 'Python (FastAPI/Django)', 'Go', 'Serverless (Vercel/Netlify)', 'Tidak butuh backend'],
  },
  {
    id: 'database',
    text: 'Database apa yang diinginkan?',
    options: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Supabase', 'Firebase', 'Tidak butuh DB'],
  },
  {
    id: 'auth',
    text: 'Apakah perlu autentikasi user?',
    options: ['Ya, login email/password', 'Ya, social login (Google/GitHub)', 'Tidak perlu'],
  },
  {
    id: 'scale',
    text: 'Skala proyek ini?',
    options: ['MVP', 'Prototype cepat', 'Produk jangka panjang'],
  },
  {
    id: 'deployment',
    text: 'Siapa yang akan men-deploy?',
    options: ['Vercel', 'Railway', 'VPS', 'Docker', 'AWS/GCP/Azure', 'Tidak tahu'],
  },
]
