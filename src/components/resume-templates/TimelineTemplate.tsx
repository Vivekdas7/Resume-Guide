import React from "react";

export const TimelineTemplate = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="flex items-center gap-8 mb-8">
        {data.photo && (
          <img src={data.photo} alt={data.personalInfo.fullName} className="w-32 h-32 rounded-full border-4 border-white shadow-lg" />
        )}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            {data.personalInfo.fullName}
          </h1>
          <div className="text-gray-600 mt-2">
            <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
            <p>{data.personalInfo.location}</p>
          </div>
        </div>
      </div>

      <div className="relative pl-8 mb-8 border-l-2 border-blue-200">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Professional Summary</h2>
        <p className="text-gray-700">{data.summary}</p>
      </div>

      <div className="relative pl-8 mb-8 border-l-2 border-blue-200">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Experience</h2>
        {data.experience.map((exp: any, index: number) => (
          <div key={index} className="mb-6 relative">
            <div className="absolute -left-10 top-0 w-4 h-4 bg-purple-600 rounded-full"></div>
            <h3 className="font-bold text-gray-800">{exp.position}</h3>
            <p className="text-blue-600 font-semibold">{exp.company}</p>
            <p className="text-sm text-gray-600">{exp.duration}</p>
            <p className="text-gray-700 mt-2">{exp.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Education</h2>
          {data.education.map((edu: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-gray-800">{edu.degree}</h3>
              <p className="text-blue-600 font-semibold">{edu.institution}</p>
              <p className="text-sm text-gray-600">{edu.year}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: string, index: number) => (
              <span key={index} className="bg-white shadow-sm px-4 py-2 rounded-full text-sm text-purple-600">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};