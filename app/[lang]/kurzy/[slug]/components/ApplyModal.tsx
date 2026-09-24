"use client"

import { isValidLanguage } from "@/i18n/config"
import { getSiteCopy } from "@/i18n/site"
import EnquiryDialog from "../../../components/EnquiryDialog"

interface ApplyModalProps {
  courseTitle: string
  lang: string
  isOpen: boolean
  onClose: () => void
  id?: string
}

export default function ApplyModal({ courseTitle, lang, isOpen, onClose, id }: ApplyModalProps) {
  const language = isValidLanguage(lang) ? lang : "cs"
  const copy = getSiteCopy(language)
  const close = language === "cs" ? "Zavřít přihlášku" : language === "en" ? "Close application" : "Закрыть заявку"

  return <EnquiryDialog id={id} lang={language} title={copy.apply.button} intro={copy.course.applicationNote} closeLabel={close} courseTitle={courseTitle} isOpen={isOpen} onClose={onClose} />
}