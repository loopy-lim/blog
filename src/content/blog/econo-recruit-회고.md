---
title: 'Econo Recruit 회고'
description: 'Econo Recruit 회고입니다.'
pubDate: '2023/10/20'
heroImage: '/blog-placeholder-3.jpg'
---

드디어 Econovation Recruit가 끝이났다. 실제로 사람들이 사용하는 첫번째 프로젝트였다. 처음하는 것만큼 안전성에 목적을 두었고, 문제없이 잘 마무리가 되었다.

### 이 프로젝트를 시작하게된 계기

이 프로젝트는 신입모집 동아리 사람들의 불편으로부터 시작되었다. 총 인원이 30명 가량 있는 Econovation(동아리)는 서류와 면접을 통해서 신입 기수를 모집한다. 사람을 뽑는데 고려를 많이 하려고 하니, 다양한 툴을 사용하게 되었다. 나열을 하자면 피그마, 노션, 구글 form, 트렐로, 메일, 문자, 엑셀, 쉐어포인트 등 진행 상황이나 데이터를 공유하는 사이트를 사용하였다. 그러다보니 데이터의 분산이 이루어지며 서로 관계가 복잡해져 신입모집을 하는데 불편하였다.

### 그래서 어떤 프로젝트인데?

이 프로젝트는 신입모집을 하는데 전반적인 모든 편의 기능을 넣는 프로젝트이다. Designer가 1명, Backend 1명, 그리고 Frontend 2명에서 진행했으며 다음과 같은 기능이 주를 이루었다.

1. google form의 역활을 하는 기능인 서류 제출 기능
2. 트렐로처럼 제출한 서류를 칸반 형태로 관리하는 기능
3. 서류를 제출할 때 문자와 메일을 보내는 기능
4. 면접때 녹화한 영상과 면접기록을 보면서 점수를 기록하는 기능

나는 이 프로젝트에서 1~3, backborn을 담당하여 개발을 진행했었다.

## 그럼 어떤 사람들이 썼을까?

첫번째 사용자로서 Recruit TF팀이 사용하였다. 이들은 지원자들의 지원서와 면접 자료들을 쉽게 보기위해서 사용하였다. 두번째 사용자로서 에코노베이션에 들어가려는 사람들이 사용하였다. 지원서를 제출하며, 자신이 썼던 지원서 내용을 볼 수 있다.

### 어떤 문제와 직면했고 어떻게 해결했을까?

#### 보안문제

이 웹은 각 페이지마다 로그인을 하는지 안하는지 검사해야했다. 각 사람들의 개인 정보에 대해서 물어보고 수집하기 때문에 면접 이외의 목적에는 사용하지 않기 위해, 그리고 유출을 금하기 위해서 로그인 시스템을 도입해야했다.

사용자의 로그인 여부와 관리를 쉽게 하기 위해서 axios instance를 나누어서 개발하였고, 또한 Component를 만들어 선언적하면 적용할 수 있게 하였다. 403, 401같은 경우에는 로그인이 되어 있더라도 실패로 간주하고 로그인페이지로 보내었다. 이를 통해서 로그인으로 가는 버튼을 제거하였다.(member only이기 때문이다)

```tsx
"use client";

import { localStorage } from "@/src/functions/localstorage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Validate = () => {
  const router = useRouter();

  useEffect(() => {
    if (
      localStorage.get("accessToken", "") === "" ||
      localStorage.get("refreshToken", "") === ""
    ) {
      alert("로그인이 필요합니다.");
      router.replace("/signin");
      return;
    }
  }, []);
  return null;
};

export default Validate;
```

위와 같은 코드를 보면 토큰이 없다면 모든 history path를 날리고 로그인 페이지로 이동하게 하였다.

```tsx
if (error.response.status === 401 || error.response.status === 403) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("로그인이 필요합니다.");
    window.location.href = "/signin";
  }
```

또한 에러의 코드가 403, 401인 경우 토큰을 삭제하였다.

#### 메일, 문자 문제

도입된지 하루만에 급하게 연락이 와 메일, 문자에 대해 자동화를 해달라고 연락이 왔다. 이들의 기능은 돈이 들어가거나 구현하기 복잡한 문제를 가진 것 뿐이었다.

1. 문자 구현

    이 문자 문제는 기존에 node로 짜여져 있는 코드가 있어 nextjs를 사용하는 이 프로젝트에서 쓰기 적절했다. 주어진 문구와 parameter로 데이터를 받아 문자를 보내었다.

2. 메일 구현

    메일에서 보여지는 web spec은 우리가 브라우저에서 쓰는 스펙과 많이 다르다. table로 디자인을 하는 경우도 있고, flex, grid는 안되는 곳이 허수였다. 메일전용으로 만드는 페이지를 만들고 외부로 가는 링크를 만들어 지원자가 보낸 지원서를 확인할 수 있게 하였다. 지원서에 해당하는 아이디가 UUIDv4로 작성되어 있기 때문에 주입을 해주어야 하는데, 백엔드와 협업하여 `%APPLICANT_ID%`를 replace하여 바꾸는 형태로 해결했다.

#### 백업 문제

우리의 사이트는 어떠한 일이 있더라도 사용자가 제출한 데이터가 삭제되면 안됬다. 그렇기 때문에 여러가지 안전장치를 만들었다.

1. localstorage를 이용한 사용자 local에서 저장하는 방법
2. nextjs안에 있는 sqlite를 이용하여 저장하는 방법

이 프로젝트는 위 2가지를 이용하여 백업을 처리했는데(물론 백엔드에서도 DB 이중화를 했다) 할 수 있었던 이유는, 모든 질문에 대한 응답은 JSON 객체로 변환이 가능했기 때문이고, 단순 백업 용도이기 때문에 간단한 database구조를 가졌기 때문이다. 실제로 1건에 대해서 이 데이터베이스에서 복구하여 사용하였다.

#### 질문이 쉽게 변경될 수 있는 문제

프로젝트를 만들고 있는 와중에도 질문이 변경되었었다. 매번 질문이 변경될 때마다 디자이너에게 물어보거나, 그게 맞추어서 개발을 진행하기에 비용이 너무 많이 들을 것 같아 모듈화를 하였다. 형태는 Flex를 본 따서 만들었고, 각 type마다 다르게 보이거나 데이터를 쓸 수 있도록 하였다.

```ts
import { ApplicantReq } from "@/src/apis/applicant/applicant";
import dynamic from "next/dynamic";
import { FC } from "react";

const ApplicantCustomField = dynamic(
  () => import("./applicantNode/CustomField.component")
);
// ...다양한 dynamic import

interface JunctionApplicantProps {
  applicantNodeData: ApplicantNode;
  data: ApplicantReq[];
}

export const JunctionApplicant: FC<JunctionApplicantProps> = ({
  applicantNodeData,
  data: applicantData,
}) => {
  const jsxNode = {
    customField: (
      <ApplicantCustomField nodeData={applicantNodeData} data={applicantData} />
    ),
    customHuman: (
      <ApplicantCustomHuman nodeData={applicantNodeData} data={applicantData} />
    ),
  // ..다양한 구분자들
  };

  return jsxNode[applicantNodeData.type] ?? <></>;
};
```

위 코드를 보면 applicationNodeData의 타입에 따라서 object에 접근하는 형태로 썼었다. 이런식으로 지원서 내 질문의 형태를 나누었다. 지원서의 Layout또한 이런식으로 나누어 다양한 component와 layout을 만들어 쉽게 조합하게 만들었다.

지금 생각해보면 typescript를 이용하기 때문에 상표를 붙여 활용하는 것도 나쁘지 않겠다라는 생각을 해본다.

#### 칸반보드

칸반보드는 trello에서 maintainer로 사용하고 있는 <https://github.com/atlassian/react-beautiful-dnd를> 기반으로 작성하였다. 한 곳에서만 칸반보드를 옮면 사실 쉽게 코드를 작성할 수 있었다. 하지만 우리의 기능은 trello처럼 칸반을 자유롭게 생성하고 움직이는 것을 목표로 하였다. 이 또한 백엔드와 많은 데이터 형태를 고려하여 다음과 같은 스펙을 정하였다.

1. 첫번째는 보이지 않는 card가 있다.
2. 모든 카드는 nextBoardId를 가지고 있다.
3. 마지막 카드의 nextBoardId는 null이다.
4. 모든 데이터는 1부터 시작한다.
5. 데이터를 옮길 때 boardId와 targetBoardId를 지정하여, targetBoardId밑으로 옮겨진다.

이 경우를 가지고 복잡하지만 다음과 같은 형태로 코드가 이루어진다.

```tsx
export const getFromToIndexDefault = (
  kanbanData: KanbanColumnData[],
  result: DropResult
): { boardId: number; targetBoardId: number } => {
  if (!result.destination) return { boardId: 0, targetBoardId: 0 };

  const from = result.source;
  const to = result.destination;

  const boardId = kanbanData[+from.droppableId].card[from.index]?.boardId ?? 0;

  const targetBoardId =
    to.droppableId !== from.droppableId && to.index < from.index
      ? kanbanData[+to.droppableId].card[to.index - 1]?.boardId ??
        kanbanData[+to.droppableId].card[0]?.boardId ??
        0
      : kanbanData[+to.droppableId].card[to.index]?.boardId ?? 0;

  return { boardId, targetBoardId };
};
```

설명하자면 column이 움직일때가 있고, default(카드 한개)가 옮겨질 대가 있는데, 이는 default가 옮겨질 때이다. targetBoardId가 가장 복잡하게 설정되는데 해석하자면 다음과 같다.

1. 옮기고자 하는 곳과 옮긴 곳의 column이 같고 to보다 from이 더 큰경우 -1을 하지 않고 넣는다.

    이 이유는 같은 곳에서 옮길 때에 자신이 있는 곳에서는 미리 더해진 상태로 움직인다는 계산이 있기 때문이다.(이미 그 자리를 차지하고 있음)

2. 그렇지 않은 경우에는 -1을 빼서 움직인다

    하지만 -1이 없는 경우undefined일 수 있다(0개인 경우). 그럴 때는 미리 사전에 말해둔 상태인 맨 위의 것은 0 으로 이동한다.

이와 같이 움직이면 column간 데이터의 이동이 자유롭게 설정된다.

### 얻은것과 회고

사실상 첫번째로 사용자에 대한 피드백을 받을 수 있었던 프로젝트였다. 다행이 backend와 frontend간의 소통이 매우 잘 되어서(예를 들면 어디에서 데이터를 처리 할 것인가, 정책) 사람에 대한 스트레스나 프로젝트에 대한 스트레스는 없었다. 하지만 의도치 않는 피드백이 요청되어서 놀랐다. 나도 이 리크루트 프로세스의 불편한 점을 개선하기 위해서 개발을 시작하였고 대부분의 불편한 점을 개선하였다고 생각했지만, 사용자들은 자신의 일을 줄이는 자동화에 대해서 더욱 관심을 가졌었다.(당연한 일인건가?)

사실 요청사항이나 개발 요구사항에는 모두 완성된 것이 아니었다. 실제로 실험적 기능을 가진 사이트였고 다행이 성공적으로 마무리가 될 수 있었다. 그렇기 때문에 개선해야할 점이 많아보인다.

1. lazy loading을 통해서 빠른 사이트의 접근을 노렸지만, 오히려 로딩바가 깜박이며 보여 불편함을 보였다.
2. 에러가 나더라도 사용자가 쉽게 보내줄 수 없었다. Sentry.io를 통해서 로깅을 해보고 싶다.
3. A/B테스트를 통해서 사용자가 어떤 화면을 선호하는지 확인해보고 싶다.

사용자들에게 피드백을 받는 것이 정말 좋은 경험임이 틀림 없다는 것을 배웠다. 항상 생각보다 사용자들의 생각은 내 생각과 다르고 또 맞는 것도 있다는 것을 배웠다. 새로운 프로젝트를 시작할 때 더 나은 고민을 하고자 한다.
