import React, { useState } from "react";
import { ResumeEditor } from "@/components/ResumeEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { templates } from "@/lib/templates";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState(templates.split);

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
      if (section === "skills" && field === "list") {
        newData.skills = value.split(",").map((skill: string) => skill.trim());
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
        <header className="relative bg-cover bg-center h-screen bg-animate bg-gradient-to-r from-blue-500 to-indigo-700">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 opacity-70"></div>
          <div className="relative container mx-auto text-center px-4 flex flex-col justify-center items-center h-full">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-wide text-white animate__animated animate__fadeIn animate__delay-2s">
              <span className="inline-block animate__animated animate__fadeIn">Craft Your Dream</span>
              <span className="inline-block animate__animated animate__fadeIn animate__delay-4s">Resume</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
              Transform your job applications with stunning and professional resumes that leave a lasting impression.
            </p>
            <div className="flex gap-6">
              <Button className="px-8 py-3 text-lg bg-white text-blue-700 hover:bg-blue-100 transition-all ease-in-out duration-300 transform hover:scale-105">
                Get Started
              </Button>
              <Button className="px-8 py-3 text-lg bg-blue-700 text-white hover:bg-blue-800 transition-all ease-in-out duration-300 transform hover:scale-105">
                Learn More
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto py-16 px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Pick Your Favorite Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(templates).map(([id, template]) => (
              <Card
                key={id}
                className="group hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden transform hover:scale-105"
              >
                <CardContent className="p-6 bg-white bg-opacity-90 rounded-lg backdrop-blur-sm">
                  <div className="aspect-w-8 aspect-h-11 mb-4 bg-gray-50 rounded-lg overflow-hidden">
                    <div className="transform group-hover:scale-105 transition-transform duration-300">
                      <ResumePreview data={template} templateName={id} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">{id} Template</h3>
                  <p className="text-gray-600 mb-4">Sleek and professional design perfect for any job.</p>
                  <Button
                    className="w-full group flex items-center justify-between"
                    onClick={() => handleTemplateSelect(id)}
                  >
                    <span className="text-lg">Use This Template</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <footer className="bg-gray-900 text-white py-12 text-center">
          <p className="text-sm animate__animated animate__fadeIn animate__delay-2s">
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