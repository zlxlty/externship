/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useFlashcardStore } from "../stores/flashcardStore";
import { useCardDeck } from "../hooks/useAudioCard";

export default function CardPlayController({ className }) {
  const [cardIndex, setCardIndex] = useFlashcardStore((state) => [
    state.cardIndex,
    state.setCardIndex,
  ]);
  const cardDeckId = useFlashcardStore((state) => state.cardDeckId);
  const [frontFacing, setFrontFacing] = useFlashcardStore((state) => [
    state.frontFacing,
    state.setFrontFacing,
  ]);
  const [isPlaying, setIsPlaying] = useFlashcardStore((state) => [
    state.isPlaying,
    state.setIsPlaying,
  ]);

  const { cardDeck } = useCardDeck(cardDeckId);

  useEffect(() => {
    let interval = null;

    if (cardDeck && isPlaying) {
      interval = setInterval(() => {
        setFrontFacing(!frontFacing);
        !frontFacing && setCardIndex((cardIndex + 1) % cardDeck.content.length);
      }, 1500);
    }

    return () => clearInterval(interval);
  }, [
    cardDeck,
    cardIndex,
    frontFacing,
    setFrontFacing,
    isPlaying,
    setCardIndex,
  ]);

  function handlePlayingClick() {
    setIsPlaying(!isPlaying);
  }

  function handleNextCard() {
    setCardIndex((cardIndex + 1) % cardDeck.content.length);
    setFrontFacing(true);
  }

  function handlePreviousCard() {
    setCardIndex(
      (cardIndex - 1 + cardDeck.content.length) % cardDeck.content.length
    );
    setFrontFacing(true);
  }

  return (
    <main className={className}>
      <section className="flex justify-around items-center space-x-3">
        <svg
          onClick={handlePreviousCard}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-8 h-10 py-2 px-1 hover:bg-gray-200 active:scale-95"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>

        <svg
          onClick={handlePlayingClick}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-16 h-16 active:scale-95"
        >
          {isPlaying ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ) : (
            <>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
              />
            </>
          )}
        </svg>

        <svg
          onClick={handleNextCard}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-8 h-10 py-2 px-1 hover:bg-gray-200 active:scale-95"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </section>
    </main>
  );
}
