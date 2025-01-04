import React from "react";

const getTemplateStyles = (templateName: string) => {
  const baseStyles = {
    modern: {
      container: "bg-white p-8 shadow-lg min-h-full",
      header: "border-b-2 border-primary pb-4 mb-6",
      name: "text-3xl font-bold text-primary",
      section: "mb-6",
      sectionTitle: "text-xl font-semibold text-primary mb-4",
      company: "text-accent font-medium",
      skills: "bg-secondary px-3 py-1 rounded-full text-sm text-gray-700",
    },
    minimal: {
      container: "bg-gray-50 p-8 shadow-sm min-h-full",
      header: "border-b border-gray-200 pb-4 mb-6",
      name: "text-4xl font-light text-gray-800",
      section: "mb-8",
      sectionTitle: "text-lg font-medium text-gray-700 mb-3",
      company: "text-gray-600 font-medium",
      skills: "bg-white px-4 py-1 rounded-sm text-sm text-gray-600 border border-gray-200",
    },
    professional: {
      container: "bg-white p-8 shadow-md min-h-full border-t-4 border-primary",
      header: "pb-4 mb-6",
      name: "text-3xl font-bold text-gray-800",
      section: "mb-6",
      sectionTitle: "text-xl font-bold text-primary mb-3 uppercase tracking-wide",
      company: "text-primary-600 font-semibold",
      skills: "bg-gray-100 px-3 py-1 rounded text-sm text-gray-800",
    },
    executive: {
      container: "bg-slate-50 p-8 shadow-lg min-h-full",
      header: "border-b-2 border-slate-800 pb-4 mb-6",
      name: "text-4xl font-bold text-slate-800",
      section: "mb-8",
      sectionTitle: "text-xl font-bold text-slate-700 mb-4 uppercase",
      company: "text-slate-600 font-semibold",
      skills: "bg-slate-200 px-4 py-2 rounded-lg text-sm text-slate-700",
    },
    creative: {
      container: "bg-white p-8 shadow-xl min-h-full border-l-8 border-accent",
      header: "pb-4 mb-6",
      name: "text-5xl font-extrabold text-gray-800 tracking-tight",
      section: "mb-8",
      sectionTitle: "text-2xl font-bold text-accent mb-4",
      company: "text-gray-700 font-bold",
      skills: "bg-accent bg-opacity-10 px-4 py-2 rounded-full text-sm text-accent font-medium",
    },
    technical: {
      container: "bg-gray-50 p-8 shadow-md min-h-full border border-gray-200",
      header: "border-b-2 border-blue-500 pb-4 mb-6",
      name: "text-3xl font-bold text-blue-900",
      section: "mb-6",
      sectionTitle: "text-xl font-semibold text-blue-800 mb-3",
      company: "text-blue-600 font-medium",
      skills: "bg-blue-50 px-3 py-1 rounded text-sm text-blue-700 border border-blue-100",
    },
  };

  return baseStyles[templateName] || baseStyles.modern;
};

export const ResumePreview = ({ data, templateName = "modern" }: { data: any; templateName?: string }) => {
  const styles = getTemplateStyles(templateName);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.name}>{data.personalInfo.fullName}</h1>
        <div className="text-sm text-gray-600 mt-2">
          <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Professional Summary</h2>
        <p className="text-gray-700">{data.summary}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Work Experience</h2>
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

      <div>
        <h2 className={styles.sectionTitle}>Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill: string, index: number) => (
            <span
              key={index}
              className={styles.skills}
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};