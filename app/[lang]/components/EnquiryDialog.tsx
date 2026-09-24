"use client"

import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react"
import { ArrowUpRight, X } from "lucide-react"
import type { Language } from "@/i18n/config"
import EnquiryForm from "./EnquiryForm"

interface EnquiryDialogProps {
  lang: Language
  title: string
  intro: string
  closeLabel: string
  courseTitle?: string
  intent?: "course" | "business"
  isOpen: boolean
  onClose: () => void
  id?: string
}

export default function EnquiryDialog({ lang, title, intro, closeLabel, courseTitle, intent = "course", isOpen, onClose, id }: EnquiryDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const titleId = useId()

  useEffect(() => {
    if (isOpen && !dialog.current?.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.current?.showModal()
    }
    if (!isOpen && dialog.current?.open) dialog.current.close()
  }, [isOpen])

  return <dialog ref={dialog} id={id} className="application-dialog" aria-labelledby={titleId} onClose={() => { onClose(); opener.current?.focus() }} onCancel={event => { event.preventDefault(); dialog.current?.close() }} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); dialog.current?.close() } }} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
    {isOpen && <div className="dialog-inner">
      <div className="dialog-header"><div><h2 id={titleId}>{title}</h2>{courseTitle && <p>{courseTitle}</p>}</div><button className="icon-button dialog-close" type="button" aria-label={closeLabel} onClick={() => dialog.current?.close()}><X aria-hidden="true" /></button></div>
      <p className="form-intro">{intro}</p>
      <EnquiryForm courseTitle={courseTitle} lang={lang} intent={intent} />
    </div>}
  </dialog>
}

const BusinessEnquiryContext = createContext<{ id: string; label: string; open: () => void } | null>(null)

interface BusinessEnquiryProps {
  children: ReactNode
  lang: Language
  label: string
  title: string
  intro: string
  closeLabel: string
}

export function BusinessEnquiry({ children, lang, label, title, intro, closeLabel }: BusinessEnquiryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const id = useId()

  return <BusinessEnquiryContext.Provider value={{ id, label, open: () => setIsOpen(true) }}>
    {children}
    <EnquiryDialog id={id} lang={lang} title={title} intro={intro} closeLabel={closeLabel} intent="business" isOpen={isOpen} onClose={() => setIsOpen(false)} />
  </BusinessEnquiryContext.Provider>
}

export function BusinessEnquiryButton({ className = "button button-primary", onOpen }: { className?: string; onOpen?: () => void }) {
  const enquiry = useContext(BusinessEnquiryContext)
  if (!enquiry) throw new Error("BusinessEnquiryButton requires BusinessEnquiry")

  return <button type="button" className={className} aria-haspopup="dialog" aria-controls={enquiry.id} onClick={event => { event.currentTarget.focus(); onOpen?.(); enquiry.open() }}>{enquiry.label}<ArrowUpRight aria-hidden="true" /></button>
}