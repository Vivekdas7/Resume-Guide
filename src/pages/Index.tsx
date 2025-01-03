import React, { useState } from "react";
import { ResumeEditor } from "@/components/ResumeEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { templates } from "@/lib/templates";
import { ArrowRight, Sparkles, FileText, Palette } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState(templates.modern);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setResumeData(templates[templateId]);
    toast({
      title: "Template Selected",
      description: "You can now customize your resume.",
    });
  };

  const handleChange = (section: string, field: string, value: string) => {
    setResumeData((prev) => {
      const newData = { ...prev };
      if (section === "skills" && field === "list") {
        newData.skills = value.split(",").map((skill) => skill.trim());
      } else if (field.includes(".")) {
        const [index, key] = field.split(".");
        newData[section][index][key] = value;
      } else {
        newData[section][field] = value;
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

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <header className="relative bg-primary py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
          <div className="relative container mx-auto text-center px-4">
            <h1 className="text-5xl font-bold text-white mb-6 animate-fade-in">
              Professional Resume Builder
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Create stunning resumes in minutes with our easy-to-use builder and professional templates
            </p>
            <div className="flex justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5" />
                <span>Professional Templates</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <FileText className="w-5 h-5" />
                <span>Easy Customization</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Palette className="w-5 h-5" />
                <span>Modern Designs</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Choose Your Template
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(templates).map(([id, template]) => (
              <Card key={id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <div className="aspect-w-8 aspect-h-11 mb-4 bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="transform group-hover:scale-105 transition-transform duration-300">
                      <ResumePreview data={template} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 capitalize">{id} Template</h3>
                  <p className="text-gray-600 mb-4">Professional and clean design suitable for all industries</p>
                  <Button 
                    className="w-full group"
                    onClick={() => handleTemplateSelect(id)}
                  >
                    <span>Use This Template</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <footer className="bg-gray-50 border-t py-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>Create your professional resume today and land your dream job</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resume Builder</h1>
          <Button
            variant="secondary"
            onClick={() => setSelectedTemplate(null)}
            className="hover:bg-white/90 transition-colors"
          >
            Choose Different Template
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-secondary border-b">
              <h2 className="text-xl font-semibold">Edit Resume</h2>
            </div>
            <div className="overflow-auto max-h-[800px]">
              <ResumeEditor data={resumeData} onChange={handleChange} />
            </div>
            <div className="p-4 bg-secondary border-t flex gap-4">
              <Button
                onClick={() => handleAddSection("experience")}
                variant="outline"
                className="hover:bg-primary hover:text-white transition-colors"
              >
                Add Experience
              </Button>
              <Button
                onClick={() => handleAddSection("education")}
                variant="outline"
                className="hover:bg-primary hover:text-white transition-colors"
              >
                Add Education
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-secondary border-b">
              <h2 className="text-xl font-semibold">Preview</h2>
            </div>
            <div className="overflow-auto max-h-[800px]">
              <ResumePreview data={resumeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;