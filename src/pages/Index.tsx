import React, { useState } from "react";
import { ResumeEditor } from "@/components/ResumeEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { templates } from "@/lib/templates";

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
      <div className="min-h-screen bg-gray-50">
        <header className="bg-primary text-white py-12">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Professional Resume Builder</h1>
            <p className="text-xl">Choose a template to get started</p>
          </div>
        </header>
        
        <div className="container mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(templates).map(([id, template]) => (
              <Card key={id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="aspect-w-8 aspect-h-11 mb-4">
                    <div className="w-full h-64 bg-white border rounded-lg overflow-hidden shadow-sm">
                      <ResumePreview data={template} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 capitalize">{id} Template</h3>
                  <p className="text-gray-600 mb-4">Professional and clean design suitable for all industries</p>
                  <Button 
                    className="w-full"
                    onClick={() => handleTemplateSelect(id)}
                  >
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resume Builder</h1>
          <Button
            variant="secondary"
            onClick={() => setSelectedTemplate(null)}
          >
            Choose Different Template
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto py-6">
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
              >
                Add Experience
              </Button>
              <Button
                onClick={() => handleAddSection("education")}
                variant="outline"
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