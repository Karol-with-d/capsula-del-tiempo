import { CapsulaModel } from '../models/CapsulaModel'
import { CapsulaView } from '../views/CapsulaView'

export class CapsulaController {
  private model: CapsulaModel
  private view: CapsulaView

  constructor(model: CapsulaModel, view: CapsulaView) {
    this.model = model
    this.view = view

    this.view.form.addEventListener('submit', e => {
      e.preventDefault()
      this.guardar()
    })

    this.view.emocion.addEventListener('change', () => this.view.mostrarCampoOtro())
    this.view.filtro.addEventListener('change', () => this.actualizarLista())
    this.view.btnCancelar.addEventListener('click', () => this.view.limpiar())

    this.view.lista.addEventListener('click', e => {
      const boton = e.target as HTMLElement
      const idEditar = boton.dataset.editar
      const idEliminar = boton.dataset.eliminar

      if (boton.dataset.sello) {
        this.view.abrirSobre(boton)
      }

      if (idEditar) {
        const capsula = this.model.buscarPorId(Number(idEditar))
        if (capsula) this.view.llenarFormulario(capsula)
      }

      if (idEliminar && confirm('¿Seguro que quieres eliminar esta cápsula?')) {
        this.model.eliminar(Number(idEliminar))
        this.actualizarLista()
      }
    })

    this.actualizarLista()
  }

  private guardar(): void {
    const titulo = this.view.titulo.value.trim()
    const mensaje = this.view.mensaje.value.trim()
    const emocion = this.view.emocionElegida()
    const fecha = this.view.fecha.value

    if (!titulo || !mensaje || !emocion || !fecha) {
      alert('Completa todos los campos.')
      return
    }

    const id = this.view.id.value
    if (id) {
      this.model.editar(Number(id), titulo, mensaje, emocion, fecha)
    } else {
      this.model.crear(titulo, mensaje, emocion, fecha)
    }

    this.view.limpiar()
    this.actualizarLista()
  }

  private actualizarLista(): void {
    const capsulas = this.model.listar(this.view.filtro.value)
    this.view.mostrar(capsulas, c => this.model.estaAbierta(c))
  }
}
