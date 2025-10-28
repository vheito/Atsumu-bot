import fetch from 'node-fetch'
import { FormData, Blob } from 'formdata-node'
import { fileTypeFromBuffer } from 'file-type'

/**
 * Upload ephemeral file to file.io (expires in 1 day, 100MB max)
 * @param {Buffer} buffer
 */
const fileIO = async buffer => {
  const { ext, mime } = (await fileTypeFromBuffer(buffer)) || {}
  const form = new FormData()
  const blob = new Blob([buffer], { type: mime })
  form.append('file', blob, `tmp.${ext || 'bin'}`)

  const res = await fetch('https://file.io/?expires=1d', {
    method: 'POST',
    body: form
  })

  const json = await res.json()
  if (!json.success) throw json
  return json.link
}

/**
 * Upload file to storage.restfulapi.my.id
 * @param {Buffer|Buffer[]} inp
 * @returns {Promise<string|string[]>}
 */
const RESTfulAPI = async inp => {
  const form = new FormData()
  const buffers = Array.isArray(inp) ? inp : [inp]

  for (const buffer of buffers) {
    const blob = new Blob([buffer])
    form.append('file', blob)
  }

  const res = await fetch('https://storage.restfulapi.my.id/upload', {
    method: 'POST',
    body: form
  })
  let json = await res.text()

  try {
    json = JSON.parse(json)
    return Array.isArray(inp) ? json.files.map(r => r.url) : json.files[0].url
  } catch (e) {
    throw json
  }
}

export default async function (inp) {
  for (const upload of [RESTfulAPI, fileIO]) {
    try {
      return await upload(inp)
    } catch (e) {
      console.error('Upload failed:', e)
    }
  }
  throw new Error('All upload methods failed.')
}