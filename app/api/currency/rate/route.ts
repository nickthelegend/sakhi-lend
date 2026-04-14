import { NextResponse } from 'next/server'

let cachedRate: number | null = null
let lastFetch: number = 0
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

export async function GET() {
  const now = Date.now()
  
  if (cachedRate && (now - lastFetch < CACHE_DURATION)) {
    return NextResponse.json({ rate: cachedRate, source: 'cache' })
  }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD')
    const data = await res.json()
    
    if (data.result === 'success' && data.rates && data.rates.INR) {
      cachedRate = data.rates.INR
      lastFetch = now
      return NextResponse.json({ rate: cachedRate, source: 'api' })
    }
    
    throw new Error('Failed to fetch rate')
  } catch (error) {
    console.error('[Currency API Error]', error)
    // Fallback rate if API fails
    return NextResponse.json({ rate: 83.5, source: 'fallback' })
  }
}
