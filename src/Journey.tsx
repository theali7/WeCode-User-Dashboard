import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabase"
import { Icon } from "./components"
import "./journey.css"

type Profile = { display_name: string; path_id: string | null; level: number }
type Lesson = { id: string; title_ru: string; title_en: string; content_ru: string; content_en: string; position: number }
export default function Journey({ user, lang, onLanguage }: { user: User; lang: string; onLanguage: () => void }) {
  const ru = lang === "ru"
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [path, setPath] = useState("front")
  const [level, setLevel] = useState(0)
  const [name, setName] = useState("")
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completed, setCompleted] = useState<string[]>([])
  const [active, setActive] = useState<Lesson | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [reload, setReload] = useState(0)
  const word = (a: string, b: string) => ru ? a : b
  useEffect(() => {
    let cancelled = false
    setLoading(true); setError("")
    async function load() {
      const { data, error } = await supabase.from("profiles").select("display_name,path_id,level").eq("id", user.id).maybeSingle()
      if (cancelled) return
      if (error) { setError(word("Не удалось загрузить профиль. Повтори попытку.", "Could not load your profile. Try again.")); setLoading(false); return }
      setProfile(data); setPath(data?.path_id || "front"); setLevel(data?.level ?? 0)
      setName(data?.display_name || String(user.user_metadata?.display_name || user.user_metadata?.name || ""))
      if (data?.path_id) {
        const [course, progress] = await Promise.all([
          supabase.from("lessons").select("id,title_ru,title_en,content_ru,content_en,position").eq("path_id", data.path_id).eq("published", true).order("position"),
          supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id).eq("completed", true),
        ])
        if (cancelled) return
        if (course.error || progress.error) setError(word("Не удалось загрузить уроки. Повтори попытку.", "Could not load your lessons. Try again."))
        else { setLessons(course.data || []); setCompleted((progress.data || []).map(p => p.lesson_id)) }
      }
      setLoading(false)
    }
    void load()
    return () => { cancelled = true }
  }, [user.id, reload, lang])
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("")
    try {
      const value = { id: user.id, display_name: name.trim(), path_id: path, level }
      const { error } = await supabase.from("profiles").upsert(value)
      if (error) throw error
      setEditing(false); setActive(null); setReload(n => n + 1)
    } catch { setError(word("Не удалось сохранить выбор. Попробуй ещё раз.", "Could not save your choices. Please try again.")) }
    finally { setBusy(false) }
  }
  async function finish() {
    if (!active) return
    setBusy(true); setError("")
    try {
      const { error } = await supabase.from("lesson_progress").upsert({ user_id: user.id, lesson_id: active.id, completed: true, updated_at: new Date().toISOString() })
      if (error) throw error
      setCompleted(list => [...new Set([...list, active.id])]); setActive(null)
    } catch { setError(word("Не удалось сохранить прогресс. Попробуй снова.", "Could not save your progress. Try again.")) }
    finally { setBusy(false) }
  }
  const done = lessons.filter(l => completed.includes(l.id)).length
  const percent = lessons.length ? Math.round(done / lessons.length * 100) : 0
  const next = lessons.find(l => !completed.includes(l.id))
  const levels = ru ? ["Начинающий", "Средний", "Продвинутый"] : ["Beginner", "Intermediate", "Advanced"]
  const descriptions = ru ? ["Начну с основ и первых строк кода", "Знаю основы, хочу больше практики", "Готов к сложным задачам и проектам"] : ["Start with the basics and first lines of code", "Know the basics and want more practice", "Ready for challenging tasks and projects"]
  const setup = !profile?.path_id || editing
  return <div className="journey">
    <header className="journey-header"><a className="wordmark" href="#" aria-label="WeCode">We<span>Code</span><i /></a><div><button onClick={onLanguage}>{ru ? "EN" : "RU"}</button><button disabled={busy} onClick={async () => { setBusy(true); const { error } = await supabase.auth.signOut(); if(error) setError(word("Не удалось выйти.", "Could not sign out.")); setBusy(false) }}>{word("Выйти", "Sign out")} <Icon name="arrow" size={16} /></button></div></header>
    <main className="journey-main">
      {loading ? <div className="journey-loading" role="status"><span className="eyebrow">WECODE / LEARNING</span><h1>{word("Готовим твой маршрут…", "Loading your learning path…")}</h1></div> : error && !profile ? null : setup ? <form onSubmit={save}>
        <div className="journey-heading"><p className="eyebrow">{word("ТВОЯ СЛЕДУЮЩАЯ ГЛАВА", "YOUR NEXT CHAPTER")}</p><h1>{word("Начни свой", "Start your")} <em>{word("путь.", "journey.")}</em></h1><p>{word("Не нужно знать всё заранее. Выбери то, что интересно тебе — остальное освоишь шаг за шагом.", "You do not need to know everything yet. Choose what interests you and build your skills step by step.")}</p></div>
        <label className="journey-name">{word("Как к тебе обращаться?", "What should we call you?")}<input value={name} onChange={e => setName(e.target.value)} required maxLength={80} autoComplete="name" placeholder={word("Твоё имя", "Your name")} /></label>
        <fieldset><legend><span>01</span>{word("Выбери направление", "Choose your direction")}</legend><div className="journey-paths">{["front", "back"].map((p,i) => <label key={p} className={`journey-path ${path === p ? "is-selected" : ""}`}><input type="radio" name="path" value={p} checked={path === p} onChange={() => setPath(p)} /><span className="journey-path-top"><Icon name={i ? "layers" : "code"} size={28}/><span className="journey-radio">{path === p && <Icon name="check" size={15}/>}</span></span><span className="journey-code" aria-hidden="true">{i ? "{ }" : "</>"}</span><strong>{i ? "Python / Backend" : "Frontend"}</strong><span>{i ? word("Логика, API и базы данных. Создавай основу приложений.", "Logic, APIs and databases. Build what powers applications.") : word("Интерфейсы, сайты и веб-приложения. Сделай идеи видимыми.", "Interfaces, websites and web apps. Bring your ideas to the screen.")}</span><small>{i ? "Python · SQL · PostgreSQL · FastAPI" : "HTML · CSS · JavaScript · React"}</small></label>)}</div></fieldset>
        <fieldset><legend><span>02</span>{word("С какого уровня начнём?", "Where are you starting?")}</legend><div className="journey-levels">{levels.map((v,i) => <label key={v} className={level === i ? "is-selected" : ""}><input type="radio" name="level" checked={level === i} onChange={() => setLevel(i)}/><span className="journey-level-number">0{i+1}</span><strong>{v}</strong><span>{descriptions[i]}</span></label>)}</div></fieldset>
        <div className="journey-submit"><div><strong>{word("Твой темп. Твои проекты.", "Your pace. Your projects.")}</strong><p>{word("Направление и уровень можно изменить позже.", "You can change your path and level later.")}</p></div><button className="journey-primary" disabled={busy}>{busy ? "…" : word("Начать обучение", "Start learning")}<Icon name="arrow" size={20}/></button>{editing && <button type="button" className="journey-text-button" onClick={() => setEditing(false)}>{word("Отмена", "Cancel")}</button>}</div>
      </form> : active ? <section className="journey-reader"><button className="journey-text-button" onClick={() => setActive(null)}>← {word("В кабинет", "Back to dashboard")}</button><p className="eyebrow">{profile.path_id === "front" ? "FRONTEND" : "PYTHON / BACKEND"} / {word("УРОК", "LESSON")}</p><h1>{ru ? active.title_ru : active.title_en}</h1><div className="journey-lesson-text">{(ru ? active.content_ru : active.content_en).split("\n\n").map((p,i) => <p key={i}>{p}</p>)}</div><button className="journey-primary" disabled={busy} onClick={() => void finish()}>{busy ? "…" : word("Урок пройден", "Mark as complete")}<Icon name="check" size={20}/></button></section> : <>
        <div className="journey-dashboard-heading"><div><p className="eyebrow">{word("ТВОЙ УЧЕБНЫЙ КАБИНЕТ", "YOUR LEARNING SPACE")}</p><h1>{word("Привет", "Hello")}, <em>{profile.display_name || word("разработчик", "developer")}.</em></h1><p>{word("Одна новая идея. Одна задача. Ещё один шаг вперёд.", "One new idea. One challenge. Another step forward.")}</p></div><button className="journey-text-button" onClick={() => {setEditing(true);setError("")}}>{word("Изменить мой путь", "Edit my learning path")} ↗</button></div>
        <div className="journey-dashboard-grid"><section className="journey-next"><p className="eyebrow">{next ? word("СЛЕДУЮЩИЙ ШАГ", "YOUR NEXT STEP") : word("ТВОЙ МАРШРУТ", "YOUR PATH")}</p><span className="journey-dashboard-symbol" aria-hidden="true">{profile.path_id === "front" ? "</>" : "{ }"}</span><h2>{next ? (ru ? next.title_ru : next.title_en) : lessons.length ? word("Отличное начало!", "A great start!") : word("Уроки готовятся", "Lessons are on their way")}</h2><p>{next ? word("Начни с короткого урока и закрепи первую идею на практике.", "Start with a short lesson and try your first idea in practice.") : word("Новые материалы появятся здесь. Твой выбор и прогресс сохранены.", "New learning material will appear here. Your choices and progress are saved.")}</p>{next && <button className="journey-primary" onClick={() => setActive(next)}>{word("Открыть урок", "Open lesson")}<Icon name="arrow" size={20}/></button>}</section><aside className="journey-progress"><p className="eyebrow">{word("МОЙ ПРОГРЕСС", "MY PROGRESS")}</p><strong className="journey-percentage">{percent}<span>%</span></strong><div className="journey-progress-track" role="progressbar" aria-label={word("Пройденные уроки", "Completed lessons")} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${percent}%`}}/></div><p>{done} / {lessons.length} {word("уроков пройдено", "lessons completed")}</p><dl><dt>{word("Направление", "Learning path")}</dt><dd>{profile.path_id === "front" ? "Frontend" : "Python / Backend"}</dd><dt>{word("Уровень", "Level")}</dt><dd>{levels[profile.level]}</dd></dl></aside></div>
        <section className="journey-curriculum"><h2>{word("Твоя программа", "Your curriculum")}</h2>{lessons.map((l,i) => <button key={l.id} onClick={() => setActive(l)}><span className="journey-lesson-number">{String(i+1).padStart(2,"0")}</span><span><strong>{ru ? l.title_ru : l.title_en}</strong><small>{completed.includes(l.id) ? word("Пройдено", "Completed") : word("Доступен", "Available")}</small></span><Icon name={completed.includes(l.id) ? "check" : "arrow"} size={20}/></button>)}</section>
      </>}
      {error && <div className="journey-error" role="alert">{error}<button onClick={() => setReload(n=>n+1)}>{word("Повторить", "Retry")}</button></div>}
    </main><footer className="journey-footer">WeCode <span>{word("Учись. Практикуйся. Создавай.", "Learn. Practice. Build.")}</span></footer>
  </div>
}
