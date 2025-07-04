
import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, Brain, RefreshCw, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectData } from '@/pages/Index';

interface ProjectAnalyzerProps {
  projectData: ProjectData | null;
  isAnalyzing: boolean;
}

export const ProjectAnalyzer = ({ projectData, isAnalyzing }: ProjectAnalyzerProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/src']));

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (expandedFolders.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (items: ProjectData['structure'], level = 0) => {
    return items.map((item, index) => (
      <div key={`${item.path}-${index}`} className={`ml-${level * 4}`}>
        <div
          className="flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded cursor-pointer text-sm"
          onClick={() => item.type === 'folder' && toggleFolder(item.path)}
        >
          {item.type === 'folder' ? (
            <>
              {expandedFolders.has(item.path) ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
              <Folder className="w-4 h-4 text-blue-500" />
            </>
          ) : (
            <>
              <div className="w-4" />
              <File className="w-4 h-4 text-slate-400" />
            </>
          )}
          <span className="text-slate-700 font-mono">{item.path.split('/').pop()}</span>
        </div>
        
        {item.type === 'folder' && item.children && expandedFolders.has(item.path) && (
          <div className="ml-4">
            {renderFileTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
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

  if (!projectData) return null;

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
              <div className="text-2xl font-bold text-slate-800">{projectData.structure.length}</div>
              <div className="text-sm text-slate-600">Files Detected</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-slate-800">{projectData.detectedApis.length}</div>
              <div className="text-sm text-slate-600">API Endpoints</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-slate-800 capitalize">{projectData.framework}</div>
              <div className="text-sm text-slate-600">Framework</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* File Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-blue-600" />
              Project Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 rounded-lg p-4 max-h-80 overflow-y-auto font-mono text-sm">
              {renderFileTree(projectData.structure)}
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Understanding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-slate-700 leading-relaxed">
                {projectData.aiSummary}
              </p>
            </div>
            
            {/* Detected APIs */}
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

            <Button variant="outline" size="sm" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
