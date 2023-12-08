import axios from 'axios';
import { BACKEND_URL } from './constants';

//DELETE
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

//DELETE
export function initDemoDeckList() {
  !localStorage.getItem('deckList') && localStorage.setItem('deckList', JSON.stringify(DemoDeckList));
}

export async function getDeckInfo(currentUserId) {

  const res = await axios.get(`${BACKEND_URL}/get-owned-sets/${currentUserId}`);

  if (res.status !== 200) {
    alert('Error fetching deck info');
  }

  return Object.keys(res.data).map(key => ({ id: key, name: res.data[key] }));
}

export async function getCardDeck(id) {

  const res = await axios.get(`${BACKEND_URL}/get-cards-in-set/${id}`);

  if (res.status !== 200) {
    alert('Error fetching deck content');
  }

  const content = res.data.set.map(card => ({ front: card[0], back: card[1] }))

  return {
    id,
    content
  };
}

export async function addCardDeck(currentUserId) {

  const res = await axios.post(`${BACKEND_URL}/make-card-set/`, {
    "UserID": currentUserId,
    "Name": "New Deck"
  })

  if (res.status !== 200) {
    alert('Error adding deck');
  }

  return res.data;
}

export async function deleteCardDeck(currentUserId, cardDeckId) {
  const res = await axios.post(`${BACKEND_URL}/delete-card-set/`, {
    "UserID": currentUserId,
    "CardSetID": cardDeckId
  });

  if (res.status !== 200) {
    alert('Error deleting deck');
  }
}

export async function renameCardDeck(currentUserId, cardDeckId, newName) {
  const res = await axios.post(`${BACKEND_URL}/rename-card-set/`, {
    "UserID": currentUserId,
    "CardSetID": cardDeckId,
    "NewName": newName
  });

  if (res.status !== 200) {
    alert('Error renaming deck');
  }
}

export async function addCard(currentUserId, cardDeckId) {

  const res = await axios.post(`${BACKEND_URL}/add-cards/`, {
    "UserID": currentUserId,
    "CardSetID": cardDeckId,
    "cards": [
      ["", ""]
    ]
  })

  if (res.status !== 200) {
    alert('Error adding card');
  }
}

export async function updateCard(currentUserId, cardDeckId, cardIndex, card) {
  const requestBody = {
    "UserID": currentUserId,
    "CardSetID": cardDeckId,
    "CardIdx": cardIndex,
    "NewCard": [card.front, card.back]
  }

  const res = await axios.post(`${BACKEND_URL}/update-card/`, requestBody);

  if (res.status !== 200) {
    alert('Error updating card');
  }
}

export async function deleteCard(currentUserId, cardDeckId, cardIndex) {
  const res = await axios.post(`${BACKEND_URL}/delete-card/`, {
    "UserID": currentUserId,
    "CardSetID": cardDeckId,
    "CardIdx": cardIndex
  });

  if (res.status !== 200) {
    alert('Error deleting card');
  }
}