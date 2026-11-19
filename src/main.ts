import './style.css'
import { DatabaseService } from './services/DatabaseService'
import { CapsulaModel } from './models/CapsulaModel'
import { CapsulaView } from './views/CapsulaView'
import { TintaView } from './views/TintaView'
import { CapsulaController } from './controllers/CapsulaController'

async function iniciarApp() {
  const db = new DatabaseService()
  await db.iniciar()
  new CapsulaController(new CapsulaModel(db), new CapsulaView())
  new TintaView()
}

iniciarApp()
