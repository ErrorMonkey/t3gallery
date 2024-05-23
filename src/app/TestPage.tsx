"use client";

import { useState, useEffect } from "react";

// 상수를 컴포넌트 외부로 이동
const TYPING_SPEED = 75; // 타이핑 속도 (밀리초 단위)
const ERASING_SPEED = 100; // 지우기 속도 (밀리초 단위)
const DELAY_BEFORE_ERASE = 2000; // 문장 완성 후 지우기 전 대기 시간 (밀리초 단위)

const phrases: string[] = [
  "태양광? 그거 재활용도 안되는 쓰레기 아냐?",
  "전기 요금 올라간 원인이잖아!",
  "왜 하려는 거야 자꾸?",
];

// 한글 자모 분리 함수
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

// 한글 자모 결합 함수
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

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase: string = phrases[currentPhraseIndex];
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
          const words = currentText.split(" ");
          words.pop();
          setCurrentText(words.join(" "));
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

  const frameCount = 60;
  // const canvas = document.querySelector("canvas");

  // if (canvas != null) {
  //   const context = canvas.getContext("2d");

  //   const currentFrame = (index) => {
  //     `/videos/panel/output_${index.toString().padStart(4, "0")}.avif`;

  //     const img = new Image();
  //     img.src = currentFrame(1);

  //     img.onload = () => {
  //       context?.drawImage(img, 0, 0);
  //     };
  //   };
  // }

  return (
    <div className="container mx-auto mt-12 flex flex-col text-center">
      <h1 className="mb-4 text-4xl font-bold">
        태양광 하면 무슨 생각이 떠오르세요?
      </h1>
      <p aria-live="polite" className="inline-block text-2xl">
        {combineHangul(currentText)}
        <span className="inline-block animate-blink border-r-2 border-black">
          |
        </span>
      </p>
      {/* <video autoPlay muted className="m-[-10em] w-[100em]">
        <source src="/videos/avifTest.avif" />
      </video> */}
      <canvas>
        <img className="w-full" src="/videos/panel/output_0001.avif" />
      </canvas>
    </div>
  );
};

export default TestPage;
