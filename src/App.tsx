import { useState, useEffect, useCallback } from 'react'

interface Question {
  question: string
  options: string[]
  correct: number
  category: string
}

interface LeaderboardEntry {
  name: string
  score: number
  date: string
}

const questions: Question[] = [
  {
    question: "What AI company created Grok?",
    options: ["OpenAI", "xAI", "Anthropic", "Google DeepMind"],
    correct: 1,
    category: "GROK_AI"
  },
  {
    question: "What social platform is Grok integrated with?",
    options: ["Facebook", "Instagram", "X (Twitter)", "TikTok"],
    correct: 2,
    category: "GROK_AI"
  },
  {
    question: "What does $DRB stand for in the crypto community?",
    options: ["Digital Reserve Bitcoin", "Debt Relief Bot", "Decentralized Rebel Base", "Degen Rewards Bank"],
    correct: 1,
    category: "$DRB"
  },
  {
    question: "What is the term for someone who holds crypto regardless of price drops?",
    options: ["Paper hands", "Diamond hands", "Iron hands", "Ghost hands"],
    correct: 1,
    category: "CRYPTO_CULTURE"
  },
  {
    question: "What does 'WAGMI' stand for?",
    options: ["We All Gonna Make It", "Wallet And Gains Maximum Interest", "When All Goes Missing Invest", "Wealthy And Getting More Income"],
    correct: 0,
    category: "MEMES"
  },
  {
    question: "What famous dog breed inspired the original meme coin?",
    options: ["Labrador", "Shiba Inu", "Corgi", "Husky"],
    correct: 1,
    category: "MEMES"
  },
  {
    question: "Who founded xAI, the company behind Grok?",
    options: ["Sam Altman", "Satya Nadella", "Elon Musk", "Mark Zuckerberg"],
    correct: 2,
    category: "GROK_AI"
  },
  {
    question: "What is 'rugging' in crypto slang?",
    options: ["Buying the dip", "Developers abandoning a project with funds", "Staking for rewards", "Trading on multiple exchanges"],
    correct: 1,
    category: "CRYPTO_CULTURE"
  },
  {
    question: "What does 'NFA' mean in crypto communities?",
    options: ["New Financial Asset", "Not Financial Advice", "No Funds Available", "Next Featured Altcoin"],
    correct: 1,
    category: "CRYPTO_CULTURE"
  },
  {
    question: "Grok is named after a term from which science fiction novel?",
    options: ["Dune", "Stranger in a Strange Land", "Neuromancer", "Snow Crash"],
    correct: 1,
    category: "GROK_AI"
  },
  {
    question: "What is 'alpha' in crypto/trading context?",
    options: ["The first coin", "Insider information or edge", "A type of wallet", "Annual returns"],
    correct: 1,
    category: "CRYPTO_CULTURE"
  },
  {
    question: "What meme phrase represents panic selling?",
    options: ["To the moon", "HODL", "Paper hands", "LFG"],
    correct: 2,
    category: "MEMES"
  },
  {
    question: "What does 'DYOR' stand for?",
    options: ["Do Your Own Research", "Deposit Your Own Resources", "Don't Yield On Returns", "Digital Yield Optimization Rate"],
    correct: 0,
    category: "CRYPTO_CULTURE"
  },
  {
    question: "What is Grok known for compared to other AI assistants?",
    options: ["Being more censored", "Having a rebellious, witty personality", "Only answering science questions", "No internet access"],
    correct: 1,
    category: "GROK_AI"
  },
  {
    question: "What does 'GM' mean in crypto Twitter?",
    options: ["Get Money", "Good Morning", "Great Margin", "Global Market"],
    correct: 1,
    category: "MEMES"
  },
  {
    question: "What is a 'degen' in crypto culture?",
    options: ["A degenerate gambler/trader", "A type of token", "A decentralized exchange", "A blockchain protocol"],
    correct: 0,
    category: "CRYPTO_CULTURE"
  },
  {
    question: "What real-time data source does Grok have access to?",
    options: ["Reddit only", "X (Twitter) posts", "TikTok videos", "Instagram stories"],
    correct: 1,
    category: "GROK_AI"
  },
  {
    question: "What does 'LFG' mean in crypto slang?",
    options: ["Long-Form Gaming", "Let's F***ing Go", "Low Fee Gas", "Liquidity For Gains"],
    correct: 1,
    category: "MEMES"
  },
  {
    question: "What is 'flipping' in NFT/crypto context?",
    options: ["Reversing transactions", "Quick buying and selling for profit", "Converting to fiat", "Changing wallets"],
    correct: 1,
    category: "CRYPTO_CULTURE"
  },
  {
    question: "What animal represents a declining market?",
    options: ["Bull", "Eagle", "Bear", "Wolf"],
    correct: 2,
    category: "CRYPTO_CULTURE"
  }
]

type GameState = 'start' | 'playing' | 'gameover' | 'entering-name'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function TerminalWindow({ children, title = "quiz_protocol.exe" }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="terminal-border rounded-lg glow-cyan relative overflow-hidden">
      <div className="scanline"></div>
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 px-4 py-2 border-b border-cyan-500/30 flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-cyan-400/70 text-sm ml-2">{title}</span>
      </div>
      <div className="p-6 relative z-10">
        {children}
      </div>
    </div>
  )
}

function TypewriterText({ text, delay = 30, onComplete }: { text: string, delay?: number, onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(prev => prev + text[index])
        setIndex(prev => prev + 1)
      }, delay)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [index, text, delay, onComplete])

  return <span>{displayed}<span className="cursor-blink">_</span></span>
}

function StartScreen({ onStart }: { onStart: () => void }) {
  const [line, setLine] = useState(0)
  const [ready, setReady] = useState(false)

  const lines = [
    '$ initializing quiz protocol...',
    '> 20 questions loaded',
    '> topics: [GROK_AI, $DRB, CRYPTO_CULTURE, MEMES]',
    '> streak mode: ENABLED',
    '> global leaderboard: ACTIVE',
    '$ ready to test your degen knowledge?'
  ]

  useEffect(() => {
    if (line < lines.length - 1) {
      const timer = setTimeout(() => setLine(prev => prev + 1), 600)
      return () => clearTimeout(timer)
    } else {
      setTimeout(() => setReady(true), 800)
    }
  }, [line])

  return (
    <div className="space-y-4">
      {lines.slice(0, line + 1).map((text, i) => (
        <p key={i} className={`${
          text.startsWith('$') ? 'text-green-400' : 'text-cyan-300/80'
        } ${i === line && !ready ? '' : ''}`}>
          {i === line ? <TypewriterText text={text} delay={25} /> : text}
        </p>
      ))}
      {ready && (
        <div className="pt-6 animate-slide-up">
          <button
            onClick={onStart}
            className="btn-cyber px-8 py-4 text-cyan-400 font-bold text-lg tracking-widest glow-text-cyan w-full"
          >
            [ INITIALIZE QUIZ ]
          </button>
        </div>
      )}
    </div>
  )
}

function QuizScreen({ 
  question, 
  questionNumber,
  streak, 
  onAnswer 
}: { 
  question: Question
  questionNumber: number
  streak: number
  onAnswer: (correct: boolean) => void 
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const handleSelect = (index: number) => {
    if (selected !== null) return
    setSelected(index)
    setRevealed(true)
    
    const isCorrect = index === question.correct
    setTimeout(() => {
      onAnswer(isCorrect)
    }, isCorrect ? 800 : 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-cyan-500/60 text-sm">
          <span className="text-magenta-400">Q{questionNumber}</span> · {question.category}
        </div>
        <div className="streak-counter px-4 py-2 rounded">
          <span className="text-cyan-400 text-sm">STREAK: </span>
          <span className="text-2xl font-bold gradient-title">{streak}</span>
        </div>
      </div>
      
      <h2 className="text-xl text-cyan-100 font-medium leading-relaxed">
        {question.question}
      </h2>
      
      <div className="grid gap-3 pt-4">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            className={`option-btn p-4 text-left rounded transition-all ${
              revealed && i === question.correct ? 'correct' : ''
            } ${
              revealed && selected === i && i !== question.correct ? 'wrong' : ''
            } ${
              selected === null ? 'hover:translate-x-2' : ''
            }`}
          >
            <span className="text-cyan-500/50 mr-3">[{String.fromCharCode(65 + i)}]</span>
            <span className={revealed && i === question.correct ? 'text-green-400' : revealed && selected === i ? 'text-red-400' : 'text-cyan-200'}>
              {option}
            </span>
          </button>
        ))}
      </div>
      
      {revealed && selected !== question.correct && (
        <div className="text-red-400 text-center pt-4 animate-slide-up">
          ❌ STREAK ENDED · Final Score: {streak}
        </div>
      )}
    </div>
  )
}

function NameEntryScreen({ score, onSubmit }: { score: number, onSubmit: (name: string) => void }) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl mb-4">🏆</div>
      <h2 className="text-2xl font-bold gradient-title">PROTOCOL COMPLETE</h2>
      <p className="text-cyan-300/80">Your streak: <span className="text-3xl font-bold text-cyan-400 glow-text-cyan">{score}</span></p>
      
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <p className="text-green-400 text-sm">$ enter your callsign for the leaderboard:</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="anon_degen"
          maxLength={20}
          className="w-full bg-transparent border-2 border-cyan-500/50 rounded px-4 py-3 text-cyan-200 placeholder-cyan-700 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all"
          autoFocus
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="btn-cyber px-8 py-3 text-cyan-400 font-bold tracking-widest w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          [ SUBMIT SCORE ]
        </button>
      </form>
    </div>
  )
}

function Leaderboard({ entries, currentScore, onRestart }: { entries: LeaderboardEntry[], currentScore: number, onRestart: () => void }) {
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score).slice(0, 10)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-title text-center">GLOBAL LEADERBOARD</h2>
      
      <div className="space-y-2">
        {sortedEntries.length === 0 ? (
          <p className="text-cyan-500/50 text-center py-8">No entries yet. Be the first!</p>
        ) : (
          sortedEntries.map((entry, i) => (
            <div 
              key={i}
              className={`flex items-center justify-between p-3 rounded ${
                entry.score === currentScore ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-gray-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 text-center font-bold ${
                  i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-cyan-600'
                }`}>
                  {i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <span className="text-cyan-200">{entry.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-cyan-500/50 text-xs">{entry.date}</span>
                <span className="text-xl font-bold text-cyan-400 glow-text-cyan">{entry.score}</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button
        onClick={onRestart}
        className="btn-cyber px-8 py-4 text-cyan-400 font-bold tracking-widest w-full mt-6"
      >
        [ TRY AGAIN ]
      </button>
    </div>
  )
}

function Footer() {
  return (
    <footer className="text-center py-6 text-cyan-700/50 text-xs">
      Requested by{' '}
      <a href="https://twitter.com/DebtReliefGod" target="_blank" rel="noopener noreferrer" className="text-cyan-600/60 hover:text-cyan-400 transition-colors">@DebtReliefGod</a>
      {' · '}
      Built by{' '}
      <a href="https://twitter.com/clonkbot" target="_blank" rel="noopener noreferrer" className="text-cyan-600/60 hover:text-cyan-400 transition-colors">@clonkbot</a>
    </footer>
  )
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [streak, setStreak] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [finalScore, setFinalScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('drb-grok-leaderboard')
    if (saved) {
      setLeaderboard(JSON.parse(saved))
    }
  }, [])

  const startGame = useCallback(() => {
    setShuffledQuestions(shuffleArray(questions))
    setCurrentQuestionIndex(0)
    setStreak(0)
    setGameState('playing')
  }, [])

  const handleAnswer = useCallback((correct: boolean) => {
    if (correct) {
      setStreak(prev => prev + 1)
      setCurrentQuestionIndex(prev => {
        if (prev + 1 >= shuffledQuestions.length) {
          setShuffledQuestions(prev => [...prev, ...shuffleArray(questions)])
        }
        return prev + 1
      })
    } else {
      setFinalScore(streak)
      setGameState('entering-name')
    }
  }, [streak, shuffledQuestions.length])

  const submitScore = useCallback((name: string) => {
    const entry: LeaderboardEntry = {
      name,
      score: finalScore,
      date: new Date().toLocaleDateString()
    }
    const newLeaderboard = [...leaderboard, entry]
    setLeaderboard(newLeaderboard)
    localStorage.setItem('drb-grok-leaderboard', JSON.stringify(newLeaderboard))
    setGameState('gameover')
  }, [finalScore, leaderboard])

  const restart = useCallback(() => {
    setGameState('start')
    setStreak(0)
    setFinalScore(0)
  }, [])

  return (
    <div className="min-h-screen bg-grid bg-noise flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <header className="text-center mb-8">
            <h1 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-black gradient-title tracking-wider mb-2">
              GROK x $DRB
            </h1>
            <p className="text-cyan-400/60 tracking-[0.3em] text-sm md:text-base glow-text-cyan">
              KNOWLEDGE PROTOCOL
            </p>
          </header>

          <TerminalWindow>
            {gameState === 'start' && <StartScreen onStart={startGame} />}
            {gameState === 'playing' && shuffledQuestions[currentQuestionIndex] && (
              <QuizScreen
                question={shuffledQuestions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                streak={streak}
                onAnswer={handleAnswer}
              />
            )}
            {gameState === 'entering-name' && (
              <NameEntryScreen score={finalScore} onSubmit={submitScore} />
            )}
            {gameState === 'gameover' && (
              <Leaderboard entries={leaderboard} currentScore={finalScore} onRestart={restart} />
            )}
          </TerminalWindow>
        </div>
      </div>
      <Footer />
    </div>
  )
}