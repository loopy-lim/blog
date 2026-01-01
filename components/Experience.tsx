import { resume } from "../lib/data";

export function Experience() {
  return (
    <section id="experience" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-16 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl text-center">
          경력
        </h2>
        <div className="mx-auto max-w-4xl space-y-8">
          {resume.experience.map((exp, index) => (
            <div
              key={index}
              className="relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {exp.company}
                  </h3>
                  <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mt-1">
                    {exp.position}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200 whitespace-nowrap">
                  {exp.period}
                </span>
              </div>
              
              <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                {exp.description}
              </p>

              <ul className="space-y-4">
                {exp.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start text-gray-600 dark:text-gray-300">
                    <span className="mr-3 mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <span
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: highlight.replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="text-gray-900 dark:text-white font-semibold">$1</strong>'
                        ),
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
