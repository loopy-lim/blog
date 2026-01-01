export function Contact() {
  return (
    <section id="contact" className="py-10 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 text-center">
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} loopy. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
