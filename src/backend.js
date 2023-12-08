import axios from 'axios';

export async function getDeckInfo(currentUserId) {

  const res = await axios.get(`https://api.soundcard.online/get-owned-sets/${currentUserId}`);

  if (res.status !== 200) {
    alert('Error fetching deck info');
  }

  return Object.keys(res.data).map(key => ({ id: key, name: res.data[key] }));
}

export async function getCardDeck(id) {

  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-cards-in-set/${id}`);

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

  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/make-card-set/`, {
    "UserID": currentUserId,
    "Name": "New Deck"
  })

  if (res.status !== 200) {
    alert('Error adding deck');
  }

  return res.data;
}

export async function deleteCardDeck(currentUserId, cardDeckId) {
  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delete-card-set/`, {
    "UserID": currentUserId,
    "CardSetID": cardDeckId
  });

  if (res.status !== 200) {
    alert('Error deleting deck');
  }
}

export async function renameCardDeck(currentUserId, cardDeckId, newName) {
  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rename-card-set/`, {
    "UserID": currentUserId,
    "CardSetID": cardDeckId,
    "NewName": newName
  });

  if (res.status !== 200) {
    alert('Error renaming deck');
  }
}

export async function addCard(currentUserId, cardDeckId) {

  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/add-cards/`, {
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

  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/update-card/`, requestBody);

  if (res.status !== 200) {
    alert('Error updating card');
  }
}

export async function deleteCard(currentUserId, cardDeckId, cardIndex) {
  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delete-card/`, {
    "UserID": currentUserId,
    "CardSetID": cardDeckId,
    "CardIdx": cardIndex
  });

  if (res.status !== 200) {
    alert('Error deleting card');
  }
}