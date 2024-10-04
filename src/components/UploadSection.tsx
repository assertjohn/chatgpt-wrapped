import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'

interface UploadSectionProps {
  onFileUpload: (file: File) => void;
}

export function UploadSection({ onFileUpload }: UploadSectionProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0])
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    multiple: false
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div
        {...getRootProps()}
        className={`w-full max-w-3xl border-4 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={64} className="mx-auto mb-6 text-gray-400" />
        <p className="text-2xl font-semibold mb-2">
          {isDragActive ? 'Drop the JSON file here' : 'Drag and drop conversations.json file'}
        </p>
        <p className="text-lg text-gray-400">
          or click to select
        </p>
      </div>
    </div>
  )
}