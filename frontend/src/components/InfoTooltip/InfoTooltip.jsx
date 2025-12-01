import { useState, useRef } from "react"
import { FiInfo } from "react-icons/fi"
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2"

import "./InfoTooltip.css"

const InfoTooltip = ({ text }) => {
  const [open, setOpen] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const closeTimeoutRef = useRef(null)

  const speak = () => {
    if (!text) return

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "pt-BR"
    utterance.rate = 1
    utterance.pitch = 1

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    speechSynthesis.speak(utterance)
  }

  const handleMouseEnter = () => {
    // Cancela fechamento pendente
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setOpen(true)
  }

  const handleMouseLeave = () => {
    // Aguarda antes de fechar
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false)
    }, 400) // ⏱ ajuste aqui (300–500ms ideal)
  }

  return (
    <div
      className="info-tooltip-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip trigger */}
      <button
        type="button"
        className="info-icon"
        onClick={() => setOpen((prev) => !prev)}
      >
        <FiInfo size={16} />
      </button>

      {/* Tooltip content */}
      {open && (
        <div className="info-tooltip-box">
          <span>{text}</span>

          <button
            type="button"
            className="tooltip-audio-btn"
            onClick={speak}
            aria-label="Ouvir descrição"
          >
            {speaking ? (
              <HiSpeakerXMark size={24} color="var(--primary-color)" />
            ) : (
              <HiSpeakerWave size={24} color="var(--primary-color)"/>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default InfoTooltip