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
    creative: {
      container: "bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-xl min-h-full",
      header: "flex items-center gap-6 mb-8",
      photo: "w-32 h-32 rounded-full border-4 border-purple-200 shadow-lg",
      name: "text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text",
      section: "mb-8",
      sectionTitle: "text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2",
      company: "text-pink-600 font-bold",
      skills: "bg-purple-100 px-4 py-2 rounded-full text-sm text-purple-700 font-medium",
    },
    minimalist: {
      container: "bg-gray-50 p-8 min-h-full border-l-4 border-gray-800",
      header: "grid grid-cols-3 gap-4 mb-8",
      photo: "w-24 h-24 rounded-sm grayscale",
      name: "text-3xl font-light text-gray-800 col-span-2",
      section: "mb-6",
      sectionTitle: "text-lg font-medium text-gray-800 uppercase tracking-wider mb-4",
      company: "text-gray-600",
      skills: "bg-white border border-gray-200 px-3 py-1 rounded-sm text-sm text-gray-600",
    },
    elegant: {
      container: "bg-gradient-to-br from-slate-50 to-slate-100 p-8 min-h-full",
      header: "text-center mb-8",
      photo: "w-40 h-40 rounded-full mx-auto mb-4 border-4 border-white shadow-lg",
      name: "text-4xl font-serif text-slate-800",
      section: "mb-8",
      sectionTitle: "text-xl font-serif text-slate-700 border-b border-slate-200 pb-2 mb-4",
      company: "text-slate-600 font-medium",
      skills: "bg-white shadow-sm px-4 py-2 rounded text-sm text-slate-600",
    },
    professional: {
      container: "bg-white p-8 shadow-md min-h-full border-t-4 border-blue-600",
      header: "flex justify-between items-start mb-8",
      photo: "w-28 h-28 rounded-lg shadow-md",
      name: "text-3xl font-bold text-blue-900",
      section: "mb-6",
      sectionTitle: "text-xl font-bold text-blue-800 mb-4",
      company: "text-blue-700 font-semibold",
      skills: "bg-blue-50 px-3 py-1 rounded text-sm text-blue-700",
    },
    modern2: {
      container: "bg-gradient-to-r from-teal-50 to-emerald-50 p-8 min-h-full",
      header: "grid grid-cols-4 gap-6 mb-8",
      photo: "w-full aspect-square rounded-lg shadow-lg col-span-1",
      name: "text-4xl font-bold text-teal-800 col-span-3",
      section: "mb-8",
      sectionTitle: "text-2xl font-semibold text-emerald-700 mb-4",
      company: "text-teal-600 font-medium",
      skills: "bg-white/80 backdrop-blur px-4 py-2 rounded-lg text-sm text-teal-700",
    }
  };

  return baseStyles[templateName] || baseStyles.modern;
};

export const ResumePreview = ({ data, templateName = "modern" }: { data: any; templateName?: string }) => {
  const styles = getTemplateStyles(templateName);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {data.photo && ["creative", "minimalist", "elegant", "professional", "modern2"].includes(templateName) && (
          <img 
            src={data.photo} 
            alt={data.personalInfo.fullName}
            className={styles.photo}
          />
        )}
        <div>
          <h1 className={styles.name}>{data.personalInfo.fullName}</h1>
          <div className="text-sm text-gray-600 mt-2">
            <p>{data.personalInfo.email} | {data.personalInfo.phone}</p>
            {data.personalInfo.location && (
              <p className="mt-1">{data.personalInfo.location}</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Professional Summary</h2>
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Work Experience</h2>
        {data.experience.map((exp: any, index: number) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold">{exp.position}</h3>
            <p className={styles.company}>{exp.company}</p>
            <p className="text-sm text-gray-600">{exp.duration}</p>
            <p className="text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
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
            <span key={index} className={styles.skills}>
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};