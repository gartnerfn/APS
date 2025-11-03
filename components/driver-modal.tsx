import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Trophy, User, Calendar, DollarSign, Award, Instagram, Twitter } from "lucide-react"
import { F1Driver } from "@/lib/default-drivers"

interface DriverModalProps {
  driver: F1Driver | null
  isOpen: boolean
  onClose: () => void
}

export function DriverModal({ driver, isOpen, onClose }: DriverModalProps) {
  if (!driver) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'titular':
        return 'bg-green-100 text-green-800'
      case 'suplente':
        return 'bg-yellow-100 text-yellow-800'
      case 'reserva':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={driver.image} alt={driver.name} />
              <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{driver.name}</h2>
                <span className="text-xl">{driver.country}</span>
              </div>
              <p className="text-muted-foreground">#{driver.number} • {driver.team}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-secondary rounded-lg">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{driver.points}</p>
              <p className="text-sm text-muted-foreground">Puntos</p>
            </div>
            
            <div className="text-center p-4 bg-secondary rounded-lg">
              <User className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <Badge className={getStatusColor(driver.status)}>
                {driver.status.toUpperCase()}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">Estado</p>
            </div>
            
            {driver.contract && (
              <div className="text-center p-4 bg-secondary rounded-lg">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-lg font-bold">
                  {driver.contract.startYear}-{driver.contract.endYear}
                </p>
                <p className="text-sm text-muted-foreground">Contrato</p>
              </div>
            )}
            
            {driver.salary && (
              <div className="text-center p-4 bg-secondary rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-lg font-bold">{driver.salary}</p>
                <p className="text-sm text-muted-foreground">Salario</p>
              </div>
            )}
          </div>

          {/* Rol especial */}
          {driver.role && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Rol Especial
              </h3>
              <p className="text-muted-foreground bg-secondary p-3 rounded-lg">{driver.role}</p>
            </div>
          )}

          {/* Biografía */}
          {driver.biography && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Biografía</h3>
              <p className="text-muted-foreground leading-relaxed">{driver.biography}</p>
            </div>
          )}

          {/* Logros */}
          {driver.achievements && driver.achievements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Logros y Reconocimientos</h3>
              <div className="grid gap-2">
                {driver.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
                    <Trophy className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Redes sociales */}
          {(driver.socialMedia?.instagram || driver.socialMedia?.twitter) && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Redes Sociales</h3>
              <div className="flex gap-4">
                {driver.socialMedia.instagram && (
                  <a
                    href={`https://instagram.com/${driver.socialMedia.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-80 transition-opacity"
                  >
                    <Instagram className="h-4 w-4" />
                    {driver.socialMedia.instagram}
                  </a>
                )}
                {driver.socialMedia.twitter && (
                  <a
                    href={`https://twitter.com/${driver.socialMedia.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded-lg hover:opacity-80 transition-opacity"
                  >
                    <Twitter className="h-4 w-4" />
                    {driver.socialMedia.twitter}
                  </a>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Información del sistema */}
          <div className="text-xs text-muted-foreground">
            <p>Última actualización: {formatDate(driver.lastUpdated)}</p>
            <p>Nacionalidad: {driver.nationality}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}