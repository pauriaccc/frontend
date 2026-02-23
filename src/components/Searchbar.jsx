import { useState, useEffect } from "react";

export default function SearchBar({ words, value, onChange }) {
  const [text, setText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!deleting) {
        setText("Search " + currentWord.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);

        if (charIndex + 1 === currentWord.length) {
          setTimeout(() => setDeleting(true), 1000);
        }
      } else {
        setText("Search " + currentWord.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);

        if (charIndex - 1 === 0) {
          setDeleting(false);
          setWordIndex((wordIndex + 1) % words.length);
        }
      }
    }, deleting ? 100 : 150);

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(internalValue);
    }, 300);

    return () => clearTimeout(handler);
  }, [internalValue, onChange]);

  return (
    <input
      type="text"
      className="searchbar"
      placeholder={text}
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
    />
  );
}