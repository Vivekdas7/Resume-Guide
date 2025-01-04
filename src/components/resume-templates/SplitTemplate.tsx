import React from "react";

export const SplitTemplate = ({ data }: { data: any }) => {
  return (
    <div className="grid grid-cols-2 bg-white min-h-full">
      <div className="bg-blue-900 text-white p-8">
        {data.photo && (
          <img src={data.photo} alt={data.personalInfo.fullName} className="w-48 h-48 rounded-full mx-auto mb-6 border-4 border-white" />
        )}
        <h1 className="text-3xl font-bold text-white mb-4">{data.personalInfo.fullName}</h1>
        <div className="mb-6">
          <p>{data.personalInfo.email}</p>
          <p>{data.personalInfo.phone}</p>
          <p>{data.personalInfo.location}</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-blue-200">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: string, index: number) => (
              <span key={index} className="bg-blue-800 px-3 py-1 rounded text-sm text-white">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Professional Summary</h2>
          <p className="text-gray-700">{data.summary}</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Experience</h2>
          {data.experience.map((exp: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">{exp.position}</h3>
              <p className="text-blue-900 font-medium">{exp.company}</p>
              <p className="text-sm text-gray-600">{exp.duration}</p>
              <p className="text-gray-700 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Education</h2>
          {data.education.map((edu: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-blue-900 font-medium">{edu.institution}</p>
              <p className="text-sm text-gray-600">{edu.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};