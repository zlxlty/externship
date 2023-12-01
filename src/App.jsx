import { useEffect } from "react";
import "./App.css";
import { initDemoDeckList } from "./backend";

import ProfileAvatar from "./components/ProfileAvatar";
import DeckDropDown from "./components/DeckDropDown";
import CardSlide from "./components/CardSlide";
import CardPlayController from "./components/CardPlayController";
// Card: { id: number, front: string, back: string }
// CardDeck:{ id: number, name: string, content: Card[] }
// DeckList: CardDeck[]

function App() {
  // DEV: load DemoDeckList to localStorage as a fake database
  useEffect(() => {
    initDemoDeckList();
  }, []);

  return (
    <main className="flex flex-col justify-center items-center gap-24 w-screen h-screen">
      <ProfileAvatar className="absolute top-7 right-7" />

      <DeckDropDown />
      <CardSlide />
      <CardPlayController />
    </main>
  );
}

export default App;
