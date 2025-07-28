"use client"

import { useState } from "react"
import { GameSetup } from "@/components/game-setup"
import { GamePlay } from "@/components/game-play"
import { GameResults } from "@/components/game-results"

export type Category = {
  id: string
  name: string
  icon: string
  enabled: boolean
}

export type Team = {
  id: string
  name: string
  score: number
}

export type GameState = "setup" | "playing" | "results"

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("setup")
  const [categories, setCategories] = useState<Category[]>([
    { id: "sustantivos", name: "Sustantivos concretos", icon: "🏠", enabled: true },
    { id: "acciones", name: "Acciones (verbos)", icon: "🏃", enabled: true },
    { id: "profesiones", name: "Profesiones u oficios", icon: "👨‍⚕️", enabled: true },
    { id: "animales", name: "Animales", icon: "🐶", enabled: true },
    { id: "objetos", name: "Objetos", icon: "📱", enabled: true },
    { id: "personajes", name: "Personajes famosos", icon: "🎭", enabled: true },
    { id: "entretenimiento", name: "Películas/Series/Libros", icon: "🎬", enabled: true },
    { id: "lugares", name: "Lugares", icon: "🏖️", enabled: true },
  ])
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Equipo 1", score: 0 },
    { id: "2", name: "Equipo 2", score: 0 },
  ])
  const [timeLimit, setTimeLimit] = useState(60)
  const [totalRounds, setTotalRounds] = useState(3)
  const [currentRound, setCurrentRound] = useState(1)
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)

  const startGame = () => {
    setGameState("playing")
  }

  const endGame = () => {
    setGameState("results")
  }

  const resetGame = () => {
    setTeams(teams.map((team) => ({ ...team, score: 0 })))
    setCurrentTeamIndex(0)
    setCurrentRound(1)
    setGameState("setup")
  }

  const updateTeamScore = (teamId: string, points: number) => {
    setTeams(teams.map((team) => (team.id === teamId ? { ...team, score: team.score + points } : team)))
  }

  const nextTeam = () => {
    setCurrentTeamIndex((prev) => (prev + 1) % teams.length)
  }

  const nextRound = () => {
    if (currentRound >= totalRounds) {
      endGame()
    } else {
      setCurrentRound((prev) => prev + 1)
      setCurrentTeamIndex(0) // Reiniciar al primer equipo
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8">
        {gameState === "setup" && (
          <GameSetup
            categories={categories}
            setCategories={setCategories}
            teams={teams}
            setTeams={setTeams}
            timeLimit={timeLimit}
            setTimeLimit={setTimeLimit}
            onStartGame={startGame}
            totalRounds={totalRounds}
            setTotalRounds={setTotalRounds}
          />
        )}

        {gameState === "playing" && (
          <GamePlay
            categories={categories}
            teams={teams}
            currentTeamIndex={currentTeamIndex}
            timeLimit={timeLimit}
            onUpdateScore={updateTeamScore}
            onNextTeam={nextTeam}
            onEndGame={endGame}
            currentRound={currentRound}
            totalRounds={totalRounds}
            onNextRound={nextRound}
          />
        )}

        {gameState === "results" && <GameResults teams={teams} onResetGame={resetGame} />}
      </div>
    </div>
  )
}
