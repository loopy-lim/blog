import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Element, Parent } from "hast";

// 파싱할 JSON 데이터의 타입을 정의합니다.
interface NotionImageData {
  src: string;
  // 다른 속성들이 있을 수 있으므로 인덱스 시그니처를 추가합니다.
  [key: string]: unknown;
}

// Rehype 플러그인의 타입을 명시합니다.
// 이 플러그인은 옵션을 받지 않으며, HAST의 Root를 처리합니다.
const rehypeNotionImage: Plugin<[], Root> = () => {
  // Transformer 함수. HAST 트리 전체를 받아서 변환을 수행합니다.
  return (tree: Root) => {
    // `visit` 유틸리티를 사용해 트리를 순회합니다.
    // 타입 단언(as 'element')을 통해 방문하는 노드가 Element 타입임을 명시할 수 있습니다.
    visit(tree, "element", (node: Element, index?: number, parent?: Parent) => {
      // 부모 노드나 인덱스가 없으면 작업을 수행할 수 없으므로 반환합니다.
      if (!parent || typeof index !== "number") {
        return;
      }

      const firstChild = node.children[0];

      // 1. 노드가 <p> 태그인지 확인합니다.
      // 2. 자식 노드가 정확히 하나만 있고, 그 타입이 'text'인지 타입 가드를 통해 확인합니다.
      if (
        node.tagName === "p" &&
        node.children.length === 1 &&
        firstChild?.type === "text"
      ) {
        // 타입 가드를 통과했으므로, 이제 firstChild는 Text 타입으로 안전하게 추론됩니다.
        const textNode = firstChild;
        const textValue = textNode.value.trim();

        // 3. 텍스트 내용이 우리가 찾는 이미지 데이터 문자열인지 확인합니다.
        if (textValue.startsWith("__astro_image_=")) {
          try {
            const jsonString = textValue.replace(/^__astro_image_=/, "");
            const imageData = JSON.parse(jsonString) as NotionImageData;

            // 4. imageData.src가 문자열인지 한 번 더 확인하여 런타임 에러를 방지합니다.
            if (imageData && typeof imageData.src === "string") {
              const src = imageData.src.replace(/^(\.\.\/)*public/, "");

              // 5. 교체할 새로운 <img> 노드를 Element 타입에 맞게 생성합니다.
              const newImageNode: Element = {
                type: "element",
                tagName: "img",
                properties: {
                  src: src,
                  alt: "Image from Notion",
                },
                children: [],
              };

              // 6. 부모 노드의 자식 목록에서 현재 <p> 노드를 새 <img> 노드로 교체합니다.
              parent.children[index] = newImageNode;
            }
          } catch (e) {
            console.error("Failed to parse or process Notion image data:", e);
          }
        }
      }
    });
  };
};

export default rehypeNotionImage;
