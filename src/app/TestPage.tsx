"use client";

import { useState, useEffect, useRef } from "react";

const TYPING_SPEED = 75; // 타이핑 속도 (밀리초 단위)
const ERASING_SPEED = 100; // 지우기 속도 (밀리초 단위)
const DELAY_BEFORE_ERASE = 2000; // 문장 완성 후 지우기 전 대기 시간 (밀리초 단위)

const phrases: string[] = [
  "태양광? 그거 재활용도 안되는 쓰레기 아냐?",
  "전기 요금 올라간 원인이잖아!",
  "왜 하려는 거야 자꾸?",
];

const splitHangul = (str: string): string => {
  const INITIALS = "ᄀᄁᄂᄃᄄᄅᄆᄇᄈᄉᄊᄋᄌᄍᄎᄏᄐᄑᄒ";
  const MEDIALS = "ᅡᅢᅣᅤᅥᅦᅧᅨᅩᅪᅫᅬᅭᅮᅯᅰᅱᅲᅳᅴᅵ";
  const FINALS = "ᆨᆩᆪᆫᆬᆭᆮᆯᆰᆱᆲᆳᆴᆵᆶᆷᆸᆹᆺᆻᆼᆽᆾᆿᇀᇁᇂ";

  const split: string[] = str.split("").map((char: string): string => {
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

const combineHangul = (str: string): string => {
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

  for (const char of str) {
    if (INITIALS.includes(char)) {
      if (temp.length > 0) {
        result += temp;
        temp = "";
      }
      temp += char;
    } else if (MEDIALS.includes(char)) {
      temp += char;
    } else if (FINALS.includes(char)) {
      temp += char;
      const initialIndex = INITIALS.indexOf(temp[0]);
      const medialIndex = MEDIALS.indexOf(temp[1]);
      const finalIndex = FINALS.indexOf(temp[2]);

      const combinedChar = String.fromCharCode(
        0xac00 +
          initialIndex * 588 +
          medialIndex * 28 +
          (finalIndex >= 0 ? finalIndex : 0),
      );

      result += combinedChar;
      temp = "";
    } else {
      if (temp.length > 0) {
        result += temp;
        temp = "";
      }
      result += char;
    }
  }

  if (temp.length > 0) {
    result += temp;
  }

  return result;
};

const TestPage: React.FC = () => {
  const [currentText, setCurrentText] = useState<string>("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState<number>(0);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);

  const requestRef = useRef<number>();
  const start = useRef<number>(Date.now());

  const animate = (time: number) => {
    if (!isErasing) {
      const currentPhrase = phrases[currentPhraseIndex];
      const splitCurrentPhrase = splitHangul(currentPhrase);

      if (currentText.length < splitCurrentPhrase.length) {
        setCurrentText(splitCurrentPhrase.slice(0, currentText.length + 1));
      } else {
        setTimeout(() => setIsErasing(true), DELAY_BEFORE_ERASE);
      }
    } else {
      if (currentText.length > 0) {
        const words = currentText.split(" ");
        words.pop();
        setCurrentText(words.join(" "));
      } else {
        setIsErasing(false);
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      }
    }

    start.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [currentText, isErasing]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="container mx-auto mt-12 text-center">
      <h1 className="mb-4 text-2xl font-bold">
        태양광 하면 무슨 생각이 떠오르세요?
      </h1>
      <p aria-live="polite" className="inline-block text-lg">
        {combineHangul(currentText)}
        <span
          className={`inline-block border-r-2 border-black ${cursorVisible ? "opacity-100" : "opacity-0"}`}
        >
          |
        </span>
      </p>
    </div>
  );
};

export default TestPage;
