import { saveAs } from 'file-saver'

/**
 * Downloads a file with the given data and filename.
 *
 * @param data - The data to download.
 * @param filename - The name of the file to download.
 * @param [shouldAddByteOrderMark=false] - Whether to add a byte order mark to the start of the data.
 * @param [mimeType='application/octet-stream'] - The MIME type of the file.
 * @param [charset='utf-8'] - The charset of the file.
 */
export function downloadFile(
  data: string | Uint8Array,
  filename: string,
  shouldAddByteOrderMark = false,
  mimeType               = 'application/octet-stream',
  charset                = 'utf-8',
) {
  if (data) {
    const blob = new Blob([shouldAddByteOrderMark ? '\ufeff' : '', data], { type: `${mimeType}; charset=${charset}` })
    saveAs(blob, filename)
  }
}
