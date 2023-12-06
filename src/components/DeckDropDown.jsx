/* eslint-disable react/prop-types */
import { useFlashcardStore } from "../stores/flashcardStore";
import { useCardDeck, useDeckInfo } from "../hooks/useAudioCard";

export default function DeckDropDown({ className }) {
  const cardDeckId = useFlashcardStore((state) => state.cardDeckId);
  const setCardDeckId = useFlashcardStore((state) => state.setCardDeckId);
  const setCardIndex = useFlashcardStore((state) => state.setCardIndex);
  const setFrontFacing = useFlashcardStore((state) => state.setFrontFacing);

  const { cardDeck } = useCardDeck(cardDeckId);
  const { deckInfo } = useDeckInfo();

  return (
    <main className={className}>
      <section className="dropdown dropdown-hover">
        <div className="flex gap-[2px] justify-center items-center">
          <div
            tabIndex={0}
            role="button"
            className="flex justify-center items-center w-72 h-10 rounded-s-md bg-secondary hover:bg-primary text-slate-100"
          >
            <p className="translate-x-3">
              {!cardDeck ? "loading..." : cardDeck.name}
            </p>
          </div>
          <div className="flex justify-center items-center w-10 h-10 p-0 border-none rounded-e-md bg-secondary hover:bg-primary text-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
        </div>
        {deckInfo && (
          <ul className="dropdown-content z-[99] menu p-2 shadow bg-base-100 rounded-box w-72">
            {deckInfo.map(({ id, name }) => (
              <li key={id}>
                <a
                  onClick={() => {
                    setCardDeckId(id);
                    setCardIndex(0);
                    setFrontFacing(true);
                  }}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
