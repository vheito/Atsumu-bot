console.log('🌸 Iniciando Yumiko Bot 🌸\n')

import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import { createInterface } from 'readline'
import yargs from 'yargs'
import express from 'express'
import chalk from 'chalk'
import os from 'os'
import fs from 'fs'

// Configuración de rutas
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)

// Cargar package.json
let packageJson
try {
  packageJson = JSON.parse(fs.readFileSync(join(__dirname, './package.json'), 'utf-8'))
} catch (err) {
  console.error(chalk.red('❌ Error al leer package.json:', err.message))
  process.exit(1)
}

// Configuración
const rl = createInterface(process.stdin, process.stdout)
const app = express()
const PORT = process.env.PORT || 8080

// Banner
console.log(chalk.cyan.bold('╔════════════════════════════════════════╗'))
console.log(chalk.cyan.bold('║                                        ║'))
console.log(chalk.magenta.bold('║         🌸 YUMIKO BOT 🌸              ║'))
console.log(chalk.yellow.bold('║              By: Mxz                   ║'))
console.log(chalk.cyan.bold('║                                        ║'))
console.log(chalk.cyan.bold('╚════════════════════════════════════════╝\n'))

// Servidor Express
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Yumiko Bot</title>
      <style>
        body { 
          font-family: Arial; 
          text-align: center; 
          padding: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        h1 { font-size: 3em; margin: 0; }
        p { font-size: 1.2em; }
      </style>
    </head>
    <body>
      <h1>🌸 Yumiko Bot</h1>
      <p>El bot está funcionando correctamente</p>
      <p>By: Mxz</p>
    </body>
    </html>
  `)
})

app.listen(PORT, () => {
  console.log(chalk.green(`✅ Servidor web activo en puerto ${PORT}\n`))
})

// Estado del proceso
let isRunning = false

/**
 * Función principal para iniciar el bot
 */
async function start(file) {
  if (isRunning) return
  isRunning = true

  let args = [join(__dirname, file), ...process.argv.slice(2)]
  
  console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'))
  console.log(chalk.cyan('📌 Iniciando proceso:', file))
  console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'))

  // Información del sistema
  console.log(chalk.yellow('📊 Información del Sistema:'))
  console.log(chalk.gray(`   OS: ${os.type()} ${os.release()} (${os.arch()})`))
  console.log(chalk.gray(`   RAM Total: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`))
  console.log(chalk.gray(`   RAM Libre: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`))
  console.log(chalk.gray(`   Node: ${process.version}`))
  
  // Información del bot
  console.log(chalk.yellow('\n📦 Información del Bot:'))
  console.log(chalk.gray(`   Nombre: ${packageJson.name}`))
  console.log(chalk.gray(`   Versión: ${packageJson.version}`))
  console.log(chalk.gray(`   Descripción: ${packageJson.description}`))
  console.log(chalk.gray(`   Autor: ${packageJson.author.name}`))
  
  // Hora actual
  const now = new Date().toLocaleString('es-ES', { 
    timeZone: 'America/Argentina/Buenos_Aires',
    dateStyle: 'full',
    timeStyle: 'long'
  })
  console.log(chalk.yellow('\n⏰ Fecha y Hora:'))
  console.log(chalk.gray(`   ${now}\n`))

  console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'))

  // Configurar el cluster
  setupMaster({
    exec: args[0],
    args: args.slice(1),
  })

  let p = fork()

  // Manejar mensajes del proceso hijo
  p.on('message', data => {
    console.log(chalk.cyan('[MENSAJE RECIBIDO]'), data)
    switch (data) {
      case 'reset':
        p.process.kill()
        isRunning = false
        start.apply(this, arguments)
        break
      case 'uptime':
        p.send(process.uptime())
        break
    }
  })

  // Manejar salida del proceso
  p.on('exit', (_, code) => {
    isRunning = false
    console.error(chalk.red(`\n❌ El proceso finalizó con código: ${code}\n`))

    if (code !== 0) {
      console.log(chalk.yellow('♻️  Reiniciando en 3 segundos...\n'))
      setTimeout(() => {
        start('main.js')
      }, 3000)
    } else {
      console.log(chalk.green('✅ Proceso finalizado correctamente\n'))
    }

    if (code === 0) return

    // Watch para cambios en el archivo
    watchFile(args[0], () => {
      unwatchFile(args[0])
      console.log(chalk.blue('🔄 Archivo modificado, reiniciando...\n'))
      start(file)
    })
  })

  // Manejar errores del proceso
  p.on('error', (err) => {
    console.error(chalk.red('❌ Error en el proceso:'), err)
    isRunning = false
  })

  // Configurar opciones de línea de comandos
  let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
  
  // Readline para comandos interactivos
  if (!opts['test']) {
    if (!rl.listenerCount()) {
      rl.on('line', line => {
        p.emit('message', line.trim())
      })
    }
  }
}

// Manejo de errores globales
process.on('uncaughtException', (err) => {
  console.error(chalk.red('\n❌ Error no capturado:'), err)
})

process.on('unhandledRejection', (err) => {
  console.error(chalk.red('\n❌ Promesa rechazada no manejada:'), err)
})

// Manejo de señales de terminación
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n👋 Deteniendo Yumiko Bot...\n'))
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n\n👋 Terminando Yumiko Bot...\n'))
  process.exit(0)
})

// Iniciar el bot
console.log(chalk.green('🚀 Iniciando main.js...\n'))
start('main.js')