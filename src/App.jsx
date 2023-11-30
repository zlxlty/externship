import { useState, useMemo, useEffect } from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './App.css'
import { useAuthStore } from './stores/authStore'

// Test for Slack Integration

function App() {

  const Flashcards = useMemo(()=>[
    [
      {'front': 'front1', 'back': 'back1'}, 
      {'front': 'front2', 'back': 'back2'},
      {'front': 'front3', 'back': 'back3'},
      {'front': 'front4', 'back': 'back4'},
      {'front': 'front5', 'back': 'back5'},
      {'front': 'front6', 'back': 'back6'},
    ],
    [
      {'front': 'front11', 'back': 'back1'}, 
      {'front': 'front12', 'back': 'back2'},
      {'front': 'front13', 'back': 'back3'},
      {'front': 'front14', 'back': 'back4'},
      {'front': 'front15', 'back': 'back5'},
      {'front': 'front16', 'back': 'back6'},
    ],
    [
      {'front': 'front21', 'back': 'back1'}, 
      {'front': 'front22', 'back': 'back2'},
      {'front': 'front23', 'back': 'back3'},
      {'front': 'front24', 'back': 'back4'},
      {'front': 'front25', 'back': 'back5'},
      {'front': 'front26', 'back': 'back6'},
    ]
  ], [])

  const [currentUser, loginUser, logoutUser] = useAuthStore(state => [state.currentUser, state.loginUser, state.logoutUser])

  const [cards, setCards] = useState(Flashcards[0])
  const [currentCard, setCurrentCard] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [facing, setFacing] = useState('front')


  useEffect(() => {

    let interval = null

    if (playing) {
      interval = setInterval(() => {
        setCurrentCard((currentCard + 1) % cards.length)
      }, 1500)
    }

    return () => clearInterval(interval)

  }, [cards, currentCard, playing, facing])

  function handlePlayingClick() {
    setPlaying(!playing)
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      console.log(tokenResponse);
      // fetching userinfo can be done on the client or the server
      const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then(res => res.data);

      loginUser(userInfo)
      console.log(userInfo);
    },
    // flow: 'implicit', // implicit is the default
  });

  function handleCardClick() {
    facing === 'front' ? setFacing('back') : setFacing('front')
  }

  function handleNextCard() {
    setCurrentCard((currentCard + 1) % cards.length)
    setFacing('front')
  }

  function handlePreviousCard() {
    setCurrentCard((currentCard - 1 + cards.length) % cards.length)
    setFacing('front')
  }

  return (
    <main className='flex flex-col justify-between items-center w-screen h-screen px-10 py-36'>
      <section>
        { !currentUser ? 
          <button onClick={() => googleLogin()} className="btn">Log in</button> :
          <button onClick={() => logoutUser()} className="btn">Welcome! {currentUser.name}</button>
        }
      </section>
      <section className="dropdown dropdown-hover">
        <div tabIndex={0} role="button" className="btn w-[30vw]">Flashcards</div>
        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-[30vw]">
          <li><a onClick={() => setCards(Flashcards[0])}>Flashcards 1</a></li>
          <li><a onClick={() => setCards(Flashcards[1])}>Flashcards 2</a></li>
          <li><a onClick={() => setCards(Flashcards[2])}>Flashcards 3</a></li>
        </ul>
      </section>

      <section className='w-screen h-[30vh] flex justify-center items-center'>
        <div onClick={handleCardClick} style={{backgroundColor: facing === "front" ? "rgb(226 232 240)" : "rgb(148 163 184)"}} className="w-[40vw] h-[30vh] bg-slate-400 text-center flex justify-center items-center text-lg select-none">
          {cards[currentCard][facing]}
        </div>
      </section>
      <section className='flex justify-around items-center space-x-3'>
        <svg onClick={handlePreviousCard} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>

        <svg onClick={handlePlayingClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
          { playing ? 
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          :
            <>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
            </>
          }
        </svg>

        

        <svg onClick={handleNextCard} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </section>
    </main>
  )
}

export default App
