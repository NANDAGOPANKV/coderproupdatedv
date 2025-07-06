import { useState } from 'react';
import { Upload, Github, Folder, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface FileUploaderProps {
  onAnalysisStart: (data: any) => void;
  isAnalyzing: boolean;
  onRepoSet?: (url: string) => void; // ✅ Optional prop
}

export const FileUploader = ({
  onAnalysisStart,
  isAnalyzing,
  onRepoSet,
}: FileUploaderProps) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('react');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'github'>('file');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.zip')) {
      toast.error('Please upload a .zip file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    toast.success('File uploaded successfully!');
    onAnalysisStart({
      name: file.name.replace('.zip', ''),
      framework: selectedFramework,
      source: 'file',
    });
  };

  const handleGithubSubmit = () => {
    if (!githubUrl) {
      toast.error('Please enter a GitHub URL');
      return;
    }

    const githubPattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+\/?$/;
    if (!githubPattern.test(githubUrl)) {
      toast.error('Please enter a valid GitHub repository URL');
      return;
    }

    toast.success('GitHub repository loaded!');
    const repoName = githubUrl.split('/').pop() || 'repository';

    // ✅ Set the repo URL in parent
    onRepoSet?.(githubUrl);

    onAnalysisStart({
      name: repoName,
      framework: selectedFramework,
      source: 'github',
      url: githubUrl,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Method Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-slate-100 rounded-lg">
          {/* <button
            onClick={() => setUploadMethod('file')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${uploadMethod === 'file'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
              }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload File
          </button> */}
          <button
            onClick={() => setUploadMethod('github')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${uploadMethod === 'github'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
              }`}
          >
            <Github className="w-4 h-4 inline mr-2" />
            GitHub URL
          </button>
        </div>
      </div>

      {/* File Upload UI */}
      {/* {uploadMethod === 'file' ? (
        <Card className="border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-8">
            <div
              className={`text-center space-y-4 ${isDragOver ? 'scale-105' : ''
                } transition-transform`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex justify-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${isDragOver ? 'bg-blue-100' : 'bg-slate-100'
                    } transition-colors`}
                >
                  <Folder
                    className={`w-8 h-8 ${isDragOver ? 'text-blue-600' : 'text-slate-600'
                      }`}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Upload Frontend Repository
                </h3>
                <p className="text-slate-600 mb-4">
                  Drag and drop your .zip file here, or click to browse
                </p>

                <input
                  type="file"
                  accept=".zip"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileUpload(e.target.files[0])
                  }
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" asChild className="cursor-pointer">
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Browse Files
                    </span>
                  </Button>
                </label>
              </div>

              <p className="text-xs text-slate-500">
                Maximum file size: 50MB • Supported format: .zip
              </p>
            </div>
          </CardContent>
        </Card>
      ) : ( */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Link2 className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                GitHub Repository
              </h3>
              <p className="text-sm text-red-700">
                Enter the URL of your public repository
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="https://github.com/username/repository"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="font-mono text-sm"
            />

            <Button
              onClick={handleGithubSubmit}
              disabled={isAnalyzing}
              className="w-full"
            >
              <Github className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Repository'}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* )} */}

      {/* Framework Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">
                Framework Detection
              </h3>
              <p className="text-sm text-slate-600">
                Help us understand your frontend better (optional)
              </p>
            </div>
            <Select
              value={selectedFramework}
              onValueChange={setSelectedFramework}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="vue">Vue.js</SelectItem>
                <SelectItem value="angular">Angular</SelectItem>
                <SelectItem value="svelte">Svelte</SelectItem>
                <SelectItem value="vanilla">Vanilla JS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
