/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useFlashcardStore } from "../stores/flashcardStore";
import { useAuthStore } from "../stores/authStore";
import { useCardDeck } from "../hooks/useAudioCard";
import { updateCard, addCard, deleteCard } from "../backend";
import { BACKEND_URL } from "../constants";
import axios from "axios";

export default function CardSlide({ className }) {
  const [cardIndex, setCardIndex] = useFlashcardStore((state) => [
    state.cardIndex,
    state.setCardIndex,
  ]);
  const cardDeckId = useFlashcardStore((state) => state.cardDeckId);
  const [addAudioProcessing, removeAudioProcessing] = useFlashcardStore(
    (state) => [state.addAudioProcessing, state.removeAudioProcessing]
  );
  const [frontFacing, setFrontFacing] = useFlashcardStore((state) => [
    state.frontFacing,
    state.setFrontFacing,
  ]);

  const currentUser = useAuthStore((state) => state.currentUser);

  const { cardDeck, mutate } = useCardDeck(cardDeckId);

  const [isEditing, setIsEditing] = useState(false);
  const frontInputRef = useRef("");
  const backInputRef = useRef("");

  useEffect(() => {
    if (cardDeck && cardDeck.content[cardIndex]) {
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
      updateCard(
        currentUser.sub,
        cardDeckId,
        cardIndex,
        newCardDeck.content[cardIndex]
      ).then(() => mutate());
      mutate(newCardDeck, { revalidate: false }).then(() => {
        setIsEditing(false);
      });

      const requestBody = {
        front: newCardDeck.content[cardIndex].front,
        back: newCardDeck.content[cardIndex].back,
      };

      addAudioProcessing();
      axios
        .post(`${BACKEND_URL}/create-card/`, requestBody)
        .then(() => removeAudioProcessing())
        .catch((err) => console.log(err));
    }
  }

  function handleCardDelete() {
    const newCardDeck = { ...cardDeck };
    newCardDeck.content.splice(cardIndex, 1);
    //TODO mutate before delete
    deleteCard(currentUser.sub, cardDeckId, cardIndex).then(() => mutate());
    mutate(newCardDeck, { revalidate: false }).then(() => {
      setCardIndex(cardIndex - 1 < 0 ? 0 : cardIndex - 1);
      setIsEditing(false);
    });
  }

  function handleCreateCard() {
    frontInputRef.current = "";
    backInputRef.current = "";
    const newCardDeck = { ...cardDeck };
    newCardDeck.content.push({ front: "", back: "" });
    addCard(currentUser.sub, cardDeckId).then(() => mutate());
    mutate(newCardDeck, { revalidate: false }).then(() => {
      setCardIndex(newCardDeck.content.length - 1);
      setIsEditing(true);
    });
  }

  function renderCardText() {
    if (!currentUser) return "Please log in";
    if (!cardDeckId) return "Please select a card deck.";
    if (!cardDeck) return "loading...";
    if (cardDeck.content.length === 0) {
      return "Please create a card.";
    } else {
      return cardDeck.content[cardIndex][frontFacing ? "front" : "back"];
    }
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
                    maxLength={300}
                    className="textarea textarea-primary text-base resize-none"
                    placeholder="Front Content"
                  >
                    {frontInputRef.current}
                  </textarea>
                  <textarea
                    onChange={handleBackChange}
                    maxLength={300}
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
              <p className="text-xl">{renderCardText()}</p>
            )}
          </div>
          <div className="absolute top-0 -right-3 flex flex-col justify-center items-center gap-2 translate-x-[100%] text-primary">
            {!isEditing && (
              <>
                {cardDeck && (
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
                )}
                {cardDeck && cardDeck.content.length > 0 && (
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
                )}
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
