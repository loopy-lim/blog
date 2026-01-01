import { resume } from "../lib/data";

export function About() {
  return (
    <section id="about" className="relative py-24 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 -mt-20 -ml-20 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]"></div>
      <div className="absolute bottom-0 right-0 -mb-20 -mr-20 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[100px]"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl text-center">
            소개
          </h2>
          
          <div className="mb-12 rounded-2xl bg-blue-50 p-8 dark:bg-blue-900/20">
            <p className="text-xl font-medium leading-relaxed text-blue-900 dark:text-blue-100">
              &quot;{resume.basics.summary}&quot;
            </p>
          </div>

          <div className="space-y-8 text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light">
            {resume.basics.about.map((paragraph, index) => (
              <p
                key={index}
                dangerouslySetInnerHTML={{
                  __html: paragraph.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong class="text-gray-900 dark:text-white font-semibold">$1</strong>'
                  ),
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
