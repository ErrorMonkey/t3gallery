// utils/hangul.ts

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

export const splitHangul = (str: string): string => {
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

export const combineHangul = (str: string): string => {
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
