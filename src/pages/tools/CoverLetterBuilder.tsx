import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { shuffle } from 'lodash';
import jsPDF from 'jspdf';
import { toast } from "sonner";
import 'animate.css';
import { Navbar } from '@/components/ui/Navbar';
import { FileText, Edit, Share2, RefreshCw, ClipboardCopy } from "lucide-react";

export const CoverLetterBuilder = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    company: '',
    skills: '',
    experience: '',
    companyDetails: '',
  });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [previousTemplates, setPreviousTemplates] = useState<number[]>([]);

  const LETTER_TEMPLATES = [
    // Template 1 - Professional
    (data: typeof formData) => `
Dear Hiring Manager,

I am writing to express my strong interest in the ${data.jobTitle} position at ${data.company}. With my extensive background in ${data.skills}, I am confident in my ability to make valuable contributions to your team. Over the years, I have honed my skills in various projects, consistently delivering high-quality results.

${generateExperienceSection(data.experience)}

${generateCompanySection(data.companyDetails)}

My key technical skills include:
${generateSkillsList(data.skills)}

I am particularly drawn to ${data.company} because ${data.companyDetails}. I am excited about the possibility of bringing my expertise to your team and contributing to your continued success. I am eager to leverage my skills to help ${data.company} achieve its goals and drive innovation.

I look forward to discussing how my skills and experience align with your needs in more detail. Thank you for considering my application. I am enthusiastic about the opportunity to contribute to your esteemed company.

Best regards,
${data.name || '[Your Name]'}`,

    // Template 2 - Enthusiastic
    (data: typeof formData) => `
Dear Hiring Team,

I am thrilled to apply for the ${data.jobTitle} role at ${data.company}. As someone passionate about ${data.skills}, I was excited to learn about this opportunity to contribute to your innovative team. My career has been marked by a commitment to excellence and a drive to achieve outstanding results.

In my professional journey, ${data.experience}. These experiences have shaped my approach to problem-solving and collaboration, allowing me to work effectively in diverse teams and environments.

What stands out about ${data.company} is ${data.companyDetails}. Your company's vision aligns perfectly with my professional aspirations, and I am eager to bring my skills and enthusiasm to your team. I am confident that my proactive approach and dedication will make a significant impact.

My relevant skills include:
${generateSkillsList(data.skills)}

I would welcome the opportunity to discuss how my background and enthusiasm would benefit ${data.company}. I am excited about the prospect of contributing to your team and helping to drive your company's success.

Kind regards,
${data.name || '[Your Name]'}`,

    // Template 3 - Achievement-Focused
    (data: typeof formData) => `
Dear Hiring Manager,

The ${data.jobTitle} position at ${data.company} immediately caught my attention, as it combines my expertise in ${data.skills} with the opportunity to join an industry leader. Throughout my career, I have consistently demonstrated my ability to deliver results and exceed expectations.

My career highlights include: ${data.experience}. These achievements demonstrate my commitment to excellence and continuous improvement. I have a proven track record of implementing innovative solutions that drive efficiency and enhance performance.

Technical Proficiencies:
${generateSkillsList(data.skills)}

${data.company} impresses me because ${data.companyDetails}. I am confident that my track record of success would make me a valuable addition to your team. I am eager to bring my skills and experience to ${data.company} and contribute to its continued success.

Thank you for considering my application. I look forward to discussing how I can contribute to ${data.company}'s continued success. I am enthusiastic about the opportunity to join your team and make a meaningful impact.

Best regards,
${data.name || '[Your Name]'}`,

    // Template 4 - Modern and Direct
    (data: typeof formData) => `
Hi there,

I'm excited to apply for the ${data.jobTitle} role at ${data.company}. Here's why we'd be a great match:

About Me:
• Skilled in: ${data.skills}
• Experience: ${data.experience}

Why ${data.company}?
${data.companyDetails}

Key Competencies:
${generateSkillsList(data.skills)}

I am particularly drawn to ${data.company} because of its commitment to innovation and excellence. I am eager to bring my skills and experience to your team and contribute to your company's success. I am confident that my proactive approach and dedication will make a significant impact.

I'd love to chat about how my background aligns with your needs and learn more about the role. I am excited about the prospect of contributing to your team and helping to drive your company's success.

Looking forward to connecting,
${data.name || '[Your Name]'}`,

    // Template 5 - Story-Driven
    (data: typeof formData) => `
Dear ${data.company} Team,

When I discovered the ${data.jobTitle} position at ${data.company}, I knew it was the perfect opportunity to combine my passion for ${data.skills} with my professional expertise. My journey in this field has been marked by continuous growth and a commitment to excellence.

My journey in this field has been marked by continuous growth: ${data.experience}. Each experience has added to my skillset and reinforced my commitment to excellence. I have a proven track record of implementing innovative solutions that drive efficiency and enhance performance.

Core Capabilities:
${generateSkillsList(data.skills)}

What resonates with me about ${data.company} is ${data.companyDetails}. This alignment between your values and my professional goals makes me particularly excited about this opportunity. I am eager to bring my skills and experience to ${data.company} and contribute to its continued success.

I would welcome the chance to discuss how my background and enthusiasm could contribute to your team's success. I am enthusiastic about the opportunity to join your team and make a meaningful impact.

Warm regards,
${data.name || '[Your Name]'}`
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      const availableTemplates = LETTER_TEMPLATES.filter(
        (_, index) => !previousTemplates.includes(index)
      );
      
      const templateIndex = availableTemplates.length > 0 
        ? LETTER_TEMPLATES.indexOf(availableTemplates[0])
        : Math.floor(Math.random() * LETTER_TEMPLATES.length);

      setPreviousTemplates(prev => [...prev, templateIndex]);
      
      const letter = LETTER_TEMPLATES[templateIndex](formData);
      setGeneratedLetter(letter);
      setIsGenerating(false);
    }, 2000);
  };

  // Helper functions to format the content
  const generateExperienceSection = (experience: string) => {
    if (!experience) return '';
    return `Throughout my career, ${experience}. This experience has equipped me with the skills and knowledge necessary to excel in this role.`;
  };

  const generateCompanySection = (companyDetails: string) => {
    if (!companyDetails) return '';
    return `What particularly excites me about ${companyDetails}. I believe my skills and enthusiasm would make me a valuable addition to your team.`;
  };

  const generateSkillsList = (skills: string) => {
    if (!skills) return '';
    return skills
      .split(',')
      .map(skill => `• ${skill.trim()}`)
      .join('\n');
  };

  const handleResetTemplates = () => {
    setPreviousTemplates([]);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(generatedLetter, 10, 10);
    doc.save('cover_letter.pdf');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter).then(() => {
      toast.success("Cover letter copied!", {
        description: "Your cover letter has been copied to clipboard",
        duration: 3000,
        className: "bg-white",
        position: "bottom-center",
        icon: "📋",
        style: {
          border: "1px solid #e2e8f0",
          padding: "16px",
          color: "#1a1a1a",
        },
      });
    }, (err) => {
      toast.error("Failed to copy", {
        description: "Please try again",
        duration: 3000,
        position: "bottom-center",
      });
      console.error('Could not copy text: ', err);
    });
  };

  const handleNewVersion = () => {
    setIsGenerating(true);
    // Generate a new version using a different template
    const availableTemplates = LETTER_TEMPLATES.filter(
      (_, index) => !previousTemplates.includes(index)
    );
    
    const templateIndex = availableTemplates.length > 0 
      ? LETTER_TEMPLATES.indexOf(availableTemplates[0])
      : Math.floor(Math.random() * LETTER_TEMPLATES.length);

    setPreviousTemplates(prev => [...prev, templateIndex]);
    
    setTimeout(() => {
      const letter = LETTER_TEMPLATES[templateIndex](formData);
      setGeneratedLetter(letter);
      setIsGenerating(false);
      toast.success("New version generated!", {
        description: "Try different versions until you find the perfect one",
      });
    }, 1500);
  };

  const handleEdit = () => {
    // Create a temporary textarea with the letter content
    const textarea = document.createElement('textarea');
    textarea.value = generatedLetter;
    textarea.style.position = 'fixed';
    textarea.style.top = '50%';
    textarea.style.left = '50%';
    textarea.style.transform = 'translate(-50%, -50%)';
    textarea.style.width = '80%';
    textarea.style.height = '80%';
    textarea.style.padding = '20px';
    textarea.style.border = '2px solid #e2e8f0';
    textarea.style.borderRadius = '8px';
    textarea.style.zIndex = '9999';
    
    document.body.appendChild(textarea);
    textarea.focus();
    
    // Add event listener to save changes
    textarea.addEventListener('blur', () => {
      setGeneratedLetter(textarea.value);
      document.body.removeChild(textarea);
      toast.success("Changes saved!", {
        description: "Your cover letter has been updated",
      });
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Cover Letter',
          text: generatedLetter,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(generatedLetter);
        toast.success("Copied to clipboard!", {
          description: "Share your cover letter by pasting it",
        });
      }
    } catch (error) {
      toast.error("Failed to share", {
        description: "Please try copying the text instead",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight animate__animated animate__fadeInDown">
              AI Cover Letter Builder
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl text-gray-100 animate__animated animate__fadeIn">
              Create professional cover letters in minutes with our AI-powered tool
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 animate__animated animate__fadeInUp">
          {/* Input Form */}
          <div className="space-y-6">
            <Card className="p-6 shadow-lg border-t-4 border-blue-500">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <span className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">1</span>
                Tell us about the job
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Your Full Name</label>
                  <Input
                    name="name"
                    placeholder="e.g., John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="transition-all focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Job Title</label>
                  <Input
                    name="jobTitle"
                    placeholder="e.g., Frontend Developer"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <Input
                    name="company"
                    placeholder="e.g., Tech Corp"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Key Skills</label>
                  <Input
                    name="skills"
                    placeholder="e.g., React, TypeScript, Node.js"
                    value={formData.skills}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Relevant Experience</label>
                  <Textarea
                    name="experience"
                    placeholder="Brief description of your relevant experience..."
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Company Research</label>
                  <Textarea
                    name="companyDetails"
                    placeholder="What interests you about this company?"
                    value={formData.companyDetails}
                    onChange={handleInputChange}
                    className="h-24"
                  />
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all transform hover:scale-[1.02]"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Crafting your letter...
                    </>
                  ) : (
                    'Generate Cover Letter'
                  )}
                </Button>
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Pro Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 text-blue-500 mt-0.5">✨</div>
                  <span className="text-gray-600">Be specific about your experience and achievements</span>
                </li>
                {/* ... more tips ... */}
              </ul>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card className="p-6 shadow-lg border-t-4 border-indigo-500">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <span className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">2</span>
                Your Cover Letter
              </h2>
              <div className="bg-white border rounded-lg p-6 min-h-[500px] whitespace-pre-wrap shadow-inner">
                {generatedLetter ? (
                  <div className="prose max-w-none">{generatedLetter}</div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                    <FileText className="h-16 w-16" />
                    <p className="text-center">
                      Fill in the form and click "Generate" to create your cover letter
                    </p>
                  </div>
                )}
              </div>
              {generatedLetter && (
                <div className="mt-4 space-y-2">
                  <Button 
                    className="w-full bg-white hover:bg-gray-50 text-gray-800 border flex items-center justify-center gap-2"
                    onClick={handleDownloadPDF}
                  >
                    <FileText className="h-4 w-4" />
                    Download as PDF
                  </Button>
                  <Button 
                    className="w-full bg-white hover:bg-gray-50 text-gray-800 border flex items-center justify-center gap-2"
                    onClick={handleCopyToClipboard}
                  >
                    <ClipboardCopy className="h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
              <Card 
                className="p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                onClick={handleNewVersion}
              >
                <RefreshCw className={`h-6 w-6 mx-auto mb-2 text-blue-500 ${isGenerating ? 'animate-spin' : ''}`} />
                <span className="text-sm">New Version</span>
              </Card>
              <Card 
                className="p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                onClick={handleEdit}
              >
                <Edit className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <span className="text-sm">Edit</span>
              </Card>
              <Card 
                className="p-4 text-center hover:shadow-lg transition-all cursor-pointer"
                onClick={handleShare}
              >
                <Share2 className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <span className="text-sm">Share</span>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 