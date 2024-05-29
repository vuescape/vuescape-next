/**
 * Adds a script to the document head.
 * If an ID is provided and a script with the same ID already exists in the document head, it removes the existing script before adding the new one.
 *
 * @param scriptContent - The content of the script to add.
 * @param [id] - The ID of the script. Optional.
 */
export function addScript(scriptContent: string, id?: string) {
  const script = document.createElement('script') as HTMLScriptElement
  script.type  = 'text/javascript'
  script.text  = scriptContent
  if (id) {
    const existingScript = document.head.querySelector(`#${id}`)
    existingScript?.remove()
    script.id = id
  }
  document.head.appendChild(script)
}

/**
 * Loads a script from a URL and adds it to the document head.
 * The script is loaded asynchronously.
 * If an ID is provided and a script with the same ID already exists in the document head, it removes the existing script before adding the new one.
 *
 * @param src - The URL of the script to load.
 * @param [id] - The ID of the script. Optional.
 */
export function loadScriptFromUrl(src: string, id?: string) {
  // return new Promise(function(resolve, reject) {
  const script = document.createElement('script') as HTMLScriptElement
  script.src   = src
  script.async = true
  if (id) {
    const existingScript = document.head.querySelector(`script#${id}`)
    existingScript?.remove()
    script.id = id
  }

  // script.onload = resolve
  // script.onerror = reject
  document.head.appendChild(script)
  // })
}
