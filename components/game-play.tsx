"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, X, SkipForward, Play } from "lucide-react"
import type { Category, Team } from "@/app/page"
import { getRandomWord } from "@/lib/words"

interface GamePlayProps {
  categories: Category[]
  teams: Team[]
  currentTeamIndex: number
  timeLimit: number
  currentRound: number
  totalRounds: number
  onUpdateScore: (teamId: string, points: number) => void
  onNextTeam: () => void
  onNextRound: () => void
  onEndGame: () => void
}

export function GamePlay({
  categories,
  teams,
  currentTeamIndex,
  timeLimit,
  currentRound,
  totalRounds,
  onUpdateScore,
  onNextTeam,
  onNextRound,
  onEndGame,
}: GamePlayProps) {
  const [currentWord, setCurrentWord] = useState("")
  const [currentCategory, setCurrentCategory] = useState("")
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [isPlaying, setIsPlaying] = useState(false)
  const [roundsPlayed, setRoundsPlayed] = useState(0)
  const [turnsInCurrentRound, setTurnsInCurrentRound] = useState(0)

  // Función para crear sonido de campana
  const playBellSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Crear oscilador para el sonido de campana
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      // Conectar oscilador al gain y al destino
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Configurar el sonido de campana (frecuencias que suenan como campana)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3)
      oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.8)

      // Configurar el volumen con fade out
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2)

      // Reproducir el sonido
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 1.2)
    } catch (error) {
      console.log("Audio no disponible:", error)
    }
  }

  const currentTeam = teams[currentTeamIndex]
  const enabledCategories = categories.filter((cat) => cat.enabled)

  const generateNewWord = () => {
    const { word, category } = getRandomWord(enabledCategories)
    setCurrentWord(word)
    setCurrentCategory(category)
  }

  const startRound = () => {
    generateNewWord()
    setTimeLeft(timeLimit)
    setIsPlaying(true)
  }

  const endRound = () => {
    setIsPlaying(false)
    const newTurnsCount = turnsInCurrentRound + 1
    setTurnsInCurrentRound(newTurnsCount)

    // Si todos los equipos han jugado en esta ronda
    if (newTurnsCount >= teams.length) {
      setTurnsInCurrentRound(0)
      setTimeout(() => {
        onNextRound()
      }, 2000)
    } else {
      // Siguiente equipo en la misma ronda
      setTimeout(() => {
        onNextTeam()
      }, 2000)
    }
  }

  const handleCorrect = () => {
    onUpdateScore(currentTeam.id, 1)
    generateNewWord()
  }

  const handleSkip = () => {
    generateNewWord()
  }

  const handleIncorrect = () => {
    endRound()
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false)
            // Reproducir sonido de campana cuando termine el tiempo
            playBellSound()
            setTimeout(() => {
              endRound()
            }, 1000)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, timeLeft, turnsInCurrentRound, teams.length, onNextTeam, onNextRound])

  const progressPercentage = (timeLeft / timeLimit) * 100

  useEffect(() => {
    // Reiniciar el estado cuando cambia el equipo o la ronda
    setTimeLeft(timeLimit)
    setIsPlaying(false)
    setCurrentWord("")
    setCurrentCategory("")
  }, [currentTeamIndex, currentRound, timeLimit])

  if (roundsPlayed >= teams.length * 5) {
    onEndGame()
    return null
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Turno de: {currentTeam.name}</h2>
        <div className="flex justify-center space-x-6 text-sm mb-2">
          {teams.map((team) => (
            <div
              key={team.id}
              className={`px-3 py-1 rounded ${team.id === currentTeam.id ? "bg-white/20" : "bg-white/10"}`}
            >
              {team.name}: {team.score}
            </div>
          ))}
        </div>
        <div className="text-sm text-white/70">
          Ronda {currentRound} de {totalRounds}
        </div>
      </div>

      {/* Timer */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-primary">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Game Area */}
      <Card className="min-h-[300px]">
        <CardContent className="p-8">
          {!isPlaying && !currentWord ? (
            <div className="text-center space-y-6">
              <div className="text-lg text-muted-foreground">¿Listos para comenzar?</div>
              <Button onClick={startRound} size="lg" className="text-xl px-8 py-4">
                <Play className="mr-2 h-6 w-6" />
                Comenzar Turno
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              {currentCategory && (
                <div className="text-sm text-muted-foreground uppercase tracking-wide">{currentCategory}</div>
              )}
              <div className="text-4xl md:text-6xl font-bold text-primary break-words">{currentWord}</div>

              {isPlaying ? (
                <div className="flex flex-col items-center space-y-4 w-full max-w-xs mx-auto">
                  <Button onClick={handleCorrect} size="lg" className="bg-green-500 hover:bg-green-600 w-full">
                    <Check className="mr-2 h-5 w-5" />
                    ¡Correcto!
                  </Button>
                  <Button onClick={handleSkip} variant="outline" size="lg" className="w-full bg-transparent">
                    <SkipForward className="mr-2 h-5 w-5" />
                    Pasar
                  </Button>
                  <Button onClick={handleIncorrect} size="lg" variant="destructive" className="w-full">
                    <X className="mr-2 h-5 w-5" />
                    Tiempo
                  </Button>
                </div>
              ) : (
                <div className="text-lg text-muted-foreground">
                  {timeLeft === 0 ? "¡Se acabó el tiempo!" : "Preparando siguiente turno..."}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Info */}
      <div className="text-center text-white/80 text-sm">
        Ronda {currentRound} de {totalRounds} • Turno {(turnsInCurrentRound % teams.length) + 1} de {teams.length}
      </div>

      <Button onClick={onEndGame} variant="outline" className="w-full bg-transparent">
        Terminar Juego
      </Button>
    </div>
  )
}
