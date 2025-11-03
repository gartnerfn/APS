export interface F1Driver {
  id: string
  name: string // NO EDITABLE
  number: string
  team: string // NO EDITABLE (se asigna desde escudería)
  teamId: string
  nationality: string // NO EDITABLE
  country: string // NO EDITABLE
  image: string
  points: number
  position?: number
  status: "titular" | "suplente" | "reserva"
  contract?: {
    startYear: number
    endYear: number
  }
  // Información editable por la escudería
  salary?: string
  role?: string
  biography?: string
  achievements?: string[]
  socialMedia?: {
    instagram?: string
    twitter?: string
  }
  created: string
  lastUpdated: string
}

export const DEFAULT_F1_DRIVERS: F1Driver[] = [
  // Red Bull Racing
  {
    id: "max-verstappen",
    name: "Max Verstappen",
    number: "1",
    team: "Oracle Red Bull Racing",
    teamId: "red-bull-racing",
    nationality: "Neerlandés",
    country: "🇳🇱",
    image: "/Max-verstappen.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2023, endYear: 2028 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  {
    id: "sergio-perez",
    name: "Sergio Pérez",
    number: "11",
    team: "Oracle Red Bull Racing",
    teamId: "red-bull-racing",
    nationality: "Mexicano",
    country: "🇲🇽",
    image: "/placeholder-user.jpg",
    points: 0,
    status: "titular",
    contract: { startYear: 2024, endYear: 2026 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  
  // Ferrari
  {
    id: "charles-leclerc",
    name: "Charles Leclerc",
    number: "16",
    team: "Scuderia Ferrari",
    teamId: "ferrari",
    nationality: "Monegasco",
    country: "🇲🇨",
    image: "/Charles-leclerc.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2019, endYear: 2029 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  {
    id: "lewis-hamilton",
    name: "Lewis Hamilton",
    number: "44",
    team: "Scuderia Ferrari",
    teamId: "ferrari",
    nationality: "Británico",
    country: "🇬🇧",
    image: "/Lewis-hamilton.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2025, endYear: 2027 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  
  // Mercedes
  {
    id: "george-russell",
    name: "George Russell",
    number: "63",
    team: "Mercedes-AMG PETRONAS F1 Team",
    teamId: "mercedes",
    nationality: "Británico",
    country: "🇬🇧",
    image: "/George-russell.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2022, endYear: 2025 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  {
    id: "kimi-antonelli",
    name: "Kimi Antonelli",
    number: "12",
    team: "Mercedes-AMG PETRONAS F1 Team",
    teamId: "mercedes",
    nationality: "Italiano",
    country: "🇮🇹",
    image: "/Kimi-antonelli.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2025, endYear: 2027 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  
  // McLaren
  {
    id: "lando-norris",
    name: "Lando Norris",
    number: "4",
    team: "McLaren F1 Team",
    teamId: "mclaren",
    nationality: "Británico",
    country: "🇬🇧",
    image: "/Lando-norris.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2019, endYear: 2027 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  {
    id: "oscar-piastri",
    name: "Oscar Piastri",
    number: "81",
    team: "McLaren F1 Team",
    teamId: "mclaren",
    nationality: "Australiano",
    country: "🇦🇺",
    image: "/Oscar-piastri.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2023, endYear: 2026 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  
  // Aston Martin
  {
    id: "fernando-alonso",
    name: "Fernando Alonso",
    number: "14",
    team: "Aston Martin Aramco F1 Team",
    teamId: "aston-martin",
    nationality: "Español",
    country: "🇪🇸",
    image: "/Fernando-alonso.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2023, endYear: 2026 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  {
    id: "lance-stroll",
    name: "Lance Stroll",
    number: "18",
    team: "Aston Martin Aramco F1 Team",
    teamId: "aston-martin",
    nationality: "Canadiense",
    country: "🇨🇦",
    image: "/Lance-stroll.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2021, endYear: 2025 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  
  // Alpine
  {
    id: "pierre-gasly",
    name: "Pierre Gasly",
    number: "10",
    team: "BWT Alpine F1 Team",
    teamId: "alpine",
    nationality: "Francés",
    country: "🇫🇷",
    image: "/Pierre-gasly.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2023, endYear: 2025 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  {
    id: "esteban-ocon",
    name: "Esteban Ocon",
    number: "31",
    team: "BWT Alpine F1 Team",
    teamId: "alpine",
    nationality: "Francés",
    country: "🇫🇷",
    image: "/Esteban-ocon.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2020, endYear: 2025 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  
  // Williams
  {
    id: "alexander-albon",
    name: "Alexander Albon",
    number: "23",
    team: "Williams Racing",
    teamId: "williams",
    nationality: "Tailandés",
    country: "🇹🇭",
    image: "/Alexander-albon.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2022, endYear: 2025 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  {
    id: "franco-colapinto",
    name: "Franco Colapinto",
    number: "43",
    team: "Williams Racing",
    teamId: "williams",
    nationality: "Argentino",
    country: "🇦🇷",
    image: "/Franco-colapinto.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2024, endYear: 2026 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  
  // RB (Visa Cash App RB)
  {
    id: "yuki-tsunoda",
    name: "Yuki Tsunoda",
    number: "22",
    team: "Visa Cash App RB F1 Team",
    teamId: "alphatauri",
    nationality: "Japonés",
    country: "🇯🇵",
    image: "/Yuki-tsunoda.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2021, endYear: 2025 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  {
    id: "liam-lawson",
    name: "Liam Lawson",
    number: "30",
    team: "Visa Cash App RB F1 Team",
    teamId: "alphatauri",
    nationality: "Neozelandés",
    country: "🇳🇿",
    image: "/Liam-lawson.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2024, endYear: 2026 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  
  // Kick Sauber
  {
    id: "nico-hulkenberg",
    name: "Nico Hulkenberg",
    number: "27",
    team: "Stake F1 Team Kick Sauber",
    teamId: "alfa-romeo",
    nationality: "Alemán",
    country: "🇩🇪",
    image: "/Nico-hulkenberg.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2023, endYear: 2025 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  {
    id: "gabriel-bortoleto",
    name: "Gabriel Bortoleto",
    number: "21",
    team: "Stake F1 Team Kick Sauber",
    teamId: "alfa-romeo",
    nationality: "Brasileño",
    country: "🇧🇷",
    image: "/Gabriel-bortoleto.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2025, endYear: 2027 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  
  // Haas
  {
    id: "oliver-bearman",
    name: "Oliver Bearman",
    number: "87",
    team: "MoneyGram Haas F1 Team",
    teamId: "haas",
    nationality: "Británico",
    country: "🇬🇧",
    image: "/Oliver-bearman.png",
    points: 0,
    status: "titular",
    contract: { startYear: 2025, endYear: 2027 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  },
  {
    id: "isack-hadjar",
    name: "Isack Hadjar",
    number: "66",
    team: "MoneyGram Haas F1 Team",
    teamId: "haas",
    nationality: "Francés",
    country: "🇫🇷",
    image: "/Isack-hadjar.png",
    points: 0,
    status: "suplente",
    contract: { startYear: 2025, endYear: 2026 },
    created: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-01T00:00:00Z"
  }
]

// Función para obtener todos los pilotos (por defecto + editados)
export function getAllDrivers(): F1Driver[] {
  // Primero obtener los pilotos por defecto
  const defaultDrivers = [...DEFAULT_F1_DRIVERS]

  // Obtener pilotos añadidos manualmente por el admin
  const storedManualDrivers = localStorage.getItem('f1_drivers_manual')
  const manualDriversRaw: any[] = storedManualDrivers ? JSON.parse(storedManualDrivers) : []

  // Normalizar manualDrivers al formato F1Driver mínimo
  const manualDrivers: F1Driver[] = manualDriversRaw.map((d: any) => {
    const teamId = d.teamId || (d.team ? getTeamIdFromName(d.team) : '')
    return {
      id: d.id || (Date.now().toString() + Math.random().toString(36).slice(2, 6)),
      name: d.name || d.driverName || 'Piloto',
      number: d.number ? String(d.number) : (d.numberStr ? d.numberStr : ''),
      team: d.team || d.teamName || '',
      teamId,
      nationality: d.nationality || d.driverNationality || '',
      country: d.country || d.countryFlag || '',
      image: d.image || d.imageUrl || '/placeholder-user.jpg',
      points: typeof d.points === 'number' ? d.points : 0,
      status: (d.status || d.role || 'titular') as F1Driver['status'],
      contract: d.contract,
      salary: d.salary,
      role: d.role,
      biography: d.biography,
      achievements: d.achievements,
      socialMedia: d.socialMedia,
      created: d.created || new Date().toISOString(),
      lastUpdated: d.lastUpdated || new Date().toISOString()
    }
  })

  // Combinar: primero defaults, luego manuales (manuales pueden agregar nuevos ids)
  const combined = [...defaultDrivers, ...manualDrivers]

  // Luego obtener las ediciones desde localStorage (ediciones hechas por escuderías)
  const storedDriverEdits = localStorage.getItem('f1_driver_edits')
  const driverEdits: Partial<F1Driver>[] = storedDriverEdits ? JSON.parse(storedDriverEdits) : []

  // Aplicar las ediciones a la lista combinada
  const allDrivers = combined.map(driver => {
    const edit = driverEdits.find(edit => edit.id === driver.id)
    return edit ? { ...driver, ...edit } : driver
  })

  return allDrivers
}

// Función para obtener pilotos por escudería
export function getDriversByTeam(teamId: string): F1Driver[] {
  const allDrivers = getAllDrivers()
  console.log("All drivers:", allDrivers.length)
  console.log("Looking for teamId:", teamId)
  const filtered = allDrivers.filter(driver => {
    console.log(`Driver ${driver.name}: teamId=${driver.teamId}, matches=${driver.teamId === teamId}`)
    return driver.teamId === teamId
  })
  console.log("Filtered drivers:", filtered)
  return filtered
}

// Función para actualizar información de un piloto
export function updateDriverInfo(driverId: string, updates: Partial<F1Driver>) {
  const storedDriverEdits = localStorage.getItem('f1_driver_edits')
  const driverEdits: Partial<F1Driver>[] = storedDriverEdits ? JSON.parse(storedDriverEdits) : []
  
  // Encontrar si ya existe una edición para este piloto
  const existingEditIndex = driverEdits.findIndex(edit => edit.id === driverId)
  
  const newEdit = {
    id: driverId,
    ...updates,
    lastUpdated: new Date().toISOString()
  }
  
  if (existingEditIndex !== -1) {
    // Actualizar edición existente
    driverEdits[existingEditIndex] = { ...driverEdits[existingEditIndex], ...newEdit }
  } else {
    // Crear nueva edición
    driverEdits.push(newEdit)
  }
  
  localStorage.setItem('f1_driver_edits', JSON.stringify(driverEdits))
  
  // Disparar evento para actualizar UI
  window.dispatchEvent(new Event('f1-drivers-updated'))
}

// Función para inicializar pilotos por defecto
export function initializeDefaultDrivers() {
  const storedDefaultDrivers = localStorage.getItem('f1_drivers_default')
  if (!storedDefaultDrivers) {
    localStorage.setItem('f1_drivers_default', JSON.stringify(DEFAULT_F1_DRIVERS))
  }
}

// Mapeo de nombres de equipos a teamId para usar en admin
export function getTeamIdFromName(teamName: string): string {
  const nameToIdMap: Record<string, string> = {
    "Oracle Red Bull Racing": "red-bull-racing",
    "Red Bull Racing": "red-bull-racing",
    "Mercedes-AMG PETRONAS F1 Team": "mercedes",
    "Mercedes": "mercedes",
    "Scuderia Ferrari": "ferrari",
    "Ferrari": "ferrari",
    "McLaren F1 Team": "mclaren",
    "McLaren": "mclaren",
    "Aston Martin Aramco F1 Team": "aston-martin",
    "Aston Martin": "aston-martin",
    "BWT Alpine F1 Team": "alpine",
    "Alpine": "alpine",
    "Williams Racing": "williams",
    "Williams": "williams",
    "Visa Cash App RB F1 Team": "alphatauri",
    "Racing Bulls": "alphatauri",
    "Stake F1 Team Kick Sauber": "alfa-romeo",
    "Sauber": "alfa-romeo",
    "MoneyGram Haas F1 Team": "haas",
    "Haas": "haas"
  }
  
  return nameToIdMap[teamName] || teamName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}