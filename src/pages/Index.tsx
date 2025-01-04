import React, { useState } from "react";
import { ResumeEditor } from "@/components/ResumeEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { templates } from "@/lib/templates";
import { ArrowRight } from "lucide-react";
import 'animate.css';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Github } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";

type JobProfile = {
  title: string;
  keywords: string[];
  requirements: string[];
};

const JOB_PROFILES: Record<string, JobProfile> = {
  "frontend-developer": {
    title: "Frontend Developer",
    keywords: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Redux", "REST API", "Responsive Design"],
    requirements: ["3+ years experience", "Bachelor's degree", "Web development"]
  },
  "backend-developer": {
    title: "Backend Developer",
    keywords: ["Node.js", "Python", "Java", "SQL", "REST API", "Microservices", "AWS", "Docker"],
    requirements: ["API Development", "Database design", "Server architecture"]
  },
  "fullstack-developer": {
    title: "Full Stack Developer",
    keywords: ["React", "Node.js", "JavaScript", "TypeScript", "MongoDB", "REST API", "Git", "AWS"],
    requirements: ["Full stack development", "Database management", "API design"]
  },
  "ui-ux-designer": {
    title: "UI/UX Designer",
    keywords: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Design Systems"],
    requirements: ["UI/UX principles", "Design portfolio", "User testing"]
  }
};

// Add this type for resume validation
type ValidationResult = {
  isValid: boolean;
  confidence: number;
  error?: string;
};

// Add these helper functions at the top level
const RESUME_KEYWORDS = [
  // Personal Information Keywords
  "name", "email", "phone", "address", "linkedin", "github", "portfolio",
  
  // Section Headers
  "experience", "employment", "work history", "professional experience",
  "education", "academic", "qualification", "degree",
  "skills", "expertise", "competencies", "technical skills",
  "projects", "achievements", "accomplishments",
  "summary", "objective", "profile", "about",
  
  // Common Resume Terms
  "responsible for", "developed", "managed", "led", "created", "implemented",
  "team", "project", "collaborated", "coordinated", "analyzed",
  "bachelor", "master", "phd", "certification", "certificate",
  "professional", "resume", "cv", "curriculum vitae",
  
  // Date/Duration Terms
  "present", "current", "year", "month", "-", "to"
];

const validateResumeContent = (text: string): ValidationResult => {
  const normalizedText = text.toLowerCase();
  
  // Count how many resume-related keywords are found
  const foundKeywords = RESUME_KEYWORDS.filter(keyword => 
    normalizedText.includes(keyword.toLowerCase())
  );
  
  // Check for common resume patterns
  const hasEmailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(normalizedText);
  const hasPhonePattern = /(\+\d{1,3}[-.]?)?\d{3}[-.]?\d{3}[-.]?\d{4}/.test(normalizedText);
  const hasDatePattern = /(\d{4}|\d{1,2}\/\d{1,2}\/\d{2,4}|present|current)/.test(normalizedText);
  
  // Calculate confidence score based on multiple factors
  let confidencePoints = 0;
  
  // Keyword matches (up to 50 points)
  confidencePoints += (foundKeywords.length / RESUME_KEYWORDS.length) * 50;
  
  // Common patterns (up to 30 points)
  if (hasEmailPattern) confidencePoints += 10;
  if (hasPhonePattern) confidencePoints += 10;
  if (hasDatePattern) confidencePoints += 10;
  
  // Length check (up to 20 points)
  const wordCount = normalizedText.split(/\s+/).length;
  if (wordCount > 100) confidencePoints += 10;
  if (wordCount > 300) confidencePoints += 10;
  
  // Section detection (additional points)
  const hasEducationSection = /education|academic|qualification/i.test(normalizedText);
  const hasExperienceSection = /experience|employment|work history/i.test(normalizedText);
  const hasSkillsSection = /skills|expertise|competencies/i.test(normalizedText);
  
  if (hasEducationSection) confidencePoints += 5;
  if (hasExperienceSection) confidencePoints += 5;
  if (hasSkillsSection) confidencePoints += 5;

  return {
    isValid: confidencePoints > 40, // Require at least 40% confidence
    confidence: confidencePoints,
    error: confidencePoints <= 40 
      ? "This document doesn't appear to be a resume. Please ensure you're uploading a resume with standard sections like Experience, Education, and Skills."
      : undefined
  };
};

const Index = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState(templates.split);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResults, setAtsResults] = useState<{
    score: number;
    matches: string[];
    missing: string[];
    formatScore: number;
    formatFeedback: string[];
    keywordScore: number;
    requirementScore: number;
    improvements: string[];
  } | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setResumeData(templates[templateId]);
    toast({
      title: "Template Selected",
      description: "You can now customize your resume.",
    });
  };

  const handleChange = (section: string, field: string, value: any) => {
    setResumeData((prev) => {
      const newData = { ...prev };
      
      // Handle special cases
      if (section === "photo") {
        newData.photo = value;
        return newData;
      }
      
      if (section === "skills" && field === "list") {
        newData.skills = value.split(",").map((skill: string) => skill.trim());
        return newData;
      }

      // Handle nested fields (e.g., "0.company")
      if (field.includes(".")) {
        const [index, key] = field.split(".");
        if (!Array.isArray(newData[section])) {
          newData[section] = [];
        }
        if (!newData[section][index]) {
          newData[section][index] = {};
        }
        newData[section][index][key] = value;
      } else {
        // For direct fields, store the value directly
        newData[section] = value;
      }

      return newData;
    });
  };

  const handleAddSection = (section: "experience" | "education") => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        section === "experience"
          ? { company: "", position: "", duration: "", description: "" }
          : { institution: "", degree: "", year: "" },
      ],
    }));
    toast({
      title: "Section Added",
      description: `New ${section} section has been added.`,
    });
  };

  const analyzeResume = async (file: File) => {
    setAtsLoading(true);
    try {
      if (!selectedProfile) {
        toast({
          title: "Error",
          description: "Please select a job profile first",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        });
        return;
      }

      // Simulate file reading and content extraction
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          // Get the file content
          const content = e.target?.result as string;
          
          // Clean the content by removing special characters and normalizing whitespace
          const cleanedContent = content
            .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          // Validate if it's actually a resume
          const validation = validateResumeContent(cleanedContent);
          
          if (!validation.isValid) {
            toast({
              title: "Invalid Resume",
              description: validation.error || "The uploaded file doesn't appear to be a resume. Please check the content and try again.",
              variant: "destructive",
            });
            setAtsLoading(false);
            return;
          }

          // If validation passes, continue with the analysis
          const profile = JOB_PROFILES[selectedProfile];
          
          // Mock analysis - Replace with actual analysis logic
          const mockKeywordMatches = profile.keywords
            .filter(() => Math.random() > 0.3);
          const mockKeywordMissing = profile.keywords
            .filter(k => !mockKeywordMatches.includes(k));
          
          const formatScore = Math.floor(Math.random() * 30) + 70;
          const keywordScore = (mockKeywordMatches.length / profile.keywords.length) * 100;
          const requirementScore = Math.floor(Math.random() * 40) + 60;
          
          const totalScore = Math.floor((formatScore + keywordScore + requirementScore) / 3);

          const mockResults = {
            score: totalScore,
            matches: mockKeywordMatches,
            missing: mockKeywordMissing,
            formatScore,
            formatFeedback: [
              "Good use of bullet points",
              "Clear section headings",
              "Improve spacing between sections",
              "Consider using a more standard font"
            ],
            keywordScore,
            requirementScore,
            improvements: [
              "Add more quantifiable achievements",
              "Include relevant certifications",
              "Highlight specific technologies used in projects",
              "Add a brief professional summary"
            ]
          };
          
          setAtsResults(mockResults);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to analyze the document. Please try again.",
            variant: "destructive",
          });
        }
      };

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read the file. Please try again.",
          variant: "destructive",
        });
      };

      // Start reading the file
      reader.readAsText(file);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAtsLoading(false);
    }
  };

  const ATSScanner = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <FileText className="h-4 w-4" />
          ATS Scanner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>ATS Resume Scanner</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!atsResults ? (
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Job Profile</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedProfile}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                >
                  <option value="">Select a profile...</option>
                  {Object.entries(JOB_PROFILES).map(([key, profile]) => (
                    <option key={key} value={key}>
                      {profile.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed rounded-lg">
                <Upload className="h-8 w-8 text-gray-400" />
                <div className="text-center space-y-2">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="max-w-xs"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) analyzeResume(file);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <p className="text-sm text-gray-500">Upload your resume to analyze its ATS compatibility</p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>Accepted formats: PDF, DOC, DOCX</p>
                    <p>Maximum file size: 5MB</p>
                    <p>Make sure your resume is in English</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {atsLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  <p>Analyzing your resume...</p>
                </div>
              ) : (
                <>
                  {/* Overall Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Overall ATS Score</span>
                      <span className="text-2xl font-bold text-blue-600">{atsResults.score}%</span>
                    </div>
                    <Progress value={atsResults.score} className="h-2" />
                  </div>

                  {/* Detailed Scores */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium">Format Score</div>
                      <div className="text-xl font-bold text-green-600">{atsResults.formatScore}%</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium">Keyword Match</div>
                      <div className="text-xl font-bold text-blue-600">{Math.round(atsResults.keywordScore)}%</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium">Requirements</div>
                      <div className="text-xl font-bold text-purple-600">{atsResults.requirementScore}%</div>
                    </div>
                  </div>

                  {/* Keywords Analysis */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Matching Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {atsResults.matches.map((keyword) => (
                          <span
                            key={keyword}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Missing Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {atsResults.missing.map((keyword) => (
                          <span
                            key={keyword}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Format Feedback */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Format Analysis</h4>
                    <ul className="space-y-1">
                      {atsResults.formatFeedback.map((feedback, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          {feedback}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Suggested Improvements</h4>
                    <ul className="space-y-1">
                      {atsResults.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      setAtsResults(null);
                      setSelectedProfile("");
                    }}
                  >
                    Scan Another Resume
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="flex items-center">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="ml-2 text-xl font-bold text-gray-900">ResumeBuilder</span>
                </a>
              </div>

              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList className="flex gap-6">
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                      href="#templates"
                    >
                      Templates
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                      href="#features"
                    >
                      Features
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                      href="#pricing"
                    >
                      Pricing
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <div className="flex items-center gap-4">
                <ATSScanner />
                <a
                  href="https://github.com/yourusername/resumebuilder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <Button
                  variant="ghost"
                  className="hidden md:inline-flex"
                  onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Started
                </Button>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <header className="relative bg-cover bg-center h-screen pt-16">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 opacity-70"></div>
          <div className="relative container mx-auto text-center px-4 flex flex-col justify-center items-center h-full">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-wide text-white animate__animated animate__fadeIn">
              <span className="block">Craft Your Dream</span>
              <span className="block mt-2 animate__animated animate__fadeIn animate__delay-1s">Resume</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto animate__animated animate__fadeIn animate__delay-2s">
              Transform your job applications with stunning and professional resumes that leave a lasting impression.
            </p>
            <div className="flex gap-6 animate__animated animate__fadeIn animate__delay-3s">
              <Button 
                className="px-8 py-3 text-lg bg-white text-blue-700 hover:bg-blue-100 transition-all duration-300 transform hover:scale-105"
                onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
              </Button>
              <Button className="px-8 py-3 text-lg bg-blue-700 text-white hover:bg-blue-800 transition-all duration-300 transform hover:scale-105">
                Learn More
              </Button>
            </div>
          </div>
        </header>

        <div id="templates" className="container mx-auto py-16 px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800 animate__animated animate__fadeIn">
            Pick Your Favorite Template
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto animate__animated animate__fadeIn animate__delay-1s">
            Choose from our professionally designed templates to create your perfect resume. Each template is fully customizable to match your style.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(templates).map(([id, template]) => (
              <Card
                key={id}
                className="group relative hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                
                <CardContent className="p-0">
                  {/* Template Preview */}
                  <div className="relative aspect-[210/297] w-full bg-white overflow-hidden">
                    <div className="absolute inset-0 transform group-hover:scale-105 transition-transform duration-500">
                      <ResumePreview data={template} templateName={id} />
                    </div>
                  </div>
                  
                  {/* Template Info - Appears on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
                        {id} Template
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        {id === 'classic' && 'Timeless layout perfect for traditional industries'}
                        {id === 'creative' && 'Stand out with this unique and eye-catching design'}
                        {id === 'minimal' && 'Simple and elegant for a focused presentation'}
                        {id === 'professional' && 'Balanced design for experienced professionals'}
                        {id === 'split' && 'Dual-column layout for organized content presentation'}
                      </p>
                      <Button
                        className="w-full group/btn flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleTemplateSelect(id)}
                      >
                        <span>Use Template</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Quick Select Button - Visible without hover */}
                  <Button
                    variant="ghost"
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => handleTemplateSelect(id)}
                  >
                    Quick Select
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Template Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional Design</h3>
              <p className="text-gray-600">Crafted by expert designers for maximum impact</p>
            </div>
            <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Customization</h3>
              <p className="text-gray-600">Modify colors, fonts, and layout with ease</p>
            </div>
            <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Download</h3>
              <p className="text-gray-600">Export your resume in multiple formats</p>
            </div>
          </div>
        </div>

        <footer className="bg-gray-900 text-white py-12 text-center">
          <p className="text-sm animate__animated animate__fadeIn">
            Crafted with ❤️ | Build your future with a resume that stands out!
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <Button
            variant="secondary"
            onClick={() => setSelectedTemplate(null)}
            className="hover:bg-white hover:text-blue-700 transition-all"
          >
            Choose Template
          </Button>
        </div>
      </header>

      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-blue-100 border-b">
              <h2 className="text-2xl font-semibold">Edit Your Resume</h2>
            </div>
            <div className="overflow-auto max-h-[800px] p-4">
              <ResumeEditor data={resumeData} onChange={handleChange} />
            </div>
            <div className="p-4 bg-blue-100 border-t flex gap-4">
              <Button
                onClick={() => handleAddSection("experience")}
                variant="outline"
                className="hover:bg-blue-500 hover:text-white transition-colors"
              >
                Add Experience
              </Button>
              <Button
                onClick={() => handleAddSection("education")}
                variant="outline"
                className="hover:bg-blue-500 hover:text-white transition-colors"
              >
                Add Education
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-blue-100 border-b">
              <h2 className="text-2xl font-semibold">Preview</h2>
            </div>
            <div className="overflow-auto max-h-[800px] p-4">
              <ResumePreview data={resumeData} templateName={selectedTemplate || 'split'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;