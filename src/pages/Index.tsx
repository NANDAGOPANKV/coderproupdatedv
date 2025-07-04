import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ProjectAnalyzer } from '@/components/ProjectAnalyzer';
import { BackendGenerator } from '@/components/BackendGenerator';
import { Brain, Code2, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export interface ProjectData {
  name: string;
  framework: string;
  structure: Array<{
    path: string;
    type: 'file' | 'folder';
    children?: Array<{ path: string; type: 'file' | 'folder' }>;
  }>;
  detectedApis: string[];
  aiSummary: string;
}

const Index = () => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  const handleFeedbackSubmit = () => {
    toast({
      title: "Feedback Submitted!",
      description: "Thank you for your feedback. We'll review it soon.",
    });
  };

  const handleProjectAnalysis = async (data: any) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockProjectData: ProjectData = {
        name: data.name || 'Frontend Project',
        framework: data.framework || 'React',
        structure: [
          {
            path: '/src',
            type: 'folder',
            children: [
              { path: '/src/pages', type: 'folder' },
              { path: '/src/components', type: 'folder' },
              { path: '/src/api', type: 'folder' }
            ]
          },
          { path: '/src/pages/login.js', type: 'file' },
          { path: '/src/pages/register.js', type: 'file' },
          { path: '/src/components/ContactForm.js', type: 'file' }
        ],
        detectedApis: ['/api/login', '/api/register', '/api/contact'],
        aiSummary: 'This app contains login, registration, and a contact form. A backend with authentication, user models, and email controller will be generated.'
      };
      
      setProjectData(mockProjectData);
      setIsAnalyzing(false);
    }, 2000);
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
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg relative">
              <div className="flex items-center gap-1">
                <Code2 className="w-3 h-3 text-white" />
                <ArrowRight className="w-2 h-2 text-white" />
                <Brain className="w-3 h-3 text-white" />
              </div>
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-blue-600" />
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Transform Your Frontend into a Full-Stack App
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Upload your frontend repository or paste a GitHub URL, and our AI will analyze your code 
                to generate a complete backend with APIs, authentication, and database models.
              </p>
            </div>
            
            <FileUploader 
              onAnalysisStart={handleProjectAnalysis}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Project Analysis */}
          {(projectData || isAnalyzing) && (
            <ProjectAnalyzer 
              projectData={projectData}
              isAnalyzing={isAnalyzing}
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
