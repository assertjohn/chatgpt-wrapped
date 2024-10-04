'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { UploadSection } from '@/components/UploadSection'
import { Report } from '@/components/Report'
import { analyzeData } from './utils'
import { Stats } from './utils'

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        const analyzedStats = analyzeData(json)
        setStats(analyzedStats)
        setError(null)
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {!stats && !error && <UploadSection onFileUpload={handleFileUpload} />}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-100 p-4 rounded-lg mt-8">
            {error}
          </div>
        )}
        {stats && <Report stats={stats} onClear={handleClear} />}
      </main>
    </div>
  )
}