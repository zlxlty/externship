import { create } from 'zustand'

export const useFlashcardStore = create((set) => ({
  cardIndex: 0,
  setCardIndex: (cardIndex) => set(() => ({ cardIndex })),

  cardDeckId: null,
  setCardDeckId: (cardDeckId) => set(() => ({ cardDeckId })),

  isPlaying: false,
  setIsPlaying: (isPlaying) => set(() => ({ isPlaying })),

  frontFacing: true,
  setFrontFacing: (frontFacing) => set(() => ({ frontFacing })),

  deckList: null,
  setDeckList: (deckList) => set(() => ({ deckList })),

  loadingCount: 0,
  addLoading: () => set(state => ({ loadingCount: state.loadingCount + 1 })),
  removeLoading: () => set(state => ({ loadingCount: state.loadingCount - 1 })),

  audioProcessing: 0,
  addAudioProcessing: () => set(state => ({ audioProcessing: state.audioProcessing + 1 })),
  removeAudioProcessing: () => set(state => ({ audioProcessing: state.audioProcessing - 1 })),
}))