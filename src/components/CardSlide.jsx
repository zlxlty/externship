/* eslint-disable react/prop-types */
import { useFlashcardStore } from "../stores/flashcardStore";
import { useCardDeck } from "../hooks/useAudioCard";

export default function CardSlide({ className }) {
  const cardIndex = useFlashcardStore((state) => state.cardIndex);
  const cardDeckId = useFlashcardStore((state) => state.cardDeckId);
  const [frontFacing, setFrontFacing] = useFlashcardStore((state) => [
    state.frontFacing,
    state.setFrontFacing,
  ]);

  const { cardDeck } = useCardDeck(cardDeckId);

  function handleCardClick() {
    setFrontFacing(!frontFacing);
  }

  return (
    <main className={className}>
      <section className="w-screen h-[30vh] flex justify-center items-center">
        <div
          onClick={handleCardClick}
          style={{
            backgroundColor: frontFacing
              ? "rgb(226 232 240)"
              : "rgb(148 163 184)",
          }}
          className="w-[40vw] h-[30vh] bg-slate-400 text-center flex justify-center items-center text-lg select-none rounded-md shadow-lg"
        >
          <p>
            {cardDeck
              ? cardDeck.content[cardIndex][frontFacing ? "front" : "back"]
              : "loading..."}
          </p>
        </div>
      </section>
    </main>
  );
}
