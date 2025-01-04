import React from "react";

export const SimpleTemplate = ({ data }: { data: any }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personalInfo.fullName}</h1>
        <div className="text-gray-600">
          <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
          <p>{data.personalInfo.location}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Professional Summary</h2>
        <p className="text-gray-700">{data.summary}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Projects</h2>
        {data.projects.map((project: any, index: number) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold">{project.name}</h3>
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
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Experience</h2>
          {data.experience.map((exp: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">{exp.position}</h3>
              <p className="text-gray-700">{exp.company}</p>
              <p className="text-sm text-gray-600">{exp.duration}</p>
              <p className="text-gray-700 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Education</h2>
        {data.education.map((edu: any, index: number) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold">{edu.degree}</h3>
            <p className="text-gray-700">{edu.institution}</p>
            <p className="text-sm text-gray-600">{edu.year}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill: string, index: number) => (
            <span key={index} className="bg-gray-100 px-3 py-1 rounded text-gray-700">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};