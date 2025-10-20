export interface F1Team {
  id: string
  name: string
  country: string
  principal: string
  date?: string
  imageUrl?: string
  created: string
  constructorsChampionships?: number
  driversChampionships?: number
  base: string
  powerUnit: string
  firstEntry: string
  worldChampionships?: number
  polePositions?: number
  fastestLaps?: number
}

export const DEFAULT_F1_TEAMS: F1Team[] = [
  {
    id: "red-bull-racing",
    name: "Oracle Red Bull Racing",
    country: "Austria",
    principal: "Christian Horner",
    date: "2005-01-01",
    imageUrl: "/placeholder-logo.png",
    created: "2024-01-01T00:00:00Z",
    constructorsChampionships: 6,
    driversChampionships: 7,
    base: "Milton Keynes, Reino Unido",
    powerUnit: "Honda RBPT",
    firstEntry: "2005",
    worldChampionships: 6,
    polePositions: 103,
    fastestLaps: 95
  },
  {
    id: "mercedes",
    name: "Mercedes-AMG PETRONAS F1 Team",
    country: "Germany",
    principal: "Toto Wolff",
    date: "2010-01-01",
    imageUrl: "/placeholder-logo.png",
    created: "2024-01-01T00:00:00Z",
    constructorsChampionships: 8,
    driversChampionships: 9,
    base: "Brackley, Reino Unido",
    powerUnit: "Mercedes",
    firstEntry: "2010",
    worldChampionships: 8,
    polePositions: 128,
    fastestLaps: 85
  },
  {
    id: "ferrari",
    name: "Scuderia Ferrari",
    country: "Italy",
    principal: "Frédéric Vasseur",
    date: "1950-01-01",
    imageUrl: "/placeholder-logo.png",
    created: "2024-01-01T00:00:00Z",
    constructorsChampionships: 16,
    driversChampionships: 15,
    base: "Maranello, Italia",
    powerUnit: "Ferrari",
    firstEntry: "1950",
    worldChampionships: 16,
    polePositions: 249,
    fastestLaps: 260
  },
  {
    id: "mclaren",
    name: "McLaren F1 Team",
    country: "United Kingdom",
    principal: "Andrea Stella",
    date: "1966-01-01",
    imageUrl: "/placeholder-logo.png",
    created: "2024-01-01T00:00:00Z",
    constructorsChampionships: 8,
    driversChampionships: 12,
    base: "Woking, Reino Unido",
    powerUnit: "Mercedes",
    firstEntry: "1966",
    worldChampionships: 8,
    polePositions: 156,
    fastestLaps: 164
  },
  {
    id: "aston-martin",
    name: "Aston Martin Aramco F1 Team",
    country: "United Kingdom",
    principal: "Mike Krack",
    date: "2021-01-01",
    imageUrl: "/placeholder-logo.png",
    created: "2024-01-01T00:00:00Z",
    constructorsChampionships: 0,
    driversChampionships: 0,
    base: "Silverstone, Reino Unido",
    powerUnit: "Mercedes",
    firstEntry: "2021",
    worldChampionships: 0,
    polePositions: 1,
    fastestLaps: 1
  },
  {
    id: "alpine",
    name: "BWT Alpine F1 Team",
    country: "France",
    principal: "Bruno Famin",
    date: "2021-01-01",
    imageUrl: "/placeholder-logo.png",
    created: "2024-01-01T00:00:00Z",
    constructorsChampionships: 2,
    driversChampionships: 2,
    base: "Enstone, Reino Unido",
    powerUnit: "Renault",
    firstEntry: "1986",
    worldChampionships: 2,
    polePositions: 20,
    fastestLaps: 15
  },
  {
    id: "williams",
    name: "Williams Racing",
    country: "United Kingdom",
    principal: "James Vowles",
    date: "1977-01-01",
    imageUrl: "/placeholder-logo.png",
    created: "2024-01-01T00:00:00Z",
    constructorsChampionships: 9,
    driversChampionships: 7,
    base: "Grove, Reino Unido",
    powerUnit: "Mercedes",
    firstEntry: "1977",
    worldChampionships: 9,
    polePositions: 128,
    fastestLaps: 133
  },
  {
    id: "alphatauri",
    name: "Visa Cash App RB F1 Team",
    country: "Italy",
    principal: "Laurent Mekies",
    date: "2006-01-01",
    imageUrl: "/placeholder-logo.png",
    created: "2024-01-01T00:00:00Z",
    constructorsChampionships: 0,
    driversChampionships: 0,
    base: "Faenza, Italia",
    powerUnit: "Honda RBPT",
    firstEntry: "2006",
    worldChampionships: 0,
    polePositions: 1,
    fastestLaps: 2
  },
  {
    id: "alfa-romeo",
    name: "Stake F1 Team Kick Sauber",
    country: "Switzerland",
    principal: "Alessandro Alunni Bravi",
    date: "1993-01-01",
    imageUrl: "/placeholder-logo.png",
    created: "2024-01-01T00:00:00Z",
    constructorsChampionships: 0,
    driversChampionships: 0,
    base: "Hinwil, Suiza",
    powerUnit: "Ferrari",
    firstEntry: "1993",
    worldChampionships: 0,
    polePositions: 1,
    fastestLaps: 1
  },
  {
    id: "haas",
    name: "MoneyGram Haas F1 Team",
    country: "USA",
    principal: "Ayao Komatsu",
    date: "2016-01-01",
    imageUrl: "/placeholder-logo.png",
    created: "2024-01-01T00:00:00Z",
    constructorsChampionships: 0,
    driversChampionships: 0,
    base: "Kannapolis, Estados Unidos",
    powerUnit: "Ferrari",
    firstEntry: "2016",
    worldChampionships: 0,
    polePositions: 1,
    fastestLaps: 2
  }
]

// Función para obtener todas las escuderías (por defecto + manuales)
export function getAllTeams(): F1Team[] {
  // Primero obtener las escuderías por defecto
  const defaultTeams = [...DEFAULT_F1_TEAMS]
  
  // Luego obtener las manuales del localStorage
  const storedTeams = localStorage.getItem('f1_teams_manual')
  const manualTeams = storedTeams ? JSON.parse(storedTeams) : []
  
  // Combinar ambas listas, evitando duplicados por ID
  const allTeams = [...defaultTeams]
  manualTeams.forEach((manualTeam: F1Team) => {
    const exists = allTeams.find(team => team.id === manualTeam.id)
    if (!exists) {
      allTeams.push(manualTeam)
    }
  })
  
  return allTeams
}

// Función para inicializar las escuderías por defecto si no existen
export function initializeDefaultTeams() {
  const storedDefaultTeams = localStorage.getItem('f1_teams_default')
  if (!storedDefaultTeams) {
    localStorage.setItem('f1_teams_default', JSON.stringify(DEFAULT_F1_TEAMS))
  }
}