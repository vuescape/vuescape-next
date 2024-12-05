import * as fileSaver from 'file-saver'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { downloadFile } from '../../infrastructure/fileDownloader'

// Mock the file-saver module
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}))

describe('downloadFile', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks()
  })

  it('downloads a file with just mandatory parameters', () => {
    const data = 'Test data'
    const filename = 'test.txt'
    downloadFile(data, filename)
    expect(fileSaver.saveAs).toHaveBeenCalledWith(expect.any(Blob), filename)
  })

  it('downloads a file with a byte order mark', () => {
    const data = 'Test data'
    const filename = 'test.txt'
    downloadFile(data, filename, true)
    // @ts-expect-error TS2503
    const blob = (fileSaver.saveAs as vi.Mock).mock.calls[0][0] as Blob
    expect(fileSaver.saveAs).toHaveBeenCalledWith(expect.any(Blob), filename)
    expect(blob.size).toBeGreaterThan(data.length)
  })

  it('downloads a file with a custom MIME type and charset', () => {
    const data = 'Test data'
    const filename = 'test.json'
    const mimeType = 'application/json'
    const charset = 'utf-8'
    downloadFile(data, filename, false, mimeType, charset)
    // @ts-expect-error TS2503
    const blob = (fileSaver.saveAs as vi.Mock).mock.calls[0][0] as Blob

    expect(fileSaver.saveAs).toHaveBeenCalledWith(expect.any(Blob), filename)
    expect(blob.type).toBe(`${mimeType}; charset=${charset}`)
  })

  it('does nothing when data is not provided', () => {
    const filename = 'test.txt'
    downloadFile('', filename)
    expect(fileSaver.saveAs).not.toHaveBeenCalled()
  })
})
