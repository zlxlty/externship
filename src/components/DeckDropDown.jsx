/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { useFlashcardStore } from "../stores/flashcardStore";
import { useCardDeck, useDeckInfo } from "../hooks/useAudioCard";
import { addCardDeck, deleteCardDeck, upsertCardDeck } from "../backend";

import "./DeckDropDown.css";

export default function DeckDropDown({ className }) {
  const cardDeckId = useFlashcardStore((state) => state.cardDeckId);
  const setCardDeckId = useFlashcardStore((state) => state.setCardDeckId);
  const setCardIndex = useFlashcardStore((state) => state.setCardIndex);
  const setFrontFacing = useFlashcardStore((state) => state.setFrontFacing);

  const { cardDeck, mutate: mutateCardDeck } = useCardDeck(cardDeckId);
  const { deckInfo, mutate: mutateDeckInfo } = useDeckInfo();

  const [editingId, setEditingId] = useState(null);

  const deckNameInputRef = useRef(null);

  function handleEditClick(id) {
    setEditingId(id);
    deckNameInputRef.current = document.getElementById(`input-${id}`);
  }

  function handleEditSave() {
    const newDeckName = deckNameInputRef.current.value;
    console.log(newDeckName);
    setEditingId(null);
    const newDeck = { ...cardDeck };
    newDeck.name = newDeckName;
    upsertCardDeck(newDeck).then(() => {
      mutateCardDeck();
      mutateDeckInfo();
    });
  }

  function handleDeckCreate() {
    addCardDeck().then((newDeck) => {
      setCardDeckId(newDeck.id);
      setCardIndex(0);
      setFrontFacing(true);
      mutateCardDeck();
      mutateDeckInfo();
    });
  }

  function handleDeckDelete(id) {
    deleteCardDeck(id).then(() => {
      setCardDeckId(null);
      setCardIndex(0);
      setFrontFacing(true);
      mutateCardDeck();
      mutateDeckInfo();
    });
  }

  return (
    <main className={className}>
      <div className="dropdown dropdown-hover">
        <div
          tabIndex={0}
          role="button"
          className="flex justify-center items-center w-72 sm:w-[20vw] h-10 rounded-md bg-secondary hover:bg-primary text-slate-100"
        >
          {!cardDeck ? "loading..." : cardDeck.name}
        </div>
        {deckInfo && (
          <ul className="dropdown-content z-[99] menu p-2 shadow bg-base-100 rounded-box w-72 sm:w-[20vw] max-h-48 overflow-y-auto grid grid-cols-1">
            {deckInfo.map(({ id, name }) => (
              <li
                className="hover-trigger relative w-full hover:bg-secondary hover:text-slate-100 rounded-md"
                key={id}
              >
                <>
                  <a
                    className={`w-[80%] ${
                      editingId === id ? "block" : "hidden"
                    }`}
                  >
                    <input
                      id={`input-${id}`}
                      className="w-full h-full text-black rounded-md pl-1 -ml-1"
                      defaultValue={name}
                    />
                  </a>
                  <a
                    className={`${editingId !== id ? "block" : "hidden"}`}
                    onClick={() => {
                      setCardDeckId(id);
                      setCardIndex(0);
                      setFrontFacing(true);
                    }}
                  >
                    {name}
                  </a>
                </>
                <div className="hover-target absolute hidden top-1/2 right-0 -translate-y-1/2 gap-3 justify-end items-center">
                  {editingId === id ? (
                    <svg
                      onClick={() => handleEditSave()}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 hover:scale-125 active:scale-90"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      onClick={() => handleEditClick(id)}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 hover:scale-125 active:scale-90"
                    >
                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                    </svg>
                  )}
                  <svg
                    onClick={() => handleDeckDelete(id)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 hover:scale-125 active:scale-90"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </li>
            ))}
            <li className="mt-2 hover:bg-transparent flex justify-center items-center">
              <a
                onClick={handleDeckCreate}
                className="w-fit px-2 py-1 hover:bg-transparent flex justify-center items-center rounded-md border-dashed border-[1px] border-secondary text-secondary"
              >
                + Deck
              </a>
            </li>
          </ul>
        )}
      </div>
    </main>
  );
}
