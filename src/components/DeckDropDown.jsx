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
        <div
          tabIndex={0}
          role="button"
          className="btn w-[15vw] bg-secondary hover:bg-primary text-slate-100"
        >
          {!cardDeck ? "loading..." : cardDeck.name}
        </div>
        {deckInfo && (
          <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-[15vw]">
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
