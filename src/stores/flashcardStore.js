import { create } from 'zustand'

export const useFlashcardStore = create((set) => ({
  cardIndex: 0,
  setCardIndex: (cardIndex) => set(() => ({ cardIndex })),

  cardDeckId: 0,
  setCardDeckId: (cardDeckId) => set(() => ({ cardDeckId })),

  isPlaying: false,
  setIsPlaying: (isPlaying) => set(() => ({ isPlaying })),

  frontFacing: true,
  setFrontFacing: (frontFacing) => set(() => ({ frontFacing })),

  deckList: null,
  setDeckList: (deckList) => set(() => ({ deckList })),
}))