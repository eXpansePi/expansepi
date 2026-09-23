"use client"

import { useEffect, useId, useRef } from "react"
import { X } from "lucide-react"
import { isValidLanguage } from "@/i18n/config"
import { getSiteCopy } from "@/i18n/site"
import EnquiryForm from "../../../components/EnquiryForm"

interface ApplyModalProps {
  courseTitle: string
  lang: string
  isOpen: boolean
  onClose: () => void
  id?: string
}

export default function ApplyModal({ courseTitle, lang, isOpen, onClose, id }: ApplyModalProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const language = isValidLanguage(lang) ? lang : "cs"
  const copy = getSiteCopy(language)
  const close = language === "cs" ? "Zavřít přihlášku" : language === "en" ? "Close application" : "Закрыть заявку"

  useEffect(() => {
    if (isOpen && !dialog.current?.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.current?.showModal()
    }
    if (!isOpen && dialog.current?.open) dialog.current.close()
  }, [isOpen])

  return (
    <dialog ref={dialog} id={id} className="application-dialog" aria-labelledby={titleId} onClose={() => { onClose(); opener.current?.focus() }} onCancel={event => { event.preventDefault(); dialog.current?.close() }} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); dialog.current?.close() } }} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      {isOpen && <div className="dialog-inner">
        <div className="dialog-header"><div><h2 id={titleId}>{copy.apply.button}</h2><p>{courseTitle}</p></div><button className="icon-button dialog-close" type="button" aria-label={close} onClick={() => dialog.current?.close()}><X aria-hidden="true" /></button></div>
        <p className="form-intro">{copy.course.applicationNote}</p>
        <EnquiryForm courseTitle={courseTitle} lang={language} />
      </div>}
    </dialog>
  )
}