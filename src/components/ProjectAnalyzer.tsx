import { useState, useEffect } from 'react';
import {
  File,
  Folder,
  Brain,
  RefreshCw,
  CheckCircle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectData } from '@/pages/Index';

interface ProjectAnalyzerProps {
  projectData: ProjectData | null;
  isAnalyzing: boolean;
  setProjectData: (data: ProjectData) => void;
  setIsAnalyzing: (val: boolean) => void;
}

export const ProjectAnalyzer = ({
  projectData,
  isAnalyzing,
  setProjectData,
  setIsAnalyzing,
}: ProjectAnalyzerProps) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [repoURL, setRepoURL] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (projectData?.structure) {
      const folders = new Set<string>();
      for (const path of projectData.structure) {
        const parts = path.split('/');
        for (let i = 1; i < parts.length; i++) {
          const folderPath = parts.slice(0, i).join('/');
          folders.add(folderPath);
        }
      }

      const defaultOpenState: Record<string, boolean> = {};
      folders.forEach(folder => {
        defaultOpenState[folder] = true;
      });

      setOpenFolders(defaultOpenState);
    }
  }, [projectData?.structure]);

  const toggleFolder = (path: string) => {
    setOpenFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const buildTree = (paths: string[]) => {
    const root: any = {};
    for (const path of paths) {
      const parts = path.split('/');
      let current = root;
      parts.forEach((part, i) => {
        if (!current[part]) {
          current[part] = i === parts.length - 1 ? null : {};
        }
        current = current[part];
      });
    }
    return root;
  };

  const renderTree = (node: any, parentPath = '') => {
    return Object.entries(node).map(([key, value]) => {
      const currentPath = parentPath ? `${parentPath}/${key}` : key;
      const isFolder = value !== null;
      const isOpen = openFolders[currentPath];

      return (
        <div key={currentPath}>
          <div
            className="flex items-center gap-2 py-1 px-2 text-sm cursor-pointer hover:bg-slate-100 rounded"
            style={{ marginLeft: `${currentPath.split('/').length * 10}px` }}
            onClick={() => isFolder && toggleFolder(currentPath)}
          >
            {isFolder ? (
              isOpen ? (
                <ChevronDown className="w-4 h-4 text-blue-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-blue-500" />
              )
            ) : (
              <File className="w-4 h-4 text-slate-400" />
            )}
            {isFolder ? (
              <span className="text-blue-700 font-medium">{key}</span>
            ) : (
              <span className="text-slate-700 font-mono">{key}</span>
            )}
          </div>
          {isFolder && isOpen && renderTree(value, currentPath)}
        </div>
      );
    });
  };

  const regenerateAnalysis = async () => {
    console.log(projectData?.repoUrl, "dskjfdks");

    if (projectData?.repoUrl) {

      try {
        setIsAnalyzing(true);
        const response = await fetch('/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repoUrl: projectData.repoUrl }),
        });

        if (!response.ok) throw new Error('Failed to regenerate');

        const updated = await response.json();
        setProjectData(updated);
      } catch (err) {
        alert('Regeneration failed.');
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }

    } else {
      alert('Missing repo URL');
      return;
    }

  };

  if (isAnalyzing) {
    return (
      <Card className="border border-blue-200 bg-blue-50/50">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin">
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Analyzing Project Structure
              </h3>
              <p className="text-blue-600">
                Our AI is examining your code to understand the architecture and generate the perfect backend...
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex items-center text-sm text-blue-700">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse" />
              Scanning file structure...
            </div>
            <div className="flex items-center text-sm text-blue-700">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse" />
              Detecting API endpoints...
            </div>
            <div className="flex items-center text-sm text-blue-700">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse" />
              Analyzing data models...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!projectData?.files || !Array.isArray(projectData.files)) {
    return <div className="text-red-500">Project files are missing or invalid.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-green-800">Analysis Complete</CardTitle>
              <p className="text-sm text-green-600">Project successfully analyzed</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-slate-800">{projectData.files.length}</div>
              <div className="text-sm text-slate-600">Files Detected</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-slate-800">{projectData?.detectedApis?.length ?? 0}</div>
              <div className="text-sm text-slate-600">API Endpoints</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-slate-800 capitalize">{projectData.framework ?? 'N/A'}</div>
              <div className="text-sm text-slate-600">Framework</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* File Tree */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-blue-600" />
              Project Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 rounded-lg p-4 max-h-80 overflow-y-auto font-mono text-sm">
              {renderTree(buildTree(projectData.structure))}
            </div>
          </CardContent>
        </Card>

        {/* AI Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Understanding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {projectData.aiSummary}
              </p>
            </div>


            {projectData.detectedApis?.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Detected API Endpoints:</h4>
                <div className="flex flex-wrap gap-2">
                  {projectData.detectedApis.map((api, index) => (
                    <Badge key={index} variant="secondary" className="font-mono">
                      {api}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {/* Regen Analysis we have to work again later. */}
            {/* <Button variant="outline" size="sm" className="w-full" onClick={regenerateAnalysis}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Analysis
            </Button> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
