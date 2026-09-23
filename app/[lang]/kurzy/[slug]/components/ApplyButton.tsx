"use client"

import { useId, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { isValidLanguage } from "@/i18n/config"
import { getSiteCopy } from "@/i18n/site"
import ApplyModal from "./ApplyModal"

interface ApplyButtonProps {
  courseTitle: string
  lang: string
  variant?: "hero" | "card" | "bottom"
}

export default function ApplyButton({ courseTitle, lang, variant = "hero" }: ApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dialogId = useId()
  const copy = getSiteCopy(isValidLanguage(lang) ? lang : "cs")

  return <><button className={`button button-primary${variant === "card" ? " button-small" : ""}`} onClick={event => { event.currentTarget.focus(); setIsOpen(true) }} aria-haspopup="dialog" aria-controls={dialogId}>{copy.apply.button}<ArrowUpRight aria-hidden="true" /></button><ApplyModal id={dialogId} courseTitle={courseTitle} lang={lang} isOpen={isOpen} onClose={() => setIsOpen(false)} /></>
}