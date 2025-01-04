import React from "react";

export const CreativeTemplate = ({ data }: { data: any }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg">
      <div className="flex items-center gap-6 mb-6 pb-6 border-b">
        {data.photo && (
          <img src={data.photo} alt={data.personalInfo.fullName} className="w-24 h-24 rounded-lg object-cover" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{data.personalInfo.fullName}</h1>
          <div className="text-gray-600">
            <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
            <p>{data.personalInfo.location}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Professional Summary</h2>
            <p className="text-gray-700">{data.summary}</p>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Experience</h2>
            {data.experience.map((exp: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{exp.position}</h3>
                  <span className="text-sm text-gray-600">{exp.duration}</span>
                </div>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-gray-700 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Education</h2>
            {data.education.map((edu: any, index: number) => (
              <div key={index} className="mb-3">
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.year}</p>
              </div>
            ))}
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, index: number) => (
                <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};