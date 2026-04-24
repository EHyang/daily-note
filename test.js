const a = {"str":"Hello, さようならありがとう、ジミ。 ", dictionary: {brandDictionary:{"さようなら":"안녕 일본어","Hello":"헬로 일본어"}, language: "ja-JP"}}

const changeDictionary = ({
  str,
  dictionary: {
    language = 'common',
    brandDictionary = {},
  }
}) => {
  console.log(JSON.stringify({ str, brandDictionary, language }));

  const NON_SPACED_LANGUAGES = ["ja-JP", "zh-CN", "zh-TW", "zh-HK", "yue-CN", "th-TH", "km-KH", "my-MM"].map(lang => lang.toLowerCase());

  if (NON_SPACED_LANGUAGES.includes(language.toLowerCase())) {
    const pattern = Object.keys(brandDictionary)
      .sort((a, b) => b.length - a.length)
      .join('|');

    return str.replace(new RegExp(pattern, 'g'), (match) => brandDictionary[match] || match);
  }

  const pattern = Object.keys(brandDictionary)
    .sort((a, b) => b.length - a.length)
    .map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const regex = new RegExp(`(?<=[\\s,.!?]|^)(?:${pattern})(?=[\\s,.!?]|$)`, 'g');
  return str.replace(regex, (match) => brandDictionary[match] || match);
}

console.log(changeDictionary(a));