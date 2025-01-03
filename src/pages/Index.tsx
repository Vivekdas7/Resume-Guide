import React, { useState } from "react";
import { ResumeEditor } from "@/components/ResumeEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
    },
    summary: "",
    experience: [
      {
        company: "",
        position: "",
        duration: "",
        description: "",
      },
    ],
    education: [
      {
        institution: "",
        degree: "",
        year: "",
      },
    ],
    skills: [],
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white p-6">
        <h1 className="text-2xl font-bold">Resume Builder</h1>
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