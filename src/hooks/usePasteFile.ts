import { useEffect } from 'react'

export function usePasteFile({
  onFilePaste,
}: {
  onFilePaste: (files: File[]) => void
}) {
  useEffect(() => {
    const pasteHandler = (e: ClipboardEvent) => {
      const files: File[] = []
      const items = e.clipboardData?.items
      if (!items)
        return
      Array.from(items).forEach((item) => {
        const f = item.getAsFile()
        if (!f)
          return
        files.push(f)
      })
      if (!files.length)
        return
      onFilePaste(files)
    }

    document.body.addEventListener('paste', pasteHandler)
    return () => {
      document.body.removeEventListener('paste', pasteHandler)
    }
  })
}
