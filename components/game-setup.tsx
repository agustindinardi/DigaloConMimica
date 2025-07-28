"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Plus, Minus } from "lucide-react"
import type { Category, Team } from "@/app/page"

interface GameSetupProps {
  categories: Category[]
  setCategories: (categories: Category[]) => void
  teams: Team[]
  setTeams: (teams: Team[]) => void
  timeLimit: number
  setTimeLimit: (time: number) => void
  totalRounds: number
  setTotalRounds: (rounds: number) => void
  onStartGame: () => void
}

export function GameSetup({
  categories,
  setCategories,
  teams,
  setTeams,
  timeLimit,
  setTimeLimit,
  totalRounds,
  setTotalRounds,
  onStartGame,
}: GameSetupProps) {
  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map((cat) => (cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat)))
  }

  const addTeam = () => {
    const newTeam: Team = {
      id: (teams.length + 1).toString(),
      name: `Equipo ${teams.length + 1}`,
      score: 0,
    }
    setTeams([...teams, newTeam])
  }

  const removeTeam = (teamId: string) => {
    if (teams.length > 2) {
      setTeams(teams.filter((team) => team.id !== teamId))
    }
  }

  const updateTeamName = (teamId: string, name: string) => {
    setTeams(teams.map((team) => (team.id === teamId ? { ...team, name } : team)))
  }

  const canStartGame = categories.some((cat) => cat.enabled) && teams.length >= 2

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">🎭 Dígalo con Mímica</h1>
        <p className="text-white/80">Configura tu juego y ¡que comience la diversión!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Categorías */}
        <Card>
          <CardHeader>
            <CardTitle>Categorías</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-3">
                <Checkbox
                  id={category.id}
                  checked={category.enabled}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <Label htmlFor={category.id} className="flex items-center space-x-2 cursor-pointer">
                  <span className="text-xl">{category.icon}</span>
                  <span>{category.name}</span>
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Equipos */}
        <Card>
          <CardHeader>
            <CardTitle>Equipos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center space-x-2">
                <Input value={team.name} onChange={(e) => updateTeamName(team.id, e.target.value)} className="flex-1" />
                {teams.length > 2 && (
                  <Button variant="outline" size="icon" onClick={() => removeTeam(team.id)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={addTeam} variant="outline" className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Equipo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tiempo */}
      <Card>
        <CardHeader>
          <CardTitle>Tiempo por turno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Segundos: {timeLimit}</span>
            </div>
            <Slider
              value={[timeLimit]}
              onValueChange={(value) => setTimeLimit(value[0])}
              max={180}
              min={15}
              step={15}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>15s</span>
              <span>90s</span>
              <span>180s</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Número de Rondas */}
      <Card>
        <CardHeader>
          <CardTitle>Número de Rondas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Rondas: {totalRounds}</span>
            </div>
            <Slider
              value={[totalRounds]}
              onValueChange={(value) => setTotalRounds(value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1 ronda</span>
              <span>5 rondas</span>
              <span>10 rondas</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Cada equipo jugará {totalRounds} {totalRounds === 1 ? "vez" : "veces"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onStartGame} disabled={!canStartGame} className="w-full h-12 text-lg font-semibold">
        {!canStartGame ? "Selecciona al menos una categoría" : "¡Comenzar Juego!"}
      </Button>
    </div>
  )
}
