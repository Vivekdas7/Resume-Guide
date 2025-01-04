import React from "react";

const getTemplateStyles = (templateName: string) => {
  const baseStyles = {
    split: {
      container: "grid grid-cols-2 bg-white min-h-full",
      leftPanel: "bg-blue-900 text-white p-8",
      rightPanel: "p-8",
      photo: "w-48 h-48 rounded-full mx-auto mb-6 border-4 border-white",
      name: "text-3xl font-bold text-white mb-4",
      section: "mb-6",
      sectionTitle: "text-xl font-semibold mb-3 text-blue-200",
      company: "font-medium text-blue-200",
      skills: "bg-blue-800 px-3 py-1 rounded text-sm text-white",
    },
    sidebar: {
      container: "grid grid-cols-3 bg-gray-50 min-h-full",
      sidebar: "bg-gray-900 text-white p-6 col-span-1",
      content: "col-span-2 p-8",
      photo: "w-full aspect-square rounded-lg mb-6 object-cover",
      name: "text-2xl font-bold mb-4",
      section: "mb-8",
      sectionTitle: "text-lg font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4",
      company: "text-gray-700 font-medium",
      skills: "bg-gray-800 text-white px-3 py-1 rounded-full text-sm",
    },
    compact: {
      container: "max-w-3xl mx-auto bg-white p-6 shadow-lg",
      header: "flex items-center gap-6 mb-6 pb-6 border-b",
      photo: "w-24 h-24 rounded-lg object-cover",
      name: "text-3xl font-bold text-gray-900",
      section: "mb-4",
      sectionTitle: "text-lg font-semibold text-gray-800 mb-2",
      company: "text-gray-600",
      skills: "bg-gray-100 px-2 py-1 rounded text-sm text-gray-700",
    },
    timeline: {
      container: "bg-gradient-to-br from-purple-50 to-blue-50 p-8",
      header: "flex items-center gap-8 mb-8",
      photo: "w-32 h-32 rounded-full border-4 border-white shadow-lg",
      name: "text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text",
      section: "relative pl-8 mb-8 border-l-2 border-blue-200",
      sectionTitle: "text-2xl font-bold text-purple-600 mb-4",
      company: "text-blue-600 font-semibold",
      skills: "bg-white shadow-sm px-4 py-2 rounded-full text-sm text-purple-600",
    },
  };

  return baseStyles[templateName] || baseStyles.split;
};

export const ResumePreview = ({ data, templateName = "split" }: { data: any; templateName?: string }) => {
  const styles = getTemplateStyles(templateName);

  if (templateName === "split") {
    return (
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          {data.photo && <img src={data.photo} alt={data.personalInfo.fullName} className={styles.photo} />}
          <h1 className={styles.name}>{data.personalInfo.fullName}</h1>
          <div className="mb-6">
            <p>{data.personalInfo.email}</p>
            <p>{data.personalInfo.phone}</p>
            <p>{data.personalInfo.location}</p>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, index: number) => (
                <span key={index} className={styles.skills}>
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Professional Summary</h2>
            <p className="text-gray-700">{data.summary}</p>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            {data.experience.map((exp: any, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{exp.position}</h3>
                <p className={styles.company}>{exp.company}</p>
                <p className="text-sm text-gray-600">{exp.duration}</p>
                <p className="text-gray-700 mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            {data.education.map((edu: any, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className={styles.company}>{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (templateName === "sidebar") {
    return (
      <div className={styles.container}>
        <div className={styles.sidebar}>
          {data.photo && <img src={data.photo} alt={data.personalInfo.fullName} className={styles.photo} />}
          <h1 className={styles.name}>{data.personalInfo.fullName}</h1>
          <div className="mb-6 text-gray-300">
            <p>{data.personalInfo.email}</p>
            <p>{data.personalInfo.phone}</p>
            <p>{data.personalInfo.location}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, index: number) => (
                <span key={index} className={styles.skills}>
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Professional Summary</h2>
            <p className="text-gray-700">{data.summary}</p>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            {data.experience.map((exp: any, index: number) => (
              <div key={index} className="mb-6">
                <h3 className="font-bold text-gray-800">{exp.position}</h3>
                <p className={styles.company}>{exp.company}</p>
                <p className="text-sm text-gray-600">{exp.duration}</p>
                <p className="text-gray-700 mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            {data.education.map((edu: any, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                <p className={styles.company}>{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (templateName === "compact") {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {data.photo && <img src={data.photo} alt={data.personalInfo.fullName} className={styles.photo} />}
          <div>
            <h1 className={styles.name}>{data.personalInfo.fullName}</h1>
            <div className="text-gray-600">
              <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
              <p>{data.personalInfo.location}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Professional Summary</h2>
              <p className="text-gray-700">{data.summary}</p>
            </div>
            
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Experience</h2>
              {data.experience.map((exp: any, index: number) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{exp.position}</h3>
                    <span className="text-sm text-gray-600">{exp.duration}</span>
                  </div>
                  <p className={styles.company}>{exp.company}</p>
                  <p className="text-gray-700 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Education</h2>
              {data.education.map((edu: any, index: number) => (
                <div key={index} className="mb-3">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className={styles.company}>{edu.institution}</p>
                  <p className="text-sm text-gray-600">{edu.year}</p>
                </div>
              ))}
            </div>
            
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string, index: number) => (
                  <span key={index} className={styles.skills}>
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (templateName === "timeline") {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {data.photo && <img src={data.photo} alt={data.personalInfo.fullName} className={styles.photo} />}
          <div>
            <h1 className={styles.name}>{data.personalInfo.fullName}</h1>
            <div className="text-gray-600 mt-2">
              <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
              <p>{data.personalInfo.location}</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Professional Summary</h2>
          <p className="text-gray-700">{data.summary}</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          {data.experience.map((exp: any, index: number) => (
            <div key={index} className="mb-6 relative">
              <div className="absolute -left-10 top-0 w-4 h-4 bg-purple-600 rounded-full"></div>
              <h3 className="font-bold text-gray-800">{exp.position}</h3>
              <p className={styles.company}>{exp.company}</p>
              <p className="text-sm text-gray-600">{exp.duration}</p>
              <p className="text-gray-700 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className={styles.sectionTitle}>Education</h2>
            {data.education.map((edu: any, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                <p className={styles.company}>{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.year}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, index: number) => (
                <span key={index} className={styles.skills}>
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};