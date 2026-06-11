export type QuranVerse = {
  text: string
  surah: string
  numberInSurah: number
  ref: string
}

// Base API endpoint
const BASE_URL = 'https://api.alquran.cloud/v1'

/**
 * Fetch a random Quran verse with English translation
 */
export async function getRandomVerse(): Promise<QuranVerse> {
  const res = await fetch(`${BASE_URL}/ayah/random/en.asad`)

  if (!res.ok) {
    throw new Error('Failed to fetch Quran verse')
  }

  const data = await res.json()

  const verse = data.data

  return {
    text: verse.text,
    surah: verse.surah.englishName,
    numberInSurah: verse.numberInSurah,
    ref: `${verse.surah.englishName} ${verse.numberInSurah}`,
  }
}