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
      this.lista.innerHTML = '<p class="vacio">Todavía no hay cápsulas. Crea la primera.</p>'
      return
    }

    this.lista.innerHTML = capsulas.map(c => {
      const abierta = estaAbierta(c)
      return `
        <article class="tarjeta ${abierta ? 'abierta' : 'cerrada'}">
          <h3>${c.titulo} ${abierta ? '(abierta)' : '(cerrada)'}</h3>
          <p class="mensaje">${abierta ? c.mensaje : 'Este mensaje se abrirá el ' + c.fecha_apertura}</p>
          <p class="info">Emoción: ${c.emocion} · Creada: ${c.fecha_creacion}</p>
          <div class="acciones">
            <button data-editar="${c.id}">Editar</button>
            <button data-eliminar="${c.id}" class="peligro">Eliminar</button>
          </div>
        </article>`
    }).join('')
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

    const fijas = ['feliz', 'nostalgica', 'triste']
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