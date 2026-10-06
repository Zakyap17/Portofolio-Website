/*
  Gambar bawaan situs publik.
  - heroPhoto / heroReveal → latar hero. Saat ini foto stok Unsplash oleh Jakub Żerdzicki
      (lisensi Unsplash, bebas dipakai). Foto meja kerja milik sendiri tersimpan di hero-own-desk.jpg. `heroReveal` opsional:
      jika undefined, gambar kedua (yang muncul di jejak kursor) dibuat otomatis dari foto yang sama dengan tint biru.
  - portraitPhoto → foto portrait untuk kartu & carousel (fallback bila admin belum upload).
*/
import hero from './hero.jpg'
import portrait from './Photo.jpeg'
import lotte from './lotte-team.jpg'

export const heroPhoto = hero
export const heroReveal = undefined // otomatis: versi tint biru dari foto yang sama
export const portraitPhoto = portrait

/* Foto kecil untuk kartu Highlights (kunci = field `image` di content/site.js) */
export const highlightImages = { lotte }
