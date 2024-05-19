"use client";

import { useState, useEffect } from "react";

// 상수를 컴포넌트 외부로 이동
const TYPING_SPEED = 75; // 타이핑 속도 (밀리초 단위)
const ERASING_SPEED = 100; // 지우기 속도 (밀리초 단위)
const DELAY_BEFORE_ERASE = 2000; // 문장 완성 후 지우기 전 대기 시간 (밀리초 단위)

const phrases = [
  "태양광? 그거 재활용도 안되는 쓰레기 아냐?",
  "전기 요금 올라간 원인이잖아!",
  "왜 하려는 거야 자꾸?",
];

// 한글 자모 분리 함수
const splitHangul = (str) => {
  const INITIALS = "ᄀᄁᄂᄃᄄᄅᄆᄇᄈᄉᄊᄋᄌᄍᄎᄏᄐᄑᄒ";
  const MEDIALS = "ᅡᅢᅣᅤᅥᅦᅧᅨᅩᅪᅫᅬᅭᅮᅯᅰᅱᅲᅳᅴᅵ";
  const FINALS = "ᆨᆩᆪᆫᆬᆭᆮᆯᆰᆱᆲᆳᆴᆵᆶᆷᆸᆹᆺᆻᆼᆽᆾᆿᇀᇁᇂ";

  const split = str.split("").map((char) => {
    const code = char.charCodeAt(0);

    if (code >= 0xac00 && code <= 0xd7a3) {
      const initial = Math.floor((code - 0xac00) / 588);
      const medial = Math.floor(((code - 0xac00) % 588) / 28);
      const final = (code - 0xac00) % 28;

      return [
        INITIALS[initial],
        MEDIALS[medial],
        final === 0 ? "" : FINALS[final - 1],
      ].join("");
    }

    return char;
  });

  return split.join("");
};

// 한글 자모 결합 함수
const combineHangul = (str) => {
  const INITIALS = "ᄀᄁᄂᄃᄄᄅᄆᄇᄈᄉᄊᄋᄌᄍᄎᄏᄐᄑᄒ";
  const MEDIALS = "ᅡᅢᅣᅤᅥᅦᅧᅨᅩᅪᅫᅬᅭᅮᅯᅰᅱᅲᅳᅴᅵ";
  const FINALS = [
    "",
    "ᆨ",
    "ᆩ",
    "ᆪ",
    "ᆫ",
    "ᆬ",
    "ᆭ",
    "ᆮ",
    "ᆯ",
    "ᆰ",
    "ᆱ",
    "ᆲ",
    "ᆳ",
    "ᆴ",
    "ᆵ",
    "ᆶ",
    "ᆷ",
    "ᆸ",
    "ᆹ",
    "ᆺ",
    "ᆻ",
    "ᆼ",
    "ᆽ",
    "ᆾ",
    "ᆿ",
    "ᇀ",
    "ᇁ",
    "ᇂ",
  ];

  let result = "";
  let temp = "";

  for (let i = 0; i < str.length; i++) {
    if (INITIALS.includes(str[i])) {
      if (temp.length > 0) {
        result += temp;
        temp = "";
      }
      temp += str[i];
    } else if (MEDIALS.includes(str[i])) {
      temp += str[i];
    } else if (FINALS.includes(str[i])) {
      temp += str[i];
      const initialIndex = INITIALS.indexOf(temp[0]);
      const medialIndex = MEDIALS.indexOf(temp[1]);
      const finalIndex = FINALS.indexOf(temp[2]);

      const combinedChar = String.fromCharCode(
        0xac00 + initialIndex * 588 + medialIndex * 28 + finalIndex,
      );

      result += combinedChar;
      temp = "";
    } else {
      if (temp.length > 0) {
        result += temp;
        temp = "";
      }
      result += str[i];
    }
  }

  if (temp.length > 0) {
    result += temp;
  }

  return result;
};

const TestPage = () => {
  const [currentText, setCurrentText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      const splitCurrentPhrase = splitHangul(currentPhrase);

      if (!isErasing) {
        // 타이핑 효과
        if (currentText.length < splitCurrentPhrase.length) {
          setCurrentText(splitCurrentPhrase.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsErasing(true), DELAY_BEFORE_ERASE);
        }
      } else {
        // 지우기 효과
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, currentText.lastIndexOf(" ")));
        } else {
          setIsErasing(false);
          setCurrentPhraseIndex(
            (prevIndex) => (prevIndex + 1) % phrases.length,
          );
        }
      }
    };

    const typingTimeout = setTimeout(
      handleTyping,
      isErasing ? ERASING_SPEED : TYPING_SPEED,
    );

    return () => clearTimeout(typingTimeout); // 클린업 타이머
  }, [currentText, isErasing]);

  return (
    <div
      className="container"
      style={{ textAlign: "center", marginTop: "50px" }}
    >
      <h1>태양광 하면 무슨 생각이 떠오르세요?</h1>
      <p>{combineHangul(currentText)}</p>
    </div>
  );
};

export default TestPage;
