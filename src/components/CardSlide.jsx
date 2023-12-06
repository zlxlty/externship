/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFlashcardStore } from "../stores/flashcardStore";
import { useCardDeck } from "../hooks/useAudioCard";
import { upsertCardDeck } from "../backend";
import axios from "axios";
import { BACKEND_URL, USERID_TOKEN } from "../constants";

export default function CardSlide({ className }) {
  const [cardIndex, setCardIndex] = useFlashcardStore((state) => [
    state.cardIndex,
    state.setCardIndex,
  ]);
  const cardDeckId = useFlashcardStore((state) => state.cardDeckId);
  const [frontFacing, setFrontFacing] = useFlashcardStore((state) => [
    state.frontFacing,
    state.setFrontFacing,
  ]);

  const { cardDeck, mutate } = useCardDeck(cardDeckId);

  const [isEditing, setIsEditing] = useState(false);
  const frontInputRef = useRef("");
  const backInputRef = useRef("");

  useEffect(() => {
    if (cardDeck) {
      frontInputRef.current = cardDeck.content[cardIndex].front;
      backInputRef.current = cardDeck.content[cardIndex].back;
    }
  }, [cardDeck, cardIndex]);

  function handleFrontChange(e) {
    frontInputRef.current = e.target.value;
  }

  function handleBackChange(e) {
    backInputRef.current = e.target.value;
  }

  function handleCardClick() {
    !isEditing && setFrontFacing(!frontFacing);
  }

  function handleEditSave() {
    if (isEditing) {
      const newCardDeck = { ...cardDeck };
      newCardDeck.content[cardIndex].front = frontInputRef.current;
      newCardDeck.content[cardIndex].back = backInputRef.current;
      upsertCardDeck(newCardDeck).then(() => {
        mutate(newCardDeck);
        setIsEditing(false);
      });

      const requestBody = {
        id:
          localStorage.getItem(USERID_TOKEN) +
          newCardDeck.content[cardIndex].id,
        front: newCardDeck.content[cardIndex].front,
        back: newCardDeck.content[cardIndex].back,
      };

      axios
        .post(`${BACKEND_URL}/create-card/`, requestBody)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  }

  function handleCardDelete() {
    const newCardDeck = { ...cardDeck };
    newCardDeck.content.splice(cardIndex, 1);
    upsertCardDeck(newCardDeck).then(() => {
      mutate(newCardDeck);
      setCardIndex(cardIndex - 1 < 0 ? 0 : cardIndex - 1);
      setIsEditing(false);
    });
  }

  function handleCreateCard() {
    const newCardDeck = { ...cardDeck };
    newCardDeck.content.push({ id: uuidv4(), front: "", back: "" });
    upsertCardDeck(newCardDeck).then(() => {
      mutate(newCardDeck).then(() => {
        setCardIndex(newCardDeck.content.length - 1);
        setIsEditing(true);
      });
    });
  }

  return (
    <>
      <main className={className}>
        <section className="relative flex justify-center items-center z-50">
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
              <div className="flex flex-col w-full h-full p-2 gap-2">
                <div className="grid grid-cols-2 w-full h-full gap-1">
                  <textarea
                    onChange={handleFrontChange}
                    maxLength={200}
                    className="textarea textarea-primary text-base resize-none"
                    placeholder="Front Content"
                  >
                    {frontInputRef.current}
                  </textarea>
                  <textarea
                    onChange={handleBackChange}
                    maxLength={200}
                    className="textarea textarea-primary text-base resize-none"
                    placeholder="Back Content"
                  >
                    {backInputRef.current}
                  </textarea>
                </div>
                <div className="w-full flex justify-end items-center gap-2">
                  <button
                    onClick={handleEditSave}
                    className="btn btn-sm btn-neutral w-16"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCardDelete}
                    className="btn btn-sm btn-outline btn-secondary w-16"
                  >
                    Delete
                  </button>
                </div>
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
            {!isEditing && (
              <>
                <svg
                  onClick={handleCreateCard}
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

                <svg
                  onClick={() => setIsEditing(true)}
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
              </>
            )}
          </div>
        </section>
      </main>
      <section
        className={`fixed w-screen h-screen z-40 bg-gray-500/40 ${
          isEditing ? "" : "hidden"
        }`}
      ></section>
    </>
  );
}
