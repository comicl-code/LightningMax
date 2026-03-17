'use client';

import { useState, useCallback } from 'react';

const SUITS = ['♠', '♥', '♦', '♣'] as const;
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

type Card = { rank: (typeof RANKS)[number]; suit: (typeof SUITS)[number]; value: number };

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let i = 0; i < RANKS.length; i++) {
      deck.push({ rank: RANKS[i], suit, value: i + 1 });
    }
  }
  return deck;
}

function shuffle(deck: Card[]): Card[] {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function suitColor(suit: string) {
  return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-gray-900';
}

function CardDisplay({ card, faceDown = false }: { card: Card; faceDown?: boolean }) {
  if (faceDown) {
    return (
      <div className="w-28 h-40 sm:w-36 sm:h-52 rounded-xl border-2 border-blue-300 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
        <span className="text-white text-4xl sm:text-5xl">?</span>
      </div>
    );
  }

  return (
    <div className="w-28 h-40 sm:w-36 sm:h-52 rounded-xl border-2 border-gray-300 bg-white flex flex-col items-center justify-between p-2 sm:p-3 shadow-lg">
      <div className={`self-start text-lg sm:text-xl font-bold ${suitColor(card.suit)}`}>
        {card.rank}
        <span className="ml-0.5">{card.suit}</span>
      </div>
      <div className={`text-4xl sm:text-6xl ${suitColor(card.suit)}`}>{card.suit}</div>
      <div className={`self-end text-lg sm:text-xl font-bold rotate-180 ${suitColor(card.suit)}`}>
        {card.rank}
        <span className="ml-0.5">{card.suit}</span>
      </div>
    </div>
  );
}

type GameState = 'playing' | 'correct' | 'wrong' | 'gameover';

export default function HigherLowerPage() {
  const [deck, setDeck] = useState<Card[]>(() => shuffle(createDeck()));
  const [index, setIndex] = useState(1); // next card to reveal
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [state, setState] = useState<GameState>('playing');
  const [revealedNext, setRevealedNext] = useState(false);

  const currentCard = deck[index - 1];
  const nextCard = deck[index] ?? null;

  const guess = useCallback(
    (higher: boolean) => {
      if (state !== 'playing' || !nextCard) return;

      const isHigher = nextCard.value > currentCard.value;
      const isEqual = nextCard.value === currentCard.value;
      const correct = isEqual || (higher ? isHigher : !isHigher);

      setRevealedNext(true);

      setTimeout(() => {
        if (correct) {
          const newScore = score + 1;
          setScore(newScore);
          if (newScore > highScore) setHighScore(newScore);

          if (index + 1 >= deck.length) {
            setState('gameover');
          } else {
            setIndex((i) => i + 1);
            setRevealedNext(false);
            setState('playing');
          }
        } else {
          setState('wrong');
        }
      }, 800);

      setState(correct ? 'correct' : 'wrong');
    },
    [state, nextCard, currentCard, score, highScore, index, deck.length],
  );

  const restart = useCallback(() => {
    const newDeck = shuffle(createDeck());
    setDeck(newDeck);
    setIndex(1);
    setScore(0);
    setState('playing');
    setRevealedNext(false);
  }, []);

  const cardsRemaining = deck.length - index - 1;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Higher or Lower</h1>

      <div className="flex gap-4 text-sm sm:text-base">
        <span className="px-3 py-1 bg-blue-100 rounded-full font-medium">
          Score: {score}
        </span>
        <span className="px-3 py-1 bg-yellow-100 rounded-full font-medium">
          Best: {highScore}
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full font-medium">
          Cards left: {cardsRemaining}
        </span>
      </div>

      <p className="text-gray-600 text-sm text-center max-w-xs">
        Will the next card be <strong>higher</strong> or <strong>lower</strong>? Equal counts as correct.
      </p>

      <div className="flex items-center gap-4 sm:gap-8">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Current</span>
          <CardDisplay card={currentCard} />
        </div>

        <span className="text-2xl text-gray-400">→</span>

        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Next</span>
          {nextCard ? (
            <CardDisplay card={nextCard} faceDown={!revealedNext} />
          ) : (
            <div className="w-28 h-40 sm:w-36 sm:h-52 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
              None
            </div>
          )}
        </div>
      </div>

      {state === 'playing' && nextCard && (
        <div className="flex gap-4">
          <button
            onClick={() => guess(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow transition-colors text-lg"
          >
            ↑ Higher
          </button>
          <button
            onClick={() => guess(false)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow transition-colors text-lg"
          >
            ↓ Lower
          </button>
        </div>
      )}

      {state === 'correct' && (
        <p className="text-green-600 font-bold text-lg animate-pulse">Correct!</p>
      )}

      {state === 'wrong' && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-red-600 font-bold text-lg">
            Wrong! The card was {nextCard?.rank}{nextCard?.suit} ({nextCard?.value}).
          </p>
          <p className="text-gray-600">Final score: {score}</p>
          <button
            onClick={restart}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      {state === 'gameover' && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-green-700 font-bold text-xl">You made it through the whole deck!</p>
          <p className="text-gray-600">Perfect score: {score}</p>
          <button
            onClick={restart}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
