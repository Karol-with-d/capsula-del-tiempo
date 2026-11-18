import initSqlJs, { type Database } from 'sql.js'

const CLAVE = 'capsula_db'

export class DatabaseService {
    private db!: Database

    async iniciar(): Promise<void> {
    const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
    const guardada = localStorage.getItem(CLAVE)

    if (guardada) {
    const bytes = Uint8Array.from(atob(guardada), c => c.charCodeAt(0))
    this.db = new SQL.Database(bytes)
    } else {
    this.db = new SQL.Database()
    }

    this.db.run(`CREATE TABLE IF NOT EXISTS capsulas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    emocion TEXT NOT NULL,
    fecha_creacion TEXT NOT NULL,
    fecha_apertura TEXT NOT NULL
    )`)
    this.guardar()
}

ejecutar(sql: string, params: (string | number)[] = []): void {
    this.db.run(sql, params)
    this.guardar()
}

consultar(sql: string, params: (string | number)[] = []): any[] {
    const stmt = this.db.prepare(sql)
    stmt.bind(params)
    const filas: any[] = []
    while (stmt.step()) filas.push(stmt.getAsObject())
    stmt.free()
    return filas
}

private guardar(): void {
    const datos = this.db.export()
    let texto = ''
    datos.forEach(b => (texto += String.fromCharCode(b)))
    localStorage.setItem(CLAVE, btoa(texto))
}
}