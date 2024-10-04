'use client'

import { useState, useRef } from 'react'
import { Header } from '@/components/Header'
import { UploadSection } from '@/components/UploadSection'
import { Report } from '@/components/Report'
import { analyzeData } from './utils'
import { Stats } from './utils'
import { shareAnonymizedData } from '@/lib/data-sharing'
import "@/lib/supress-warnings"


export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  const handleFileUpload = async (file: File, shareData: boolean) => {
    const reader = new FileReader()

    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        const analyzedStats = analyzeData(json)
        setStats(analyzedStats)
        setError(null)

        if (shareData) {
          await shareAnonymizedData(analyzedStats)
        }

        // Scroll to the report after a short delay to ensure rendering is complete
        setTimeout(() => {
          reportRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } catch (error) {
        console.error('Error parsing JSON:', error)
        setStats(null)
        setError('Error parsing JSON file. Please make sure it\'s a valid ChatGPT export.')
      }
    }

    reader.readAsText(file)
  }

  const handleClear = () => {
    setStats(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {!stats && !error && <UploadSection onFileUpload={handleFileUpload} />}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-100 p-4 rounded-lg mt-8">
            {error}
          </div>
        )}
        {stats && (
          <div ref={reportRef}>
            <Report stats={stats} onClear={handleClear} />
          </div>
        )}
      </main>
    </div>
  )
}