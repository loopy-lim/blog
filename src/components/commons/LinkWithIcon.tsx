interface LinkwithIconProps {
  href: string;
  title: string;
}

const Icons = [
  {
    name: "GitHub",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg",
  },
  {
    name: "YouTube",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg",
  },
  {
    name: "Chrome",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlechrome.svg",
  },
];

const getIconByUrl = (url: string) => {
  switch (true) {
    case url.includes("github.com"):
      return Icons.find((icon) => icon.name === "GitHub")?.icon;
    case url.includes("youtube.com") || url.includes("youtu.be"):
      return Icons.find((icon) => icon.name === "YouTube")?.icon;
    default:
      return Icons.find((icon) => icon.name === "Chrome")?.icon;
  }
};

export default function LinkWithIcon({ title, href }: LinkwithIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-[#003df4] underline-offset-2 hover:underline"
    >
      <img
        src={getIconByUrl(href)}
        alt={title}
        className="mr-1 inline-block h-4 w-4"
        style={{
          filter:
            "invert(14 %) sepia(66%) saturate(6181%) hue-rotate(228deg) brightness(101%) contrast(111%)",
        }}
        loading="lazy"
      />
      {title}
    </a>
  );
}
