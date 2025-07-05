import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ProjectAnalyzer } from '@/components/ProjectAnalyzer';
import { BackendGenerator } from '@/components/BackendGenerator';
import { Brain } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export interface ProjectData {
  repoUrl?: string;
  framework?: string;
  files: Array<{ filename: string; code: string }>;
  detectedApis?: string[];
  aiSummary: string;
  structure: string[];
}


const Index = () => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);


  const handleFeedbackSubmit = () => {
    // open Google Form in a new tab
    window.open('https://forms.gle/xdzg11DWCYSJSZqKA', '_blank');

    // show toast message
    toast({
      title: 'Opening Feedback Form...',
      description: "Please fill out the form in the new tab.",
    });
  };


  const handleGenerationComplete = () => {
    setGenerationComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Coder.Pro
              </h1>
              <p className="text-sm text-slate-600">Frontend → Backend Generator</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl mb-4 border border-purple-100/50">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Drop your GitHub repo URL. AI builds your backend stack.              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Includes routes, controllers, models, config, and server.js — structured, readable, and ready to run.              </p>
            </div>

            <FileUploader
              onAnalysisStart={async (payload) => {
                const { source, url } = payload;
                setIsAnalyzing(true);
                try {
                  let response;

                  if (source === 'file') {
                    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                    const file = input?.files?.[0];
                    if (!file) throw new Error('No ZIP file found');

                    const formData = new FormData();
                    formData.append('zip', file);

                    response = await fetch('https://susi-backend.onrender.com/summarize', {
                      method: 'POST',
                      body: formData,
                    });
                  } else {
                    response = await fetch('https://susi-backend.onrender.com/summarize', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ repoUrl: url }),
                    });
                  }

                  if (!response.ok) throw new Error('Analysis failed');
                  const data: ProjectData = await response.json();
                  setProjectData(data);
                  toast({ title: 'Analysis Complete' });
                } catch (err) {
                  console.error('Analysis failed:', err);
                  toast({ title: 'Error', description: 'Failed to analyze project.' });
                } finally {
                  setIsAnalyzing(false);
                }
              }}
              isAnalyzing={isAnalyzing}
              onRepoSet={(url) => setRepoUrl(url)}
            />
          </div>

          {/* Project Analysis */}
          {(projectData || isAnalyzing) && (
            <ProjectAnalyzer
              projectData={projectData}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
              setProjectData={setProjectData}
            />
          )}

          {/* Backend Generator */}
          {projectData && (
            <BackendGenerator
              projectData={projectData}
              onGenerationComplete={handleGenerationComplete}
              isComplete={generationComplete}
            />
          )}

          {/* Footer */}
          <footer className="text-center py-8 border-t border-slate-200 bg-white/50 rounded-2xl">
            <p className="text-slate-600 text-sm">
              Have feedback?
              <button
                onClick={handleFeedbackSubmit}
                className="text-blue-600 hover:text-blue-700 ml-1 font-medium transition-colors"
              >
                Submit Feedback
              </button>
              {' | '}
              <span className="text-slate-400">v0.1 Prototype</span>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
