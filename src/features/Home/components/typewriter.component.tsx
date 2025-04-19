import { Pen } from "lucide-react";
import { useEffect, useState } from "react";

export function Typewriter({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const typingSpeed = 80;
    const deletingSpeed = 50;
    let timeout: number;

    if (!isDeleting && charIndex < text.length) {
      timeout = window.setTimeout(() => {
        setDisplayText(text.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex === text.length) {
      timeout = window.setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = window.setTimeout(() => {
        setDisplayText(text.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, deletingSpeed);
    } else if (isDeleting && charIndex === 0) {
      timeout = window.setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }

    return () => window.clearTimeout(timeout);
  }, [charIndex, isDeleting, text]);

  return (
    <h1 className="text-3xl sm:text-4xl lg:text-5xl text-center font-semibold tracking-tighter flex items-center">
      <span className="audiowideRegular">{displayText}</span>
      <span className="animate-pulse">
        <Pen className="h-9 w-9 sm:h-10 sm:w-10 lg:w-12 lg:h-12 ml-2" />
      </span>
    </h1>
  );
}
