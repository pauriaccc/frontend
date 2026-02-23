import { useState, useEffect } from "react";

function Typewriter(props) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const deleteAfter = props.deleteAfter !== undefined ? props.deleteAfter : true;

  useEffect(() => {
    if (!props.words || !props.words.length) return;

    const currentWord = props.words[wordIndex];
    if (typeof currentWord !== "string") return;

    const timeout = setTimeout(() => {
      if (!deleting) {
        setText((props.prefix ? props.prefix : "") + currentWord.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);

        if (charIndex + 1 === currentWord.length) {
          if (!deleteAfter) return;
          setTimeout(() => setDeleting(true), 1000);
        }
      }
      else {
        setText((props.prefix ? props.prefix : "") + currentWord.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);

        if (charIndex - 1 === 0) {
          setDeleting(false);
          setWordIndex((wordIndex + 1) % props.words.length);
        }
      }
    }, deleting ? 150 / 1.5 : 150);

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, props.words, props.prefix, deleteAfter]);

  useEffect(() => {
    if (props.onChange) props.onChange(text);
  }, [text, props]);

  return props.returnText ? text : <span>{text}</span>;
}

export default Typewriter;