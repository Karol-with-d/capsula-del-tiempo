// Vela que se consume y tintero que se queda sin tinta
const TINTA_MAXIMA = 120 // caracteres por recarga

export class TintaView {
  campos = [
    document.getElementById('titulo') as HTMLInputElement,
    document.getElementById('mensaje') as HTMLTextAreaElement,
  ]
  form = document.getElementById('formulario') as HTMLFormElement
  cera = document.getElementById('cera') as HTMLElement
  tintero = document.getElementById('tintero') as HTMLButtonElement
  tintaFrasco = document.getElementById('tintaFrasco') as HTMLElement
  barra = document.getElementById('barraTinta') as HTMLElement
  aviso = document.getElementById('avisoTinta') as HTMLElement

  tinta = TINTA_MAXIMA
  vela = 100 // altura de la vela en %

  constructor() {
    this.campos.forEach(campo => {
      campo.addEventListener('beforeinput', e => this.gastarTinta(e as InputEvent))
    })
    this.tintero.addEventListener('click', () => this.recargar())

    // la vela se consume poquito a poquito con el tiempo
    setInterval(() => this.consumirVela(0.1), 1000)
    this.actualizar()
  }

  private gastarTinta(e: InputEvent): void {
    if (!e.inputType.startsWith('insert')) return // borrar sí se puede
    const letras = e.data ? e.data.length : 1

    if (this.tinta < letras) {
      e.preventDefault()
      this.sinTinta()
      return
    }

    this.tinta -= letras
    this.consumirVela(letras * 0.2)
    this.actualizar()
    if (this.tinta === 0) this.sinTinta()
  }

  private sinTinta(): void {
    this.aviso.hidden = false
    this.tintero.classList.add('vacio')
  }

  private recargar(): void {
    if (this.tinta === TINTA_MAXIMA) return
    this.tintero.classList.remove('vacio')
    this.tintero.classList.add('recargando')
    this.aviso.hidden = true

    setTimeout(() => {
      this.tinta = TINTA_MAXIMA
      this.tintero.classList.remove('recargando')
      this.actualizar()
    }, 900)
  }

  private consumirVela(cuanto: number): void {
    this.vela = Math.max(30, this.vela - cuanto) // nunca desaparece
    this.cera.style.height = this.vela + '%'
  }

  private actualizar(): void {
    const porcentaje = (this.tinta / TINTA_MAXIMA) * 100
    this.barra.style.width = porcentaje + '%'
    this.tintaFrasco.style.height = porcentaje + '%'
    this.form.classList.toggle('poca-tinta', porcentaje < 25)
  }
}
