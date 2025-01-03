import React from "react";

export const ResumePreview = ({ data }: { data: any }) => {
  return (
    <div className="bg-white p-8 shadow-lg min-h-full">
      <div className="border-b-2 border-primary pb-4 mb-6">
        <h1 className="text-3xl font-bold text-primary">{data.personalInfo.fullName}</h1>
        <div className="text-sm text-gray-600 mt-2">
          <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-2">Professional Summary</h2>
        <p className="text-gray-700">{data.summary}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Work Experience</h2>
        {data.experience.map((exp: any, index: number) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold">{exp.position}</h3>
            <p className="text-accent font-medium">{exp.company}</p>
            <p className="text-sm text-gray-600">{exp.duration}</p>
            <p className="text-gray-700 mt-2">{exp.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Education</h2>
        {data.education.map((edu: any, index: number) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold">{edu.degree}</h3>
            <p className="text-accent">{edu.institution}</p>
            <p className="text-sm text-gray-600">{edu.year}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-primary mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill: string, index: number) => (
            <span
              key={index}
              className="bg-secondary px-3 py-1 rounded-full text-sm text-gray-700"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};