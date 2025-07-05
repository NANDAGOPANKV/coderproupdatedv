import { useState } from 'react';
import {
  Zap, Download, Cloud, Code2, Database, Shield, Mail, CheckCircle, ExternalLink,
  FolderPlus, FolderMinus, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProjectData } from '@/pages/Index';
import { toast } from 'sonner';

interface BackendGeneratorProps {
  projectData: ProjectData;
  onGenerationComplete: () => void;
  isComplete: boolean;
}

type FileNode = {
  name: string;
  children?: FileNode[];
  isFolder: boolean;
};

const renderFileTree = (
  node: FileNode,
  path: string,
  expandedFolders: Record<string, boolean>,
  setExpandedFolders: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
): React.ReactNode => {
  const fullPath = `${path}/${node.name}`;
  if (node.isFolder) {
    const isOpen = expandedFolders[fullPath] ?? false;
    return (
      <div key={fullPath} style={{ marginLeft: path !== 'backend' ? 16 : 0 }}>
        <div
          className="flex items-center cursor-pointer hover:text-purple-600"
          onClick={() => setExpandedFolders(prev => ({ ...prev, [fullPath]: !isOpen }))}
        >
          {isOpen ? <FolderMinus className="w-4 h-4 mr-2" /> : <FolderPlus className="w-4 h-4 mr-2" />}
          <span className="font-medium">{node.name}</span>
        </div>
        {isOpen && node.children?.map(child =>
          renderFileTree(child, fullPath, expandedFolders, setExpandedFolders)
        )}
      </div>
    );
  }

  return (
    <div key={fullPath} style={{ marginLeft: 16 }} className="flex items-center text-slate-700">
      <FileText className="w-4 h-4 mr-2" />
      {node.name}
    </div>
  );
};

export const BackendGenerator = ({ projectData, onGenerationComplete, isComplete }: BackendGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedStructure, setGeneratedStructure] = useState<FileNode | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null); // ✅

  const generationSteps = [
    { icon: Database, label: 'Creating database models', progress: 20 },
    { icon: Shield, label: 'Setting up authentication', progress: 40 },
    { icon: Code2, label: 'Generating API routes', progress: 60 },
    { icon: Mail, label: 'Configuring email service', progress: 80 },
    { icon: CheckCircle, label: 'Finalizing backend', progress: 100 }
  ];

  const expandAllFolders = (node: FileNode, path = 'backend', result: Record<string, boolean> = {}) => {
    const fullPath = `${path}/${node.name}`;
    if (node.isFolder) {
      result[fullPath] = true;
      node.children?.forEach(child => expandAllFolders(child, fullPath, result));
    }
    return result;
  };

  const buildFileTree = (paths: string[]): FileNode => {
    const root: FileNode = { name: 'backend', isFolder: true, children: [] };

    paths.forEach(fullPath => {
      const parts = fullPath.replace(/^backend\//, '').split('/');
      let current = root;

      parts.forEach((part, index) => {
        const isFolder = index < parts.length - 1;
        let existing = current.children?.find(child => child.name === part && child.isFolder === isFolder);
        if (!existing) {
          existing = { name: part, isFolder, ...(isFolder ? { children: [] } : {}) };
          current.children?.push(existing);
        }
        if (isFolder) current = existing;
      });
    });

    return root;
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setGenerationProgress(0);
      setCurrentStep('Sending summary to AI model...');

      const res = await fetch('https://susi-backend.onrender.com/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiSummary: projectData.aiSummary }),
      });

      if (!res.ok) throw new Error('Failed to generate backend');

      const data = await res.json();
      const filePaths = data.backendCode
        .match(/### (backend\/[^\n]*)/g)
        ?.map(line => line.replace(/^### /, '').trim()) || [];

      const tree = buildFileTree(filePaths);
      setGeneratedStructure(tree);
      setExpandedFolders(expandAllFolders(tree));
      setDownloadUrl(data.downloadUrl || null); // ✅

      for (const step of generationSteps) {
        setCurrentStep(step.label);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setGenerationProgress(step.progress);
      }

      toast.success('✅ Backend generated successfully!');
      onGenerationComplete();
    } catch (err) {
      console.error('❌ Backend generation failed:', err);
      toast.error('Backend generation failed. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadUrl) {
      toast.error('❌ No download link available.');
      return;
    }

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'backend.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('✅ Backend ZIP downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to download backend ZIP');
    }
  };

  const handleDeploy = () => {
    toast.info('Redirecting to Railway for deployment...');
    // Optionally, add `window.open('https://railway.app/new', '_blank')`
  };


  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          Backend Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isGenerating && !isComplete && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto">
              <Code2 className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Ready to Generate Your Backend
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Based on your frontend analysis, we'll create a complete backend with all necessary APIs,
                authentication, and database models.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: Database, label: 'Database Models' },
                  { icon: Shield, label: 'Authentication' },
                  { icon: Code2, label: 'API Routes' },
                  { icon: Mail, label: 'Email Service' }
                ].map((feature, index) => (
                  <div key={index} className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                    <feature.icon className="w-6 h-6 text-slate-600 mb-2" />
                    <span className="text-xs text-slate-600 text-center">{feature.label}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleGenerate}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Zap className="w-5 h-5 mr-2" />
                Generate Backend Code
              </Button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="py-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Generating Your Backend
              </h3>
              <p className="text-slate-600">
                Please wait while we create your custom backend solution...
              </p>
            </div>

            <div className="space-y-4">
              <Progress value={generationProgress} className="h-2" />
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                {currentStep}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generationSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${generationProgress >= step.progress
                    ? 'bg-green-50 border border-green-200'
                    : generationProgress >= step.progress - 20
                      ? 'bg-purple-50 border border-purple-200'
                      : 'bg-slate-50 border border-slate-200'
                    }`}
                >
                  <step.icon
                    className={`w-5 h-5 ${generationProgress >= step.progress
                      ? 'text-green-600'
                      : generationProgress >= step.progress - 20
                        ? 'text-purple-600'
                        : 'text-slate-400'
                      }`}
                  />
                  <span
                    className={`text-sm ${generationProgress >= step.progress
                      ? 'text-green-800 font-medium'
                      : generationProgress >= step.progress - 20
                        ? 'text-purple-800'
                        : 'text-slate-600'
                      }`}
                  >
                    {step.label}
                  </span>
                  {generationProgress >= step.progress && (
                    <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isComplete && (
          <div className="py-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Backend Generated Successfully!
              </h3>
              <p className="text-slate-600 mb-6">
                Your complete backend is ready with all the necessary components.
              </p>
            </div>

            {/* File Structure */}
            <Card className="bg-slate-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-slate-800 mb-3">Generated Backend Structure:</h4>
                <div className="font-mono text-sm space-y-1 text-slate-700">
                  {generatedStructure ? (
                    renderFileTree(generatedStructure, 'backend', expandedFolders, setExpandedFolders)
                  ) : (
                    <div className="text-slate-400 text-sm">Structure not available</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Features Generated:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-800">JWT Authentication</Badge>
                <Badge className="bg-green-100 text-green-800">User Management</Badge>
                <Badge className="bg-purple-100 text-purple-800">Email Integration</Badge>
                <Badge className="bg-orange-100 text-orange-800">Input Validation</Badge>
                <Badge className="bg-pink-100 text-pink-800">Error Handling</Badge>
                <Badge className="bg-indigo-100 text-indigo-800">CORS Setup</Badge>
              </div>
            </div>

            {/* Setup Instructions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Getting Started Instructions
                </h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <p className="font-medium">After downloading, follow these steps:</p>
                  <div className="bg-white rounded p-3 font-mono text-xs space-y-1">
                    <div>1. Extract the ZIP file</div>
                    <div>2. cd backend</div>
                    <div>3. npm install</div>
                    <div>4. cp .env.example .env</div>
                    <div>5. Configure your environment variables</div>
                    <div>6. npm start</div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    📝 Don't forget to set up your database connection and email service in the .env file
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Final Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Backend ZIP
              </Button>
              <Button
                onClick={handleDeploy}
                variant="outline"
                className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Cloud className="w-4 h-4 mr-2" />
                Deploy to Railway
              </Button>
              <Button
                variant="ghost"
                className="flex-1 text-purple-700 hover:bg-purple-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Preview
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

  );
};
