import useSWR from 'swr';
import { getCardDeck, getDeckInfo } from '../backend';

export function useCardDeck(id) {
  const { data, error } = useSWR(
    `/api/decks/${id}`,
    async url => getCardDeck(url.split('/').pop())
  )
  return {
    cardDeck: data,
    error
  }
}

export function useDeckInfo() {
  const { data, error } = useSWR(
    `/api/decks`,
    async () => getDeckInfo()
  )
  return {
    deckInfo: data,
    error
  }
}