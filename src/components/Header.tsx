import { Button } from "@/components/ui/button"
import { Github } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-black bg-opacity-50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-12 space-y-4 text-center">
        <h1 className="text-6xl font-bold mb-4">ChatGPT Wrapped</h1>
        <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
          Visualize your ChatGPT usage patterns.
        </p>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          To get started, export your ChatGPT data from the OpenAI website and upload the conversation.json file below. Your data all stays local. You can verify the source code below.
        </p>
        <Button
          asChild
          variant="outline"
          className="bg-white/10 hover:bg-white/20 hover:text-white text-white border-white/20"
        >
          <a
            href="https://github.com/assertjohn/chatgpt-wrapped "
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4 mr-2" />
            View Source
          </a>
        </Button>
      </div>
    </header>
  )
}