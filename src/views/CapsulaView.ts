import type { Capsula } from '../models/CapsulaModel'

export class CapsulaView {
  form = document.getElementById('formulario') as HTMLFormElement
  id = document.getElementById('id') as HTMLInputElement
  titulo = document.getElementById('titulo') as HTMLInputElement
  mensaje = document.getElementById('mensaje') as HTMLTextAreaElement
  emocion = document.getElementById('emocion') as HTMLSelectElement
  otraEmocion = document.getElementById('otraEmocion') as HTMLInputElement
  fecha = document.getElementById('fecha') as HTMLInputElement
  filtro = document.getElementById('filtro') as HTMLSelectElement
  lista = document.getElementById('lista') as HTMLElement
  btnGuardar = document.getElementById('btnGuardar') as HTMLButtonElement
  btnCancelar = document.getElementById('btnCancelar') as HTMLButtonElement

  mostrar(capsulas: Capsula[], estaAbierta: (c: Capsula) => boolean): void {
    if (capsulas.length === 0) {
      this.lista.innerHTML = `
        <div class="vacio">
          <div class="sello-vacio"></div>
          <p>Todavía no hay cápsulas. Escribe la primera carta.</p>
        </div>`
      return
    }

    this.lista.innerHTML = capsulas.map(c => {
      const abierta = estaAbierta(c)
      return `
        <article class="tarjeta ${abierta ? 'abierta' : 'cerrada'}">
          <div class="sobre">
            <div class="solapa"></div>
            <button type="button" class="sello" data-sello="${c.id}" title="${abierta ? 'Romper el sello' : 'Todavía no'}">C</button>
            <h3>${c.titulo}</h3>
            <p class="nota">${abierta ? 'Toca el sello para abrir' : 'Este mensaje se abrirá el ' + c.fecha_apertura}</p>
          </div>
          ${abierta ? `<div class="carta"><p class="mensaje">${c.mensaje}</p></div>` : ''}
          <p class="info">Emoción: ${c.emocion} · Creada: ${c.fecha_creacion}</p>
          <div class="acciones">
            <button type="button" data-editar="${c.id}">Editar</button>
            <button type="button" data-eliminar="${c.id}" class="peligro">Eliminar</button>
          </div>
        </article>`
    }).join('')
  }

  abrirSobre(sello: HTMLElement): void {
    const tarjeta = sello.closest('.tarjeta') as HTMLElement
    if (tarjeta.classList.contains('cerrada')) {
      // todavía no llega la fecha: el sobre solo tiembla
      tarjeta.classList.remove('temblar')
      void tarjeta.offsetWidth
      tarjeta.classList.add('temblar')
      return
    }
    tarjeta.classList.add('leida')
  }

  emocionElegida(): string {
    if (this.emocion.value === 'otro') return this.otraEmocion.value.trim()
    return this.emocion.value
  }

  mostrarCampoOtro(): void {
    const esOtro = this.emocion.value === 'otro'
    this.otraEmocion.hidden = !esOtro
    this.otraEmocion.required = esOtro
  }

  llenarFormulario(c: Capsula): void {
    this.id.value = String(c.id)
    this.titulo.value = c.titulo
    this.mensaje.value = c.mensaje

    const fijas = ['feliz', 'nostalgico', 'triste']
    if (fijas.includes(c.emocion)) {
      this.emocion.value = c.emocion
      this.otraEmocion.value = ''
    } else {
      this.emocion.value = 'otro'
      this.otraEmocion.value = c.emocion
    }
    this.mostrarCampoOtro()

    this.fecha.value = c.fecha_apertura
    this.btnGuardar.textContent = 'Actualizar cápsula'
    this.btnCancelar.hidden = false
    this.form.scrollIntoView({ behavior: 'smooth' })
  }

  limpiar(): void {
    this.form.reset()
    this.id.value = ''
    this.otraEmocion.value = ''
    this.btnGuardar.textContent = 'Guardar cápsula'
    this.btnCancelar.hidden = true
    this.mostrarCampoOtro()
  }
}
