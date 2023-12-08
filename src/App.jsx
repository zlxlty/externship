import { useEffect } from "react";
import "./App.css";
import { useAuthStore } from "./stores/authStore";
import { useDeckInfo } from "./hooks/useAudioCard";
import { useFlashcardStore } from "./stores/flashcardStore";

import ProfileAvatar from "./components/ProfileAvatar";
import DeckDropDown from "./components/DeckDropDown";
import CardSlide from "./components/CardSlide";
import CardPlayController from "./components/CardPlayController";
import LoadingModal from "./components/LoadingModal";
// Card: { id: number, front: string, back: string }
// CardDeck: { id: number, name: string, content: Card[] }
// DeckList: { id: number, name: string }[]  // a list of card deck info wihout content

function App() {
  // DEV: load DemoDeckList to localStorage as a fake database

  const currentUser = useAuthStore((state) => state.currentUser);
  const { deckInfo, mutate: mutateDeckInfo } = useDeckInfo(currentUser);
  const cardDeckId = useFlashcardStore((state) => state.cardDeckId);
  const setCardDeckId = useFlashcardStore((state) => state.setCardDeckId);
  const setCardIndex = useFlashcardStore((state) => state.setCardIndex);
  const setIsPlaying = useFlashcardStore((state) => state.setIsPlaying);
  const loadingCount = useFlashcardStore((state) => state.loadingCount);

  useEffect(() => {
    if (deckInfo && deckInfo.length > 0) {
      setCardDeckId(deckInfo[0].id);
    }
  }, [deckInfo, setCardDeckId]);

  useEffect(() => {
    if (!currentUser) {
      setCardDeckId(null);
      setCardIndex(0);
    } else {
      mutateDeckInfo();
    }
    setIsPlaying(false);
  }, [currentUser, mutateDeckInfo, setCardDeckId, setCardIndex, setIsPlaying]);

  return (
    <main
      style={{ fontFamily: "Chalkboard,comic sans ms,'sans-serif'" }}
      className="flex flex-col justify-center items-center gap-20 w-screen h-screen"
    >
      <ProfileAvatar className="absolute top-7 right-7" />
      {currentUser && <DeckDropDown />}
      <CardSlide />

      {cardDeckId && <CardPlayController />}
      <LoadingModal showing={loadingCount > 0} />
    </main>
  );
}

export default App;
