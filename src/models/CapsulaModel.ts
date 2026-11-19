import { DatabaseService } from '../services/DatabaseService'

export interface Capsula {
  id: number
  titulo: string
  mensaje: string
  emocion: string
  fecha_creacion: string
  fecha_apertura: string
}

export class CapsulaModel {
  private db: DatabaseService

  constructor(db: DatabaseService) {
    this.db = db
  }

  // Fecha de hoy en hora local (toISOString usa hora UTC y en la noche da el día siguiente)
  private hoy(): string {
    const d = new Date()
    const mes = String(d.getMonth() + 1).padStart(2, '0')
    const dia = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${mes}-${dia}`
  }

  crear(titulo: string, mensaje: string, emocion: string, fechaApertura: string): void {
    this.db.ejecutar(
      'INSERT INTO capsulas (titulo, mensaje, emocion, fecha_creacion, fecha_apertura) VALUES (?, ?, ?, ?, ?)',
      [titulo, mensaje, emocion, this.hoy(), fechaApertura]
    )
  }

  listar(emocion = ''): Capsula[] {
    if (emocion === 'otro') {
      return this.db.consultar(
        "SELECT * FROM capsulas WHERE emocion NOT IN ('feliz', 'nostalgico', 'triste') ORDER BY fecha_apertura"
      ) as Capsula[]
    }
    if (emocion) {
      return this.db.consultar(
        'SELECT * FROM capsulas WHERE emocion = ? ORDER BY fecha_apertura',
        [emocion]
      ) as Capsula[]
    }
    return this.db.consultar('SELECT * FROM capsulas ORDER BY fecha_apertura') as Capsula[]
  }

  buscarPorId(id: number): Capsula | undefined {
    const filas = this.db.consultar('SELECT * FROM capsulas WHERE id = ?', [id]) as Capsula[]
    return filas[0]
  }

  editar(id: number, titulo: string, mensaje: string, emocion: string, fechaApertura: string): void {
    this.db.ejecutar(
      'UPDATE capsulas SET titulo = ?, mensaje = ?, emocion = ?, fecha_apertura = ? WHERE id = ?',
      [titulo, mensaje, emocion, fechaApertura, id]
    )
  }

  eliminar(id: number): void {
    this.db.ejecutar('DELETE FROM capsulas WHERE id = ?', [id])
  }

  estaAbierta(capsula: Capsula): boolean {
    return capsula.fecha_apertura <= this.hoy()
  }
}
