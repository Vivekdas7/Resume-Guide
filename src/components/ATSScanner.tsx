import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "sonner";
import * as pdfjsLib from 'pdfjs-dist';

// Update worker configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Define keyword sets for different profiles
const PROFILE_KEYWORDS = {
  frontend: {
    mustHave: ["react", "javascript", "html", "css", "responsive", "typescript"],
    goodToHave: ["redux", "webpack", "git", "api", "testing", "sass", "vue", "angular"],
  },
  backend: {
    mustHave: ["node.js", "database", "api", "sql", "server", "rest"],
    goodToHave: ["python", "java", "mongodb", "docker", "aws", "microservices"],
  },
  fullstack: {
    mustHave: ["javascript", "react", "node.js", "database", "api", "fullstack"],
    goodToHave: ["typescript", "mongodb", "docker", "aws", "redux", "testing"],
  },
  "ui-ux": {
    mustHave: ["figma", "user experience", "wireframes", "prototyping", "design"],
    goodToHave: ["adobe xd", "sketch", "user research", "usability", "interaction"],
  },
};

// Enhanced keyword variations with more comprehensive matches
const KEYWORD_VARIATIONS = {
  "react": ["reactjs", "react.js", "react native", "react hooks", "react framework", "react applications", "react development", "react components"],
  "javascript": ["js", "es6", "es2015", "vanilla javascript", "ecmascript", "javascript development", "javascript programming", "js development", "javascript applications"],
  "typescript": ["ts", "typed javascript", "typescript development", "type system", "typescript programming", ".ts", "typescript applications"],
  "node.js": ["nodejs", "node", "express.js", "expressjs", "node development", "node.js development", "node backend", "node server"],
  "html": ["html5", "semantic html", "html/css", "html markup", "html development", "html coding", "html structure"],
  "css": ["css3", "scss", "sass", "styled-components", "tailwind", "bootstrap", "css frameworks", "cascading style sheets", "css styling", "css design"],
  "responsive": ["responsive design", "mobile-first", "adaptive design", "responsive layout", "responsive development", "cross-platform", "multi-device"],
  "api": ["rest api", "restful", "graphql", "web services", "endpoints", "api development", "api integration", "api design", "web api"],
  "database": ["sql", "mysql", "postgresql", "mongodb", "nosql", "oracle", "database management", "database design", "data storage"],
  "testing": ["jest", "cypress", "unit testing", "e2e", "test driven", "testing frameworks", "automated testing", "qa testing", "quality assurance"],
  "git": ["github", "gitlab", "version control", "bitbucket", "git repository", "source control", "git management"],
  "docker": ["containerization", "kubernetes", "k8s", "container", "docker containers", "docker images", "containerized"],
  "aws": ["amazon web services", "cloud", "s3", "ec2", "lambda", "aws services", "aws cloud", "amazon cloud"],
  "figma": ["figma design", "ui design", "interface design", "figma prototyping", "figma tools", "design system"],
  "user experience": ["ux", "user research", "usability", "user interface", "ui/ux", "ux design", "user-centered", "user-focused"]
};

export const ATSScanner = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [scanResults, setScanResults] = useState<{
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    details: {
      mustHaveMatched: string[];
      goodToHaveMatched: string[];
      bonusPoints: number;
      contextBonus: number;
      variations: Record<string, string[]>;
    }
  } | null>(null);

  const analyzeKeywords = (text: string, profile: keyof typeof PROFILE_KEYWORDS) => {
    const keywords = PROFILE_KEYWORDS[profile];
    const textLower = text.toLowerCase();
    
    // Enhanced keyword matching function
    const hasKeyword = (keyword: string): { found: boolean; variations: string[] } => {
      const variations = KEYWORD_VARIATIONS[keyword.toLowerCase()] || [];
      const allVariations = [keyword.toLowerCase(), ...variations];
      const foundVariations: string[] = [];

      for (const variation of allVariations) {
        // Different matching patterns
        const patterns = [
          // Exact word match
          new RegExp(`\\b${variation}\\b`, 'i'),
          // Hyphenated variation
          new RegExp(`\\b${variation.replace(/\s+/g, '-')}\\b`, 'i'),
          // Dot notation
          new RegExp(`\\b${variation.replace(/\s+/g, '\\.')}\\b`, 'i'),
          // With common prefixes
          new RegExp(`\\b(experienced in|skilled in|proficient in|knowledge of)\\s+${variation}\\b`, 'i'),
          // With common suffixes
          new RegExp(`\\b${variation}\\s+(development|programming|engineering|design)\\b`, 'i'),
          // Inside parentheses
          new RegExp(`\\(.*${variation}.*\\)`, 'i')
        ];

        for (const pattern of patterns) {
          if (pattern.test(textLower)) {
            foundVariations.push(variation);
            break;
          }
        }
      }

      return {
        found: foundVariations.length > 0,
        variations: foundVariations
      };
    };

    // Enhanced matching with variation tracking
    const matchedMustHave = keywords.mustHave.map(keyword => {
      const result = hasKeyword(keyword);
      return { keyword, ...result };
    }).filter(result => result.found);

    const matchedGoodToHave = keywords.goodToHave.map(keyword => {
      const result = hasKeyword(keyword);
      return { keyword, ...result };
    }).filter(result => result.found);

    const missingMustHave = keywords.mustHave.filter(k => !matchedMustHave.find(m => m.keyword === k));
    const missingGoodToHave = keywords.goodToHave.filter(k => !matchedGoodToHave.find(m => m.keyword === k));

    // Enhanced scoring system
    const mustHaveScore = (matchedMustHave.length / keywords.mustHave.length) * 70;
    const goodToHaveScore = (matchedGoodToHave.length / keywords.goodToHave.length) * 30;
    
    // Calculate bonus points based on variation matches
    const bonusPoints = [...matchedMustHave, ...matchedGoodToHave].reduce((bonus, match) => {
      // More variations found = more bonus points
      return bonus + (match.variations.length - 1) * 2;
    }, 0);

    // Context analysis bonus (check if keywords appear in relevant contexts)
    const contextBonus = [...matchedMustHave, ...matchedGoodToHave].reduce((bonus, match) => {
      const contextPatterns = [
        /experience/i,
        /project/i,
        /develop/i,
        /implement/i,
        /built/i,
        /created/i,
        /managed/i
      ];

      // Find keyword in context
      const keywordIndex = textLower.indexOf(match.keyword.toLowerCase());
      if (keywordIndex !== -1) {
        const context = textLower.slice(Math.max(0, keywordIndex - 50), keywordIndex + 50);
        return bonus + (contextPatterns.some(pattern => pattern.test(context)) ? 2 : 0);
      }
      return bonus;
    }, 0);

    const totalScore = Math.min(100, Math.round(mustHaveScore + goodToHaveScore + bonusPoints + contextBonus));

    return {
      score: totalScore,
      matchedKeywords: [...matchedMustHave, ...matchedGoodToHave].map(m => m.keyword),
      missingKeywords: [...missingMustHave, ...missingGoodToHave],
      details: {
        mustHaveMatched: matchedMustHave.map(m => m.keyword),
        goodToHaveMatched: matchedGoodToHave.map(m => m.keyword),
        bonusPoints,
        contextBonus,
        variations: [...matchedMustHave, ...matchedGoodToHave].reduce((acc, match) => {
          acc[match.keyword] = match.variations;
          return acc;
        }, {} as Record<string, string[]>)
      }
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setScanResults(null);
      toast("File uploaded successfully", {
        description: "Your resume is ready for ATS analysis",
      });
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + ' ';
      }
      
      return fullText
        .replace(/[\n\r]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s.-]/g, ' ')
        .trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };

  const handleScan = async () => {
    if (!file) {
      toast("No file selected", {
        description: "Please upload a resume first",
      });
      return;
    }

    if (!selectedProfile) {
      toast("No profile selected", {
        description: "Please select a job profile",
      });
      return;
    }

    toast("Scanning your resume...", {
      description: "This will take a few seconds",
    });

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }

      // Clean and normalize the text
      text = text.toLowerCase()
        .replace(/[\n\r]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s.-]/g, ' ')
        .trim();

      const results = analyzeKeywords(text, selectedProfile as keyof typeof PROFILE_KEYWORDS);
      setScanResults(results);

      // Enhanced feedback message
      const feedbackMessage = results.score >= 70
        ? "Great match! Your resume is well-optimized."
        : results.score >= 50
        ? "Good start, but consider adding the missing keywords to improve your score."
        : "Consider revising your resume to include more relevant keywords.";

      toast(`ATS Score: ${results.score}%`, {
        description: feedbackMessage
      });

    } catch (error) {
      toast("Error scanning file", {
        description: "Please make sure you've uploaded a valid PDF or text file.",
      });
      console.error('Scanning error:', error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          ATS Scanner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>ATS Resume Scanner</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Job Profile</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
              >
                <option value="">Select a profile...</option>
                <option value="frontend">Frontend Developer</option>
                <option value="backend">Backend Developer</option>
                <option value="fullstack">Full Stack Developer</option>
                <option value="ui-ux">UI/UX Designer</option>
              </select>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed rounded-lg">
              <FileText className="h-8 w-8 text-gray-400" />
              <div className="text-center space-y-2">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="max-w-xs"
                  onChange={handleFileUpload}
                  onClick={(e) => e.stopPropagation()}
                />
                <p className="text-sm text-gray-500">Upload your resume to analyze its ATS compatibility</p>
              </div>
            </div>
            
            {scanResults && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">ATS Score</span>
                    <span className="font-bold text-lg">{scanResults.score}%</span>
                  </div>
                  <Progress value={scanResults.score} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Matched Keywords ({scanResults.matchedKeywords.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {scanResults.matchedKeywords.map(keyword => (
                      <span key={keyword} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Missing Keywords ({scanResults.missingKeywords.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {scanResults.missingKeywords.map(keyword => (
                      <span key={keyword} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Button onClick={handleScan}>Scan Resume</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 