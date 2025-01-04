import React from "react";

export const ModernTemplate = ({ data }: { data: any }) => {
  return (
    <div className="grid grid-cols-3 bg-gray-50 min-h-full">
      <div className="bg-gray-900 text-white p-6 col-span-1">
        {data.photo && (
          <img src={data.photo} alt={data.personalInfo.fullName} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover" />
        )}
        <h1 className="text-2xl font-bold mb-4">{data.personalInfo.fullName}</h1>
        <div className="mb-6 text-gray-300">
          <p>{data.personalInfo.email}</p>
          <p>{data.personalInfo.phone}</p>
          <p>{data.personalInfo.location}</p>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: string, index: number) => (
              <span key={index} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-2 p-8">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
            Professional Summary
          </h2>
          <p className="text-gray-700">{data.summary}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
            Projects
          </h2>
          {data.projects.map((project: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-gray-800">{project.name}</h3>
              <p className="text-gray-700 mt-1">{project.description}</p>
              <p className="text-gray-600 mt-1">Technologies: {project.technologies}</p>
              {project.link && (
                <a href={project.link} className="text-blue-600 hover:underline mt-1 block">
                  Project Link
                </a>
              )}
            </div>
          ))}
        </div>

        {data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
              Experience
            </h2>
            {data.experience.map((exp: any, index: number) => (
              <div key={index} className="mb-6">
                <h3 className="font-bold text-gray-800">{exp.position}</h3>
                <p className="text-gray-700">{exp.company}</p>
                <p className="text-sm text-gray-600">{exp.duration}</p>
                <p className="text-gray-700 mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">
            Education
          </h2>
          {data.education.map((edu: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-gray-800">{edu.degree}</h3>
              <p className="text-gray-700">{edu.institution}</p>
              <p className="text-sm text-gray-600">{edu.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};