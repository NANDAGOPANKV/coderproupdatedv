import { useState } from 'react';
import { Zap, Download, Cloud, Code2, Database, Shield, Mail, CheckCircle, ExternalLink } from 'lucide-react';
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

export const BackendGenerator = ({ projectData, onGenerationComplete, isComplete }: BackendGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const generationSteps = [
    { icon: Database, label: 'Creating database models', progress: 20 },
    { icon: Shield, label: 'Setting up authentication', progress: 40 },
    { icon: Code2, label: 'Generating API routes', progress: 60 },
    { icon: Mail, label: 'Configuring email service', progress: 80 },
    { icon: CheckCircle, label: 'Finalizing backend', progress: 100 }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    for (const step of generationSteps) {
      setCurrentStep(step.label);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setGenerationProgress(step.progress);
    }

    setIsGenerating(false);
    onGenerationComplete();
    toast.success('Backend generated successfully!');
  };

  const handleDownload = () => {
    toast.success('Backend ZIP file downloaded! Follow the instructions below to get started.');
    // In a real implementation, this would trigger a file download
  };

  const handleDeploy = () => {
    toast.info('Redirecting to Railway for deployment...');
    // In a real implementation, this would integrate with Railway
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
              
              <Button onClick={handleGenerate} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    generationProgress >= step.progress
                      ? 'bg-green-50 border border-green-200'
                      : generationProgress >= step.progress - 20
                      ? 'bg-purple-50 border border-purple-200'
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <step.icon
                    className={`w-5 h-5 ${
                      generationProgress >= step.progress
                        ? 'text-green-600'
                        : generationProgress >= step.progress - 20
                        ? 'text-purple-600'
                        : 'text-slate-400'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      generationProgress >= step.progress
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

            {/* Generated Structure Preview */}
            <Card className="bg-slate-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-slate-800 mb-3">Generated Backend Structure:</h4>
                <div className="font-mono text-sm space-y-1 text-slate-700">
                  <div>📁 /backend/</div>
                  <div className="ml-4">📁 routes/</div>
                  <div className="ml-8">📄 auth.js</div>
                  <div className="ml-8">📄 user.js</div>
                  <div className="ml-8">📄 contact.js</div>
                  <div className="ml-4">📁 controllers/</div>
                  <div className="ml-8">📄 authController.js</div>
                  <div className="ml-8">📄 userController.js</div>
                  <div className="ml-4">📁 models/</div>
                  <div className="ml-8">📄 User.js</div>
                  <div className="ml-8">📄 Contact.js</div>
                  <div className="ml-4">📄 server.js</div>
                  <div className="ml-4">📄 package.json</div>
                </div>
              </CardContent>
            </Card>

            {/* Features Generated */}
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

            {/* Installation Instructions */}
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleDownload} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Download className="w-4 h-4 mr-2" />
                Download Backend ZIP
              </Button>
              <Button onClick={handleDeploy} variant="outline" className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50">
                <Cloud className="w-4 h-4 mr-2" />
                Deploy to Railway
              </Button>
              <Button variant="ghost" className="flex-1 text-purple-700 hover:bg-purple-50">
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
