import { useEffect, useRef, type ReactNode } from "react"

type IconProps = {
  name: string
  size?: number
}

export function Icon({ name, size = 20 }: IconProps) {
  const paths: Record<string, ReactNode> = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    code: (
      <>
        <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 10 5-10 5L2 8l10-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </>
    ),
    moon: <path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    spark: (
      <>
        <path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z" />
        <path d="m20 2 .6 1.4L22 4l-1.4.6L20 6l-.6-1.4L18 4l1.4-.6L20 2Z" />
      </>
    ),
    book: (
      <>
        <path d="M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2V4Z" />
      </>
    ),
    terminal: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="m7 9 3 3-3 3m6 0h4" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.code}
    </svg>
  )
}

export function Button({
  children,
  onClick,
  secondary = false,
  className = "",
  type = "button",
}: {
  children: ReactNode
  onClick?: () => void
  secondary?: boolean
  className?: string
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button ${
        secondary ? "button-secondary" : "button-primary"
      } ${className}`}
    >
      {children}
    </button>
  )
}
export function Tags({ items }: { items: string[] }) {
  return (
    <div className="tags">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  )
}
export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  )
}
export function Modal({
  children,
  title,
  close,
  closeLabel,
}: {
  children: ReactNode
  title: string
  close: () => void
  closeLabel: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement
    const dialog = ref.current
    dialog?.showModal()
    const old = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      dialog?.close()
      document.body.style.overflow = old
      previous?.focus()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
      aria-labelledby="modal-title"
    >
      <div className="modal-inner">
        <button
          className="icon-button modal-close"
          onClick={close}
          aria-label={closeLabel}
        >
          <Icon name="close" />
        </button>
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </dialog>
  )
}

export function CourseCard({
  title,
  description,
  cover,
  progress,
  action,
  onClick,
  progressLabel,
}: {
  title: string
  description: string
  cover: ReactNode
  progress?: number
  action: string
  onClick: () => void
  progressLabel?: string
}) {
  return (
    <article className="course-card">
      <div className="course-cover">{cover}</div>
      <div className="course-content">
        <h3>{title}</h3>
        <p>{description}</p>
        {progress !== undefined && (
          <progress
            value={progress}
            max="100"
            aria-label={progressLabel || title}
          />
        )}
      </div>
      <button
        className="icon-button"
        onClick={onClick}
        aria-label={`${action}: ${title}`}
      >
        <Icon name="arrow" />
      </button>
    </article>
  )
}
