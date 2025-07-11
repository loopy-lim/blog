export default function Gnb() {
  return (
    <nav className="bg-background/30 fixed top-0 z-50 w-full backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex w-full items-center justify-between p-4">
        <div className="text-lg font-bold">{"Loopy's Blog"}</div>
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="hover:underline">
              About
            </a>
          </li>
          <li>
            <a href="/contact" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
