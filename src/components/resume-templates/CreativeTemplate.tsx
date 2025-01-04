import React from "react";

export const CreativeTemplate = ({ data }: { data: any }) => {
  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 p-8 shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-2">
          {data.personalInfo.fullName}
        </h1>
        <div className="text-gray-600">
          <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
          <p>{data.personalInfo.location}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-3">Professional Summary</h2>
            <p className="text-gray-700">{data.summary}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-3">Projects</h2>
            {data.projects.map((project: any, index: number) => (
              <div key={index} className="mb-4 bg-white bg-opacity-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800">{project.name}</h3>
                <p className="text-gray-700 mt-1">{project.description}</p>
                <p className="text-purple-600 mt-1">Technologies: {project.technologies}</p>
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
              <h2 className="text-2xl font-bold text-purple-600 mb-3">Experience</h2>
              {data.experience.map((exp: any, index: number) => (
                <div key={index} className="mb-4 bg-white bg-opacity-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800">{exp.position}</h3>
                  <p className="text-purple-600">{exp.company}</p>
                  <p className="text-sm text-gray-600">{exp.duration}</p>
                  <p className="text-gray-700 mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-3">Education</h2>
            {data.education.map((edu: any, index: number) => (
              <div key={index} className="mb-4 bg-white bg-opacity-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                <p className="text-purple-600">{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.year}</p>
              </div>
            ))}
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, index: number) => (
                <span key={index} className="bg-white px-3 py-1 rounded-full text-purple-600 text-sm shadow-sm">
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