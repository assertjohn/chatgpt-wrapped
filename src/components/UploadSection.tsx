import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ExternalLink, Upload } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface UploadSectionProps {
  onFileUpload: (file: File, shareData: boolean) => void;
}

export function UploadSection({ onFileUpload }: UploadSectionProps) {
  const [shareData, setShareData] = useState(true);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0], shareData);
      }
    },
    [onFileUpload, shareData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
    },
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div
        {...getRootProps()}
        className={`w-full max-w-4xl border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={64} className="mx-auto mb-6 text-gray-400" />
        <p className="text-2xl font-semibold mb-2">
          {isDragActive ? "Drop the JSON file here" : "Drag and drop conversations.json file"}
        </p>
        <p className="text-lg text-gray-400">or click to select</p>
      </div>
      <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-4 w-full max-w-4xl">
        <Checkbox
          id="shareData"
          checked={shareData}
          onCheckedChange={(checked) => setShareData(checked as boolean)}
          className="border-gray-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
        />
        <Label htmlFor="shareData" className="text-sm text-gray-300 flex items-center cursor-pointer">
          Share aggregated stats anonymously (no individual messages are saved)
          <a
            href="https://gptwrapped-data-raw.husaria.dev//f9c2f9945c1b0c40688b681524525ee8eefe33154f411112e23bfaea29bd370d.json"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-400 hover:text-blue-300 inline-flex items-center"
          >
            <ExternalLink size={14} className="mr-1" />
            View example
          </a>
        </Label>
      </div>
    </div>
  );
}
