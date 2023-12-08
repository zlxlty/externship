import useSWR from 'swr';
import { getCardDeck, getDeckInfo } from '../backend';

export function useCardDeck(id) {
  const { data, mutate, error } = useSWR(
    id !== null && `/api/decks/${id}`,
    url => getCardDeck(url.split('/').pop())
  )

  return {
    cardDeck: data,
    mutate,
    error
  }
}

export function useDeckInfo(currentUser) {
  const { data, mutate, error } = useSWR(
    currentUser !== null && `/api/decks/${currentUser.sub}`,
    () => getDeckInfo(currentUser.sub)
  )
  return {
    deckInfo: data,
    mutate,
    error
  }
}