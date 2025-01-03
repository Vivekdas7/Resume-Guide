import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const ResumeEditor = ({ data, onChange }: { 
  data: any;
  onChange: (section: string, field: string, value: string) => void;
}) => {
  return (
    <div className="space-y-6 p-6">
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={data.personalInfo.fullName}
              onChange={(e) => onChange("personalInfo", "fullName", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.personalInfo.email}
              onChange={(e) => onChange("personalInfo", "email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.personalInfo.phone}
              onChange={(e) => onChange("personalInfo", "phone", e.target.value)}
              placeholder="+1 234 567 890"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
        <Textarea
          value={data.summary}
          onChange={(e) => onChange("summary", "content", e.target.value)}
          placeholder="Write a brief professional summary..."
          className="min-h-[100px]"
        />
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
        {data.experience.map((exp: any, index: number) => (
          <div key={index} className="space-y-4 mb-6">
            <div>
              <Label>Company</Label>
              <Input
                value={exp.company}
                onChange={(e) => onChange("experience", `${index}.company`, e.target.value)}
                placeholder="Company name"
              />
            </div>
            <div>
              <Label>Position</Label>
              <Input
                value={exp.position}
                onChange={(e) => onChange("experience", `${index}.position`, e.target.value)}
                placeholder="Job title"
              />
            </div>
            <div>
              <Label>Duration</Label>
              <Input
                value={exp.duration}
                onChange={(e) => onChange("experience", `${index}.duration`, e.target.value)}
                placeholder="2020 - Present"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => onChange("experience", `${index}.description`, e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Education</h2>
        {data.education.map((edu: any, index: number) => (
          <div key={index} className="space-y-4 mb-6">
            <div>
              <Label>Institution</Label>
              <Input
                value={edu.institution}
                onChange={(e) => onChange("education", `${index}.institution`, e.target.value)}
                placeholder="University name"
              />
            </div>
            <div>
              <Label>Degree</Label>
              <Input
                value={edu.degree}
                onChange={(e) => onChange("education", `${index}.degree`, e.target.value)}
                placeholder="Bachelor's in..."
              />
            </div>
            <div>
              <Label>Year</Label>
              <Input
                value={edu.year}
                onChange={(e) => onChange("education", `${index}.year`, e.target.value)}
                placeholder="2020"
              />
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        <Textarea
          value={data.skills.join(", ")}
          onChange={(e) => onChange("skills", "list", e.target.value)}
          placeholder="Add your skills (comma separated)..."
          className="min-h-[100px]"
        />
      </Card>
    </div>
  );
};