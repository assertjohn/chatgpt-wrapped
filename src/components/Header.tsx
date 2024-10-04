import { Button } from "@/components/ui/button"
import { Github, Lock, Share2, BarChart2 } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-gray-950 text-white pt-16 pb-8 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="absolute top-4 right-4">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-white/10 hover:bg-white/20 hover:text-white text-white border-white/20 transition-colors duration-200"
          >
            <a
              href="https://github.com/assertjohn/chatgpt-wrapped"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <Github className="w-4 h-4 mr-2" />
              View Source
            </a>
          </Button>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          ChatGPT Data Analyzer
        </h1>
        <div className="space-y-4 mb-8">
          <p className="text-xl text-gray-300 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-yellow-400" />
            Visualize your ChatGPT usage history.
          </p>
          <p className="text-xl text-gray-300 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-green-400" />
            All analysis is done locally, ensuring your privacy.
          </p>
          <p className="text-xl text-gray-300 flex items-center">
            <Share2 className="w-5 h-5 mr-2 text-blue-400" />
            Optionally share or{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/1iQIxFqKJepTDkAh0xLQvbIwTgH6811MhOAH-8eeb9Ek/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline mx-1"
            >
              view
            </a>{" "}
            anonymized stats for research.
          </p>
        </div>
        <div className="bg-white/10 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Get Started:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-200">
            <li>
              <a
                href="https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Export your ChatGPT data
              </a> from OpenAI
            </li>
            <li>Upload the conversations.json file below</li>
            <li>View your personal insights</li>
          </ol>
        </div>
      </div>
    </header>
  )
}