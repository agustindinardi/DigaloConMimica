"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"
import type { Team } from "@/app/page"

interface GameResultsProps {
  teams: Team[]
  onResetGame: () => void
}

export function GameResults({ teams, onResetGame }: GameResultsProps) {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score)
  const winner = sortedTeams[0]
  const maxScore = Math.max(...teams.map((team) => team.score))

  const getIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-500" />
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />
      case 2:
        return <Award className="h-8 w-8 text-amber-600" />
      default:
        return <div className="h-8 w-8" />
    }
  }

  const getPositionText = (position: number) => {
    switch (position) {
      case 0:
        return "🥇 1er Lugar"
      case 1:
        return "🥈 2do Lugar"
      case 2:
        return "🥉 3er Lugar"
      default:
        return `${position + 1}° Lugar`
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-2">🎉 ¡Juego Terminado!</h1>
        <p className="text-xl">¡Felicitaciones a todos los participantes!</p>
      </div>

      {/* Winner Announcement */}
      <Card className="border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100">
        <CardContent className="p-8 text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-yellow-800 mb-2">¡{winner.name} es el ganador!</h2>
          <p className="text-xl text-yellow-700">
            Con {winner.score} {winner.score === 1 ? "punto" : "puntos"}
          </p>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Resultados Finales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedTeams.map((team, index) => (
              <div
                key={team.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0 ? "bg-yellow-50 border-2 border-yellow-200" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-4">
                  {getIcon(index)}
                  <div>
                    <div className="font-semibold text-lg">{team.name}</div>
                    <div className="text-sm text-muted-foreground">{getPositionText(index)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{team.score}</div>
                  <div className="text-sm text-muted-foreground">{team.score === 1 ? "punto" : "puntos"}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Game Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{teams.length}</div>
              <div className="text-sm text-muted-foreground">Equipos</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{teams.reduce((sum, team) => sum + team.score, 0)}</div>
              <div className="text-sm text-muted-foreground">Palabras adivinadas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onResetGame} className="w-full h-12 text-lg font-semibold">
        🎭 Jugar de Nuevo
      </Button>
    </div>
  )
}
