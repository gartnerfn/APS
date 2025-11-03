export interface F1Race {
  id: string
  date: string
  country: string
  circuit: string
  status: string
  image: string
  name: string
  fullDate: string // Fecha completa en formato ISO para el calendario
}

export const DEFAULT_F1_RACES: F1Race[] = [
  {
    id: "australia-2025",
    date: "MAR 16",
    country: "AUSTRALIA",
    circuit: "Albert Park Circuit",
    status: "PRÓXIMO",
    image: "/melbourne-f1-albert-park-circuit.jpg",
    name: "Australian Grand Prix",
    fullDate: "2025-03-16"
  },
  {
    id: "china-2025",
    date: "MAR 23",
    country: "CHINA",
    circuit: "Shanghai International Circuit",
    status: "PRÓXIMO",
    image: "/shanghai-f1-circuit-china.jpg",
    name: "Chinese Grand Prix",
    fullDate: "2025-03-23"
  },
  {
    id: "japan-2025",
    date: "ABR 6",
    country: "JAPÓN",
    circuit: "Suzuka Circuit",
    status: "PRÓXIMO",
    image: "/suzuka-f1-circuit-japan.jpg",
    name: "Japanese Grand Prix",
    fullDate: "2025-04-06"
  },
  {
    id: "bahrain-2025",
    date: "ABR 13",
    country: "BAHRÉIN",
    circuit: "Bahrain International Circuit",
    status: "PRÓXIMO",
    image: "/bahrain-f1-circuit-night-race.jpg",
    name: "Bahrain Grand Prix",
    fullDate: "2025-04-13"
  },
  {
    id: "saudi-arabia-2025",
    date: "ABR 20",
    country: "ARABIA SAUDÍ",
    circuit: "Jeddah Corniche Circuit",
    status: "PRÓXIMO",
    image: "/jeddah-f1-street-circuit-night.jpg",
    name: "Saudi Arabian Grand Prix",
    fullDate: "2025-04-20"
  },
  {
    id: "miami-2025",
    date: "MAY 4",
    country: "ESTADOS UNIDOS",
    circuit: "Miami International Autodrome",
    status: "PRÓXIMO",
    image: "/miami-f1-circuit-usa.jpg",
    name: "Miami Grand Prix",
    fullDate: "2025-05-04"
  },
  {
    id: "emilia-romagna-2025",
    date: "MAY 18",
    country: "ITALIA",
    circuit: "Imola Circuit",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Emilia Romagna Grand Prix",
    fullDate: "2025-05-18"
  },
  {
    id: "monaco-2025",
    date: "MAY 25",
    country: "MÓNACO",
    circuit: "Circuit de Monaco",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Monaco Grand Prix",
    fullDate: "2025-05-25"
  },
  {
    id: "spain-2025",
    date: "JUN 1",
    country: "ESPAÑA",
    circuit: "Circuit de Barcelona-Catalunya",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Spanish Grand Prix",
    fullDate: "2025-06-01"
  },
  {
    id: "canada-2025",
    date: "JUN 15",
    country: "CANADÁ",
    circuit: "Circuit Gilles Villeneuve",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Canadian Grand Prix",
    fullDate: "2025-06-15"
  },
  {
    id: "austria-2025",
    date: "JUN 29",
    country: "AUSTRIA",
    circuit: "Red Bull Ring",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Austrian Grand Prix",
    fullDate: "2025-06-29"
  },
  {
    id: "britain-2025",
    date: "JUL 6",
    country: "REINO UNIDO",
    circuit: "Silverstone Circuit",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "British Grand Prix",
    fullDate: "2025-07-06"
  },
  {
    id: "belgium-2025",
    date: "JUL 27",
    country: "BÉLGICA",
    circuit: "Spa-Francorchamps",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Belgian Grand Prix",
    fullDate: "2025-07-27"
  },
  {
    id: "hungary-2025",
    date: "AGO 3",
    country: "HUNGRÍA",
    circuit: "Hungaroring",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Hungarian Grand Prix",
    fullDate: "2025-08-03"
  },
  {
    id: "netherlands-2025",
    date: "AGO 31",
    country: "PAÍSES BAJOS",
    circuit: "Zandvoort Circuit",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Dutch Grand Prix",
    fullDate: "2025-08-31"
  },
  {
    id: "italy-2025",
    date: "SEP 7",
    country: "ITALIA",
    circuit: "Monza Circuit",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Italian Grand Prix",
    fullDate: "2025-09-07"
  },
  {
    id: "azerbaijan-2025",
    date: "SEP 21",
    country: "AZERBAIYÁN",
    circuit: "Baku City Circuit",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Azerbaijan Grand Prix",
    fullDate: "2025-09-21"
  },
  {
    id: "singapore-2025",
    date: "OCT 5",
    country: "SINGAPUR",
    circuit: "Marina Bay Street Circuit",
    status: "PRÓXIMO",
    image: "/singapur.jpg",
    name: "Singapore Grand Prix",
    fullDate: "2025-10-05"
  },
  {
    id: "usa-austin-2025",
    date: "OCT 19",
    country: "ESTADOS UNIDOS",
    circuit: "Circuit of the Americas",
    status: "PRÓXIMO",
    image: "/estados-unidos.jpg",
    name: "United States Grand Prix",
    fullDate: "2025-10-19"
  },
  {
    id: "mexico-2025",
    date: "OCT 26",
    country: "MÉXICO",
    circuit: "Autódromo Hermanos Rodríguez",
    status: "PRÓXIMO",
    image: "/mexico.jpg",
    name: "Mexican Grand Prix",
    fullDate: "2025-10-26"
  },
  {
    id: "brazil-2025",
    date: "NOV 9",
    country: "BRASIL",
    circuit: "Interlagos Circuit",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Brazilian Grand Prix",
    fullDate: "2025-11-09"
  },
  {
    id: "usa-vegas-2025",
    date: "NOV 22",
    country: "ESTADOS UNIDOS",
    circuit: "Las Vegas Strip Circuit",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Las Vegas Grand Prix",
    fullDate: "2025-11-22"
  },
  {
    id: "qatar-2025",
    date: "NOV 30",
    country: "CATAR",
    circuit: "Lusail International Circuit",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Qatar Grand Prix",
    fullDate: "2025-11-30"
  },
  {
    id: "uae-2025",
    date: "DIC 7",
    country: "EMIRATOS ÁRABES UNIDOS",
    circuit: "Yas Marina Circuit",
    status: "PRÓXIMO",
    image: "/placeholder.svg",
    name: "Abu Dhabi Grand Prix",
    fullDate: "2025-12-07"
  }
]

// Función para obtener todas las carreras desde localStorage (formato del admin)
export function getAllRaces(): F1Race[] {
  const storedRaces = localStorage.getItem('f1_events_manual')
  if (storedRaces) {
    try {
      const manualRaces = JSON.parse(storedRaces)
      const formattedRaces: F1Race[] = manualRaces.map((race: any) => ({
        id: race.id,
        date: new Date(race.date).toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric' 
        }).toUpperCase(),
        country: race.country.toUpperCase(),
        circuit: race.circuit,
        status: "PRÓXIMO",
        image: race.image || "/placeholder.svg",
        name: race.name,
        fullDate: race.date
      }))
      
      return formattedRaces
    } catch (e) {
      console.error('Error parsing races:', e)
    }
  }
  
  return []
}

// Función para inicializar las carreras por defecto en formato admin
export function initializeDefaultRaces() {
  const storedEvents = localStorage.getItem('f1_events_manual')
  
  // Si no hay eventos, inicializar con las carreras por defecto
  if (!storedEvents) {
    const adminFormatRaces = DEFAULT_F1_RACES.map(race => ({
      id: race.id,
      name: race.name,
      date: race.fullDate,
      circuit: race.circuit,
      country: race.country,
      image: race.image,
      created: new Date().toLocaleString()
    }))
    
    localStorage.setItem('f1_events_manual', JSON.stringify(adminFormatRaces))
  } else {
    // Verificar si necesitamos agregar carreras faltantes
    try {
      const existingEvents = JSON.parse(storedEvents)
      const existingIds = new Set(existingEvents.map((e: any) => e.id))
      
      const missingRaces = DEFAULT_F1_RACES.filter(race => !existingIds.has(race.id))
      
      if (missingRaces.length > 0) {
        const newRaces = missingRaces.map(race => ({
          id: race.id,
          name: race.name,
          date: race.fullDate,
          circuit: race.circuit,
          country: race.country,
          image: race.image,
          created: new Date().toLocaleString()
        }))
        
        const updatedEvents = [...existingEvents, ...newRaces]
        localStorage.setItem('f1_events_manual', JSON.stringify(updatedEvents))
      }
    } catch (e) {
      console.error('Error updating races:', e)
    }
  }
}