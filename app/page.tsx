import AboutMe from "@/components/about/me";

export default function Home() {
  return (
    <main className="mx-auto max-w-[1200px] px-4">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <AboutMe />
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <AboutMe />
      </div>
    </main>
  );
}
