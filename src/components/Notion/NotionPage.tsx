import { NotionRenderer } from "react-notion-x";
import type { ExtendedRecordMap } from "notion-types";
import { Code } from "react-notion-x/build/third-party/code";
import { Collection } from "react-notion-x/build/third-party/collection";
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import { Image } from "astro:assets";
import { useEffect, useState } from "react";

interface NotionPageProps {
  recordMap: ExtendedRecordMap;
}

export const NotionPage = ({ recordMap }: NotionPageProps) => {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <NotionRenderer
      recordMap={recordMap}
      darkMode={darkMode}
      previewImages={true}
      fullPage={true}
      components={{ Code, Collection, nextImage: Image }}
    />
  );
};
