import { sleep } from './utils';

const DemoDeckList = [
  // a card deck is an object with the following properties:
  {
    id: 0,
    name: 'CHN 101',
    content: [
      { id: 1, 'front': 'front1', 'back': 'back1' },
      { id: 2, 'front': 'front2', 'back': 'back2' },
      { id: 3, 'front': 'front3', 'back': 'back3' },
      { id: 4, 'front': 'front4', 'back': 'back4' },
      { id: 5, 'front': 'front5', 'back': 'back5' },
      { id: 6, 'front': 'front6', 'back': 'back6' },
    ]
  },
  {
    id: 1,
    name: 'ENG 102',
    content: [
      { id: 7, 'front': 'front11', 'back': 'back11' },
      { id: 8, 'front': 'front12', 'back': 'back12' },
      { id: 9, 'front': 'front13', 'back': 'back13' },
      { id: 10, 'front': 'front14', 'back': 'back14' },
      { id: 11, 'front': 'front15', 'back': 'back15' },
      { id: 12, 'front': 'front16', 'back': 'back16' },
    ]
  },
  {
    id: 2,
    name: 'MATH 103',
    content: [
      { id: 13, 'front': 'front21', 'back': 'back21' },
      { id: 14, 'front': 'front22', 'back': 'back22' },
      { id: 15, 'front': 'front23', 'back': 'back23' },
      { id: 16, 'front': 'front24', 'back': 'back24' },
      { id: 17, 'front': 'front25', 'back': 'back25' },
      { id: 18, 'front': 'front26', 'back': 'back26' },
    ]
  },
]

export function initDemoDeckList() {
  !localStorage.getItem('deckList') && localStorage.setItem('deckList', JSON.stringify(DemoDeckList));
}

export async function getDeckInfo() {
  await sleep(200);
  const deckList = JSON.parse(localStorage.getItem('deckList'));
  return deckList && deckList.map(deck => ({ id: deck.id, name: deck.name }));
}

export async function getCardDeck(id) {
  await sleep(200);
  const deckList = JSON.parse(localStorage.getItem('deckList'));
  return deckList && deckList.find(deck => deck.id === parseInt(id));
}

export async function addCardDeck() {
  await sleep(200);
  const deckList = JSON.parse(localStorage.getItem('deckList'));
  const id = deckList[deckList.length - 1].id + 1;
  const cardDeck = {
    id,
    name: `New Deck ${id}`,
    content: []
  }
  const newDeckList = [...deckList, cardDeck];
  localStorage.setItem('deckList', JSON.stringify(newDeckList));
  return cardDeck;
}

export async function deleteCardDeck(id) {
  await sleep(200);
  const deckList = JSON.parse(localStorage.getItem('deckList'));
  const newDeckList = deckList.filter(deck => deck.id !== parseInt(id));
  localStorage.setItem('deckList', JSON.stringify(newDeckList));
}

export async function upsertCardDeck(cardDeck) {
  await sleep(200);
  const deckList = JSON.parse(localStorage.getItem('deckList'));
  const newDeckList = deckList.filter(deck => deck.id !== cardDeck.id);
  newDeckList.push(cardDeck);
  localStorage.setItem('deckList', JSON.stringify(newDeckList));
}