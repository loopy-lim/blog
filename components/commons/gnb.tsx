import Link from "next/link";

export default function Gnb() {
  return (
    <nav className="bg-background/30 fixed top-0 flex w-full items-center justify-between p-4 backdrop-blur-lg">
      <div className="text-lg font-bold">{"Loopy's Blog"}</div>
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
