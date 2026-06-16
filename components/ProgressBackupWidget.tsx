'use client'

import { useRef, useState } from 'react'
import {
  exportProgress,
  importProgress,
  downloadProgressFile,
  parseProgressFile,
} from '@/lib/progressBackup'

export default function ProgressBackupWidget() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [exportStatus, setExportStatus] = useState<'idle' | 'done'>('idle')
  const [importStatus, setImportStatus] = useState<'idle' | 'done' | 'error'>('idle')
  const [importError, setImportError] = useState('')

  function handleExport() {
    const backup = exportProgress()
    downloadProgressFile(backup)
    setExportStatus('done')
    setTimeout(() => setExportStatus('idle'), 2000)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset so the same file can be re-selected after an error
    e.target.value = ''
    setImportStatus('idle')
    setImportError('')
    try {
      const backup = await parseProgressFile(file)
      importProgress(backup)
      setImportStatus('done')
      setTimeout(() => setImportStatus('idle'), 2000)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed.')
      setImportStatus('error')
      setTimeout(() => setImportStatus('idle'), 4000)
    }
  }

  return (
    <section className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
      <h2 className="text-lg font-semibold mb-1">Progress Backup</h2>
      <p className="text-xs text-gray-400 mb-4">
        Export your progress to restore it on another device or after clearing your browser.
      </p>
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleExport}
          className="px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
        >
          {exportStatus === 'done' ? 'Exported ✓' : 'Export Progress'}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
        >
          {importStatus === 'done'
            ? 'Imported ✓'
            : importStatus === 'error'
            ? importError
            : 'Import Progress'}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </section>
  )
}
