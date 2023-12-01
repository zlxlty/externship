/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useFlashcardStore } from "../stores/flashcardStore";
import { useCardDeck } from "../hooks/useAudioCard";
import { upsertCardDeck } from "../backend";

export default function CardSlide({ className }) {
  const cardIndex = useFlashcardStore((state) => state.cardIndex);
  const cardDeckId = useFlashcardStore((state) => state.cardDeckId);
  const [frontFacing, setFrontFacing] = useFlashcardStore((state) => [
    state.frontFacing,
    state.setFrontFacing,
  ]);

  const { cardDeck, mutate } = useCardDeck(cardDeckId);

  const [isEditing, setIsEditing] = useState(false);
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  useEffect(() => {
    if (cardDeck) {
      frontInputRef.current = cardDeck.content[cardIndex].front;
      backInputRef.current = cardDeck.content[cardIndex].back;
    }
  }, [cardDeck, cardIndex]);

  function handleCardClick() {
    !isEditing && setFrontFacing(!frontFacing);
  }

  function handleEditClick() {
    if (isEditing) {
      const newCardDeck = { ...cardDeck };
      newCardDeck.content[cardIndex].front = frontInputRef.current;
      newCardDeck.content[cardIndex].back = backInputRef.current;
      upsertCardDeck(newCardDeck).then(() => mutate(newCardDeck));
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }

  function handleFrontChange(e) {
    frontInputRef.current = e.target.value;
  }

  function handleBackChange(e) {
    backInputRef.current = e.target.value;
  }

  return (
    <main className={className}>
      <section className="relative flex justify-center items-center">
        <div
          onClick={handleCardClick}
          style={{
            backgroundColor: frontFacing
              ? "rgb(241 245 249)"
              : "rgb(226 232 240)",
          }}
          className="w-[40vw] h-[30vh] text-center flex justify-center items-center text-lg select-none rounded-md shadow-xl"
        >
          {isEditing ? (
            <div className="grid grid-cols-2 w-full h-full p-[5px] gap-1">
              <textarea
                maxLength={200}
                onChange={handleFrontChange}
                className="textarea textarea-primary text-base resize-none"
                placeholder="Front Content"
              >
                {frontInputRef.current}
              </textarea>
              <textarea
                maxLength={200}
                onChange={handleBackChange}
                className="textarea textarea-primary text-base resize-none"
                placeholder="Back Content"
              >
                {backInputRef.current}
              </textarea>
            </div>
          ) : (
            <p className="text-xl">
              {cardDeck
                ? cardDeck.content[cardIndex][frontFacing ? "front" : "back"]
                : "loading..."}
            </p>
          )}
        </div>
        <div className="absolute top-0 -right-3 flex flex-col justify-center items-center gap-2 translate-x-[100%] text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 hover:scale-105 active:scale-95"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          <div onClick={handleEditClick}>
            {isEditing ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7 ml-[2px] hover:scale-105 active:scale-95 text-accent"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7 ml-[2px] hover:scale-105 active:scale-95"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
