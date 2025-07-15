import { Icons } from "@/contents/common/icons";
interface LinkwithIconProps {
  href: string;
  title: string;
}

const getIconByUrl = (url: string) => {
  switch (true) {
    case url.includes("github.com"):
      return Icons.GitHub;
    case url.includes("youtube.com") || url.includes("youtu.be"):
      return Icons.YouTube;
    default:
      return Icons.Chrome;
  }
};

export default function LinkWithIcon({ title, href }: LinkwithIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary flex items-center underline-offset-2 hover:underline"
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
