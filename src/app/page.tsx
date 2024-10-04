'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Stats, analyzeData, prepareChartData, prepareChatLengthHistogram } from './utils'
import { format } from 'date-fns'

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
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
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    multiple: false
  })

  const handleClear = () => {
    setStats(null)
    setError(null)
  }

  const totalMessages = stats ? Object.values(stats.modelCounts).reduce((sum, count) => sum + count, 0) : 0

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>ChatGPT Data Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats && !error ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the JSON file here...</p>
              ) : (
                <p>Drag and drop a JSON file here, or click to select a file</p>
              )}
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard title="User Messages" value={stats.userMessageCount} />
                <StatCard title="Assistant Messages" value={stats.assistantMessageCount} />
                <StatCard title="User Characters" value={stats.userCharCount} />
                <StatCard title="Assistant Characters" value={stats.assistantCharCount} />
                <StatCard title="Conversations" value={stats.conversationCount} />
                <StatCard title="Models Used" value={Object.keys(stats.modelCounts).length} />
                <StatCard title="First Message Sent" value={format(stats.firstMessageDate, 'MMM d, yyyy')} />
                <StatCard title="Longest Chat" value={stats.longestChat} />
                <StatCard title="Avg Messages/Day" value={stats.averageMessagesPerDay.toFixed(1)} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Messages per Model</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead className="text-right">Message Count</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(stats.modelCounts)
                      .sort(([, a], [, b]) => b - a)
                      .map(([model, count]) => (
                        <TableRow key={model}>
                          <TableCell className="font-medium">{model}</TableCell>
                          <TableCell className="text-right">{count}</TableCell>
                          <TableCell className="text-right">
                            {((count / totalMessages) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Weekly Message Count by Model</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={prepareChartData(stats)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <XAxis 
                      dataKey="week" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={3}
                      tickFormatter={(value) => value.split(',')[0]}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(stats.modelCounts).map((model, index) => (
                      <Bar key={model} dataKey={model} stackId="a" fill={`hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Chat Length Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepareChatLengthHistogram(stats.chatLengths)} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <XAxis 
                      dataKey="range" 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(200, 70%, 50%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {(stats || error) && (
            <Button onClick={handleClear}>Clear and Try Again</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  )
}