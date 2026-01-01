import { resume } from "../lib/data";

export function Skills() {
  const skillCategories = [
    { name: "Frontend", keywords: resume.skills.frontend },
    { name: "Backend", keywords: resume.skills.backend },
    { name: "DevOps", keywords: resume.skills.devops },
    { name: "Mobile", keywords: resume.skills.mobile },
    { name: "Tools", keywords: resume.skills.tools },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h2 className="mb-12 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl text-center">
          기술 스택
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((skillGroup) => (
            <div
              key={skillGroup.name}
              className="rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-400"
            >
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                {skillGroup.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
