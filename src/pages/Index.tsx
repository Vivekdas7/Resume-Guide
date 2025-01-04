import * as React from "react";
import { useState } from "react";
import { ResumeEditor } from "@/components/ResumeEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { Button } from "../components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { templates } from "@/lib/templates";
import { ArrowRight, Github, Upload, FileText, CheckCircle, XCircle, Menu, Twitter, Linkedin } from "lucide-react";
import 'animate.css';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/ui/Navbar';
import { toast } from "sonner";

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

// Add this constant after the JOB_PROFILES constant
const RESUME_KEYWORDS = [
  // Personal Information Keywords
  "name", "email", "phone", "address", "linkedin", "github", "portfolio", "contact",
  
  // Section Headers
  "experience", "employment", "work history", "professional experience", "career history",
  "education", "academic", "qualification", "degree", "certification", "training",
  "skills", "expertise", "competencies", "technical skills", "core competencies",
  "projects", "achievements", "accomplishments", "highlights",
  "summary", "objective", "profile", "about", "professional summary",
  
  // Common Resume Terms
  "responsible for", "developed", "managed", "led", "created", "implemented", "achieved",
  "team", "project", "collaborated", "coordinated", "analyzed", "improved", "increased",
  "reduced", "delivered", "launched", "initiated", "spearheaded", "orchestrated",
  "bachelor", "master", "phd", "certification", "certificate", "diploma", "gpa",
  "professional", "resume", "cv", "curriculum vitae", "references",
  
  // Technical Terms
  "programming", "software", "development", "engineering", "database", "api",
  "framework", "language", "platform", "system", "architecture", "infrastructure",
  
  // Soft Skills
  "leadership", "communication", "problem-solving", "analytical", "teamwork",
  "organization", "time management", "project management", "strategic",
  
  // Date/Duration Terms
  "present", "current", "year", "month", "-", "to", "from", "ongoing"
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
  const hasBulletPoints = /[•\-\*]/.test(text);
  const hasURLPattern = /(http|https|www\.)[^\s]+/.test(normalizedText);
  
  let confidencePoints = 0;
  
  // Reduce keyword match requirement (30 points max)
  confidencePoints += (foundKeywords.length / RESUME_KEYWORDS.length) * 30;
  
  // Adjust pattern scoring (35 points max)
  if (hasEmailPattern) confidencePoints += 10;
  if (hasPhonePattern) confidencePoints += 10;
  if (hasDatePattern) confidencePoints += 5;
  if (hasBulletPoints) confidencePoints += 5;
  if (hasURLPattern) confidencePoints += 5;
  
  // Simplified length check (15 points max)
  const wordCount = normalizedText.split(/\s+/).length;
  if (wordCount > 50) confidencePoints += 15;
  
  // More lenient section detection (20 points max)
  const sections = [
    /education|academic|qualification|study/i,
    /experience|employment|work|job|career/i,
    /skills|expertise|competencies|proficiency/i,
    /summary|objective|profile|about/i
  ];
  
  sections.forEach(pattern => {
    if (pattern.test(normalizedText)) confidencePoints += 5;
  });

  return {
    isValid: confidencePoints > 35, // Lower threshold
    confidence: confidencePoints,
    error: confidencePoints <= 35 
      ? "Please ensure your resume includes basic sections like contact information, experience, education, and skills."
      : undefined
  };
};

// Add these types near the top of the file
interface ResumeData {
  photo: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
  [key: string]: any; // Allow for additional fields
}

// Add this type for keyword analysis
interface KeywordAnalysis {
  keyword: string;
  found: boolean;
  context?: string;
  variations?: string[];
}

// Add these scoring weights
const SCORING_WEIGHTS = {
  BASE_FORMAT: 40,    // Base format score (40%)
  KEYWORDS: 35,       // Keyword matching (35%)
  REQUIREMENTS: 25    // Requirements matching (25%)
};

// Add this before getKeywordVariations
const SKILL_VARIATIONS: Record<string, string[]> = {
  // Programming Languages
  "javascript": ["js", "es6", "es2015", "ecmascript", "vanilla javascript", "vanilla js"],
  "typescript": ["ts", "typed js", "typed javascript"],
  "python": ["py", "python3", "python2", "django", "flask"],
  "java": ["j2ee", "java8", "java11", "spring", "spring boot"],
  
  // Frontend
  "react": ["reactjs", "react.js", "react native", "react hooks", "redux"],
  "angular": ["angular.js", "angularjs", "angular2+", "angular cli"],
  "vue": ["vuejs", "vue.js", "vue3", "vuex", "vue router"],
  
  // Backend
  "node.js": ["nodejs", "node", "express.js", "expressjs", "npm"],
  "sql": ["mysql", "postgresql", "oracle sql", "sql server", "tsql"],
  "nosql": ["mongodb", "dynamodb", "cassandra", "couchdb"],
  
  // Cloud & DevOps
  "aws": ["amazon web services", "ec2", "s3", "lambda", "cloudfront"],
  "docker": ["containerization", "docker-compose", "kubernetes", "k8s"],
  "ci/cd": ["continuous integration", "continuous deployment", "jenkins", "gitlab ci"],
  
  // Design
  "figma": ["figma design", "figma prototyping", "figma components"],
  "adobe xd": ["xd", "adobe experience design"],
  "ui/ux": ["user interface", "user experience", "ux design", "ui design"],
  
  // Common Skills
  "agile": ["scrum", "kanban", "sprint planning", "agile methodologies"],
  "git": ["github", "gitlab", "bitbucket", "version control"],
  "api": ["rest api", "graphql", "soap", "api development", "swagger"],
};

// Update getKeywordVariations to use the SKILL_VARIATIONS
const getKeywordVariations = (keyword: string): string[] => {
  const variations: string[] = [];
  const keywordLower = keyword.toLowerCase();
  
  // Add predefined variations if they exist
  if (SKILL_VARIATIONS[keywordLower]) {
    variations.push(...SKILL_VARIATIONS[keywordLower]);
  }
  
  // Add common variations
  variations.push(
    keywordLower,
    keywordLower.replace(/\s/g, ''),
    keywordLower.replace(/\./g, ''),
    keywordLower.replace(/-/g, ''),
    keywordLower.replace(/\s/g, '-'),
    keywordLower.replace(/\s/g, '_')
  );
  
  // Add variations with/without common prefixes/suffixes
  const prefixes = ['experienced in', 'skilled in', 'proficient in', 'knowledge of'];
  const suffixes = ['development', 'programming', 'engineering'];
  
  prefixes.forEach(prefix => {
    variations.push(`${prefix} ${keywordLower}`);
  });
  
  suffixes.forEach(suffix => {
    if (!keywordLower.includes(suffix)) {
      variations.push(`${keywordLower} ${suffix}`);
    }
  });
  
  return [...new Set(variations)]; // Remove duplicates
};

// Update analyzeKeywordMatch for better accuracy
const analyzeKeywordMatch = (content: string, keyword: string): { found: boolean; relevance: number } => {
  const contentLower = content.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  
  // Check for exact match with word boundaries
  const exactRegex = new RegExp(`\\b${keywordLower}\\b`, 'i');
  if (exactRegex.test(content)) {
    return { found: true, relevance: 1.0 };
  }
  
  // Check variations with context awareness
  const variations = getKeywordVariations(keywordLower);
  for (const variation of variations) {
    const variationRegex = new RegExp(`\\b${variation}\\b`, 'i');
    if (variationRegex.test(content)) {
      // Higher relevance for predefined variations
      const isPredefVariation = SKILL_VARIATIONS[keywordLower]?.includes(variation);
      return { found: true, relevance: isPredefVariation ? 0.9 : 0.8 };
    }
  }
  
  // Check for compound matches (e.g., "React Native" as separate words)
  const parts = keywordLower.split(/[\s.-]+/);
  if (parts.length > 1) {
    const allPartsFound = parts.every(part => 
      new RegExp(`\\b${part}\\b`, 'i').test(content)
    );
    if (allPartsFound) {
      return { found: true, relevance: 0.7 };
    }
    
    // Partial matches for compound terms
    const somePartsFound = parts.some(part => 
      new RegExp(`\\b${part}\\b`, 'i').test(content)
    );
    if (somePartsFound) {
      return { found: true, relevance: 0.4 };
    }
  }
  
  return { found: false, relevance: 0 };
};

const Index = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(templates.split);
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setResumeData(templates[templateId]);
    toast({
      title: "Template Selected",
      description: "You can now customize your resume.",
    });
  };

  const handleChange = (section: string, field: string, value: any) => {
    setResumeData((prev: ResumeData) => {
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

      // Handle personal information fields
      if (section === "personalInfo") {
        newData.personalInfo = {
          ...newData.personalInfo,
          [field]: value
        };
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
    setResumeData((prev: ResumeData) => ({
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

      const reader = new FileReader();
      
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        try {
          const content = e.target?.result as string;
          const cleanedContent = content
            .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          
          const profile = JOB_PROFILES[selectedProfile];
          
          // Enhanced keyword analysis
          const keywordAnalysis = profile.keywords.map(keyword => {
            const analysis = analyzeKeywordMatch(cleanedContent, keyword);
            
            // Get surrounding context if found
            let context = '';
            if (analysis.found) {
              const keywordIndex = cleanedContent.toLowerCase().indexOf(keyword.toLowerCase());
              if (keywordIndex !== -1) {
                const start = Math.max(0, keywordIndex - 50);
                const end = Math.min(cleanedContent.length, keywordIndex + keyword.length + 50);
                context = cleanedContent.slice(start, end).trim();
              }
            }

            return {
              keyword,
              found: analysis.found,
              relevance: analysis.relevance,
              context: context || undefined
            };
          });

          // Calculate scores
          const formatScore = calculateFormatScore(content);
          
          // Calculate keyword score (out of 35%)
          const totalRelevance = keywordAnalysis.reduce((sum, k) => sum + k.relevance, 0);
          const maxPossibleRelevance = profile.keywords.length;
          const keywordScore = (totalRelevance / maxPossibleRelevance) * SCORING_WEIGHTS.KEYWORDS;
          
          // Calculate requirement score (out of 25%)
          const requirementScore = calculateRequirementScore(cleanedContent, profile.requirements);
          
          // Calculate total score
          const totalScore = Math.round(formatScore + keywordScore + requirementScore);

          const mockResults = {
            score: totalScore,
            matches: keywordAnalysis
              .filter(k => k.found)
              .sort((a, b) => b.relevance - a.relevance)
              .map(k => k.keyword),
            missing: keywordAnalysis
              .filter(k => !k.found)
              .map(k => k.keyword),
            formatScore: Math.round(formatScore), // This will always be at least 40%
            formatFeedback: generateFormatFeedback(content),
            keywordScore: Math.round((keywordScore / SCORING_WEIGHTS.KEYWORDS) * 100),
            requirementScore: Math.round((requirementScore / SCORING_WEIGHTS.REQUIREMENTS) * 100),
            improvements: generateImprovements(keywordAnalysis, profile)
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

  const calculateRequirementScore = (content: string, requirements: string[]): number => {
    const maxScore = SCORING_WEIGHTS.REQUIREMENTS;
    let score = 0;
    
    requirements.forEach(req => {
      const reqLower = req.toLowerCase();
      // Look for requirement phrases and related terms
      if (content.includes(reqLower)) {
        score += maxScore / requirements.length;
      }
    });
    
    return score;
  };

  const calculateFormatScore = (content: string): number => {
    // Start with base score of 40%
    let score = SCORING_WEIGHTS.BASE_FORMAT;
    const maxBonusScore = 20; // Additional 20% possible for excellent formatting
    let bonusScore = maxBonusScore;
    
    // Check for proper sections (can only reduce the bonus score)
    if (!/education|academic|qualification/i.test(content)) bonusScore -= 4;
    if (!/experience|employment|work history/i.test(content)) bonusScore -= 4;
    if (!/skills|expertise|competencies/i.test(content)) bonusScore -= 4;
    
    // Check formatting
    if (!/\n\n|\r\n\r\n/.test(content)) bonusScore -= 3; // Proper spacing
    if (/\n{4,}/.test(content)) bonusScore -= 3; // Excessive spacing
    if (!/[A-Z][A-Za-z\s]*:?\n/.test(content)) bonusScore -= 2; // Section headers
    
    // Add bonus score to base score
    score += Math.max(0, bonusScore);
    
    return score;
  };

  const generateFormatFeedback = (content: string): string[] => {
    const feedback = [];
    
    if (!/\n\n|\r\n\r\n/.test(content)) {
      feedback.push("Improve spacing between sections for better readability");
    }
    if (/\n{4,}/.test(content)) {
      feedback.push("Reduce excessive spacing between sections");
    }
    if (!/[A-Z][A-Za-z\s]*:?\n/.test(content)) {
      feedback.push("Add clear section headers");
    }
    
    return feedback;
  };

  const generateImprovements = (
    keywordAnalysis: KeywordAnalysis[], 
    profile: JobProfile
  ): string[] => {
    const improvements = [];
    
    // Suggest missing keywords
    const missingKeywords = keywordAnalysis.filter(k => !k.found);
    if (missingKeywords.length > 0) {
      improvements.push(
        `Add missing keywords: ${missingKeywords.slice(0, 3).map(k => k.keyword).join(", ")}`
      );
    }
    
    // Add profile-specific suggestions
    if (profile.title.toLowerCase().includes("developer")) {
      improvements.push("Include specific technical project examples");
      improvements.push("Highlight your GitHub profile or portfolio");
    }
    
    if (profile.title.toLowerCase().includes("designer")) {
      improvements.push("Include links to your design portfolio");
      improvements.push("Mention specific design tools and methodologies");
    }
    
    return improvements;
  };

  const ATSScanner: React.FC = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <FileText className="h-4 w-4" />
          ATS Scanner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
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
                  {/* Overall Score with Success Message */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Overall ATS Score</span>
                      <span className="text-2xl font-bold text-blue-600">{atsResults.score}%</span>
                    </div>
                    <Progress value={atsResults.score} className="h-2" />
                    <div className={`mt-2 text-sm ${atsResults.score >= 50 ? 'text-green-600' : 'text-yellow-600'} font-medium`}>
                      {atsResults.score >= 50 
                        ? "🎉 Congratulations! Your resume is ATS-friendly and likely to pass through most ATS systems."
                        : "Your resume might need improvements to better pass ATS systems. Follow the suggestions below."}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Note: A score above 50% indicates your resume is optimized for most ATS software.
                    </p>
                  </div>

                  {/* Detailed Scores */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

  const LearnMoreDialog = () => (
    <Dialog open={isLearnMoreOpen} onOpenChange={setIsLearnMoreOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Welcome to ResumeGuide</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-blue-600">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Professional Resume Templates</li>
              <li>AI-Powered Cover Letter Generator</li>
              <li>ATS Resume Scanner</li>
              <li>Real-time Preview</li>
              <li>Easy Export Options</li>
            </ul>
              </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-blue-600">How It Works</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Choose a professional template</li>
              <li>Fill in your details</li>
              <li>Customize the design</li>
              <li>Download or share your resume</li>
            </ol>
          </div>

                <Button
            className="w-full mt-4"
            onClick={() => {
              setIsLearnMoreOpen(false);
              navigate('/templates');
              toast({
                title: "Welcome to ResumeGuide! 🎉",
                description: "Let's create your professional resume together.",
                duration: 5000,
                className: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
                style: {
                  animation: "slideIn 0.5s ease-out",
                },
                type: "foreground",
              });
            }}
          >
            Get Started Now
                </Button>
              </div>
      </DialogContent>
    </Dialog>
  );

  if (!selectedTemplate) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
          <Navbar />
          {/* Responsive Header */}
          <header className="relative flex items-center justify-center min-h-screen w-full">
            {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 opacity-70"></div>
            
            {/* Content container */}
            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] mt-16">
              {/* Text content */}
              <div className="text-center w-full max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-wide text-white">
                  <span className="block mb-2">Craft Your Dream</span>
                  <span className="block">Resume</span>
            </h1>
                
                <p className="mt-6 text-base md:text-lg lg:text-2xl text-gray-200 max-w-2xl mx-auto">
                  Transform your job applications with stunning and professional resumes.
            </p>
                
                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Button 
                    className="w-full sm:w-auto px-8 py-3 text-lg bg-white text-blue-700 hover:bg-gray-100"
                    onClick={() => {
                      toast({
                        title: "Welcome to ResumeGuide! 🎉",
                        description: "Let's create your professional resume together.",
                        duration: 5000,
                        className: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
                        style: {
                          animation: "slideIn 0.5s ease-out",
                        },
                        type: "foreground",
                      });
                    }}
              >
                Get Started
              </Button>
                  <Button 
                    className="w-full sm:w-auto px-8 py-3 text-lg bg-blue-700 text-white hover:bg-blue-800"
                    onClick={() => setIsLearnMoreOpen(true)}
                  >
                Learn More
              </Button>
                </div>
            </div>
          </div>
        </header>

          {/* Responsive Templates Grid */}
        <div id="templates" className="container mx-auto py-16 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Pick Your Favorite Template
          </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Choose from our professionally designed templates.
          </p>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
          
            {/* Responsive Features Grid */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
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

          <div className="absolute bottom-0 left-0 right-0 bg-blue-800/80 backdrop-blur-sm py-3">
            <div className="container mx-auto">
              <div className="flex items-center justify-center">
                <div className="relative overflow-hidden w-full">
                  <div className="flex space-x-4 animate-marquee whitespace-nowrap">
                    <span className="text-white flex items-center gap-2 mx-4">
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded text-sm font-medium">NEW</span>
                      Join our WhatsApp group for daily job updates and career tips! 
                      <a href="#" className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-green-600 transition-colors">
                        Join Now
                      </a>
                    </span>
                    <span className="text-white flex items-center gap-2 mx-4">
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded text-sm font-medium">NEW</span>
                      Join our WhatsApp group for daily job updates and career tips! 
                      <a href="#" className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-green-600 transition-colors">
                        Join Now
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
              {/* Footer Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {/* Company Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-8 w-8 text-blue-500"
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
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      ResumeGuide
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Empowering careers through intelligent resume creation. Built with ❤️ by Codium.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                      <Github className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-200">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/templates" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                        Resume Templates
                      </Link>
                    </li>
                    <li>
                      <Link to="/cover-letter" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                        Cover Letter Builder
                      </Link>
                    </li>
                    <li>
                      <Link to="/blog" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                        Career Blog
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-200">Resources</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/resume-guide" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                        Resume Writing Guide
                      </Link>
                    </li>
                    <li>
                      <Link to="/career-advice" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                        Career Advice
                      </Link>
                    </li>
                    <li>
                      <Link to="/interview-tips" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                        Interview Tips
                      </Link>
                    </li>
                    <li>
                      <Link to="/job-search" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                        Job Search Strategy
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Newsletter */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-200">Stay Updated</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Get the latest career tips and tricks delivered to your inbox.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-gray-800 border-gray-700 text-sm"
                    />
                    <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-800 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  {/* Copyright */}
                  <div className="text-sm text-gray-400">
                    © {new Date().getFullYear()} ResumeGuide by{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300">
                      Codium
                    </a>
                    . All rights reserved.
                  </div>

                  {/* Legal Links */}
                  <div className="flex gap-6">
                    <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                      Privacy Policy
                    </a>
                    <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                      Terms of Service
                    </a>
                    <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
        </footer>
      </div>
        <LearnMoreDialog />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
      <Navbar />
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Resume Guide</h1>
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