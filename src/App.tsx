import { useEffect, useState } from "react"
import {
  Button,
  CourseCard,
  Icon,
  Modal,
  SectionHeading,
  Tags,
} from "./components"
import { translations, type Language } from "./translations"

const frontTech = ["HTML", "CSS", "JavaScript", "TypeScript", "React"]
const backTech = ["Python", "SQL", "PostgreSQL", "FastAPI"]
const technologies = [...frontTech, ...backTech]
const technologyIcons = [
  "html5",
  "css3",
  "javascript",
  "typescript",
  "react",
  "python",
  "sql",
  "postgresql",
  "fastapi",
]
function stored(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function persist(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* Storage may be unavailable in private contexts. */
  }
}
type ModalState = "start" | "login" | "front" | "back" | "ready" | null | number

export default function App() {
  const [lang, setLang] = useState<Language>(() =>
    stored("wecode-language") === "ru" ? "ru" : "en",
  )
  const [menu, setMenu] = useState(false)
  const [modal, setModal] = useState<ModalState>(null)
  const [path, setPath] = useState(() => stored("wecode-path") || "front")
  const [level, setLevel] = useState(() => stored("wecode-level") || "0")
  const [ai, setAi] = useState(0)
  const t = translations[lang]
  useEffect(() => {
    document.documentElement.dataset.theme = "dark"
    persist("wecode-theme", "dark")
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
    document.title =
      lang === "ru"
        ? "WeCode — от знаний к проектам"
        : "WeCode — from learning to building"
    persist("wecode-language", lang)
  }, [lang])
  const open = (value: ModalState) => {
    setModal(value)
    setMenu(false)
  }
  const links = ["paths", "practice", "projects"]
  const curriculum =
    modal === "back" || (modal === "ready" && path === "back")
      ? t.backModules
      : t.frontModules
  const modalTitle =
    modal === "start"
      ? t.modalTitle
      : modal === "login"
        ? t.loginTitle
        : modal === "ready"
          ? t.ready
          : typeof modal === "number"
              ? t.projects[modal]
              : `${t.programTitle}: ${modal === "back" ? t.back : t.front}`

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a href="#" className="wordmark" aria-label="WeCode">
            We<span>Code</span>
            <i />
          </a>
          <nav
            className="desktop-nav"
            aria-label={
              lang === "ru" ? "Основная навигация" : "Main navigation"
            }
          >
            {t.nav.map((item, i) => (
              <a key={item} href={`#${links[i]}`}>
                {item}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="language-button"
              onClick={() => setLang(lang === "ru" ? "en" : "ru")}
              aria-label={t.language}
            >
              <span className={lang === "ru" ? "selected-language" : ""}>
                RU
              </span>
              <span>/</span>
              <span className={lang === "en" ? "selected-language" : ""}>
                EN
              </span>
            </button>
            <button className="login-button" onClick={() => open("login")}>
              {t.login}
            </button>
            <Button className="header-cta" onClick={() => open("start")}>
              {t.start}
              <Icon name="arrow" size={17} />
            </Button>
            <button
              className="icon-button mobile-toggle"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? t.close : t.menu}
              aria-expanded={menu}
              aria-controls="mobile-nav"
            >
              <Icon name={menu ? "close" : "menu"} />
            </button>
          </div>
        </div>
        {menu && (
          <nav id="mobile-nav" className="mobile-nav">
            {t.nav.map((item, i) => (
              <a
                key={item}
                onClick={() => setMenu(false)}
                href={`#${links[i]}`}
              >
                {item}
                <Icon name="arrow" size={17} />
              </a>
            ))}
            <Button secondary onClick={() => open("login")}>
              {t.login}
            </Button>
            <Button onClick={() => open("start")}>{t.start}</Button>
          </nav>
        )}
      </header>
      <main>
        <section className="hero">
          <div className="container hero-layout">
            <div className="hero-copy">
              <div className="hero-badge">
                <span />
                {t.badge}
              </div>
              <h1>
                {t.hero1}
                <br />
                {t.hero2}
                <br />
                <em>{t.hero3}</em>
              </h1>
              <p className="hero-description">{t.intro}</p>
              <div className="learning-strip" aria-label={t.learningFlowLabel}>
                {t.learningFlow.map((step, index) => (
                  <div className="learning-strip-step" key={step}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{step}</strong>
                    {index < t.learningFlow.length - 1 && (
                      <Icon name="arrow" size={14} />
                    )}
                  </div>
                ))}
              </div>
              <div className="hero-buttons">
                <Button onClick={() => open("start")}>
                  {t.heroStart}
                  <Icon name="arrow" />
                </Button>
                <a href="#paths" className="button button-secondary">
                  {t.explorePaths}
                  <span className="down-arrow">↓</span>
                </a>
              </div>
              <div className="hero-note">
                <span className="tiny-check">
                  <Icon name="check" size={12} />
                </span>
                {t.free}
                <span className="note-divider" />
                {t.pace}
              </div>
            </div>
            <div className="hero-visual">
              <article className="hero-card frontend-card">
                <div className="hero-card-top">
                  <div className="track-icon">
                    <Icon name="code" size={25} />
                  </div>
                  <span className="small-label">01 / WECODE</span>
                  <span className="card-diagonal">↗</span>
                </div>
                <h2>
                  Frontend
                  <br />
                  <em>{t.development}</em>
                  <span className="title-dot">.</span>
                </h2>
                <p>{t.frontResult}</p>
                <div className="cover-symbol" aria-hidden="true">
                  {"</>"}
                </div>
                <Tags items={["HTML", "CSS", "JavaScript", "React"]} />
              </article>
              <article className="hero-card backend-card">
                <div className="hero-card-top">
                  <div className="track-icon purple">
                    <Icon name="layers" size={25} />
                  </div>
                  <span className="small-label">02 / WECODE</span>
                  <span className="card-diagonal">↗</span>
                </div>
                <h2>
                  Python &<br />
                  <em>Backend</em>
                  <span className="title-dot">.</span>
                </h2>
                <p>{t.backResult}</p>
                <div className="cover-symbol backend-symbol" aria-hidden="true">
                  {"{_}"}
                </div>
                <Tags items={["Python", "SQL", "APIs", "FastAPI"]} />
              </article>
              <div className="visual-caption">
                <span className="caption-line" />
                <Icon name="code" size={15} />
                <span>{t.coverCaption}</span>
              </div>
            </div>
          </div>
          <div className="container hero-bottom">
            <div>
              <Icon name="book" size={16} />
              {t.free}
            </div>
            <div>
              <Icon name="clock" size={16} />
              {t.pace}
            </div>
            <div>
              <Icon name="globe" size={16} />
              {t.langs}
            </div>
            <span className="scroll-caption">
              {t.scroll} <span>↓</span>
            </span>
          </div>
        </section>
        <div className="manifesto container">
          <span>{t.strip}</span> <strong>{t.stripBold}</strong>
          <Icon name="spark" size={27} />
        </div>
        <section className="section container" id="paths">
          <SectionHeading
            eyebrow={t.dirTag}
            title={t.dirTitle}
            description={t.dirDesc}
          />
          <div className="path-grid">
            {["front", "back"].map((p, i) => (
              <article key={p} className={`path-card ${i ? "path-back" : ""}`}>
                <div className="path-card-head">
                  <div className={`track-icon ${i ? "purple" : ""}`}>
                    <Icon name={i ? "layers" : "code"} size={27} />
                  </div>
                  <span className="path-level">{t.level}</span>
                </div>
                <h3>{i ? t.back : t.front}</h3>
                <p>{i ? t.backDesc : t.frontDesc}</p>
                <Tags items={i ? backTech : frontTech} />
                <div className="path-project">
                  <Icon name={i ? "terminal" : "globe"} size={25} />
                  <div>
                    <span>{t.projectLabel}</span>
                    <strong>{i ? t.backProject : t.frontProject}</strong>
                  </div>
                  <span className="project-arrow">↗</span>
                </div>
                <button
                  className="path-action"
                  onClick={() => open(p as ModalState)}
                >
                  {t.program}
                  <Icon name="arrow" size={19} />
                </button>
              </article>
            ))}
          </div>
        </section>
        <section className="tech-section container">
          <div>
            <p className="eyebrow">{t.techTag}</p>
            <h2>{t.techTitle}</h2>
          </div>
          <div className="tech-grid">
            {technologies.map((tech, i) => (
              <div className="tech-item" key={tech}>
                <span className="tech-monogram">
                  <img
                    src={`/tech/${technologyIcons[i]}.svg`}
                    alt=""
                    width="24"
                    height="24"
                  />
                </span>
                <div>
                  <strong>{tech}</strong>
                  <p>{t.techDesc[i]}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="section container" id="learning">
          <SectionHeading eyebrow={t.howTag} title={t.howTitle} />
          <div className="steps">
            {t.steps.map((step, i) => (
              <article key={step}>
                <div className="step-top">
                  <span>0{i + 1}</span>
                  <Icon
                    name={["book", "code", "terminal", "layers"][i]}
                    size={22}
                  />
                  {i < 3 && <span className="step-arrow">→</span>}
                </div>
                <h3>{step}</h3>
                <p>{t.stepDesc[i]}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section container" id="practice">
          <SectionHeading eyebrow={t.practiceTag} title={t.practiceTitle} />
          <p className="examples-label">{t.examplesLabel}</p>
          <div className="practice-grid">
            <article className="challenge-card">
              <div className="challenge-heading">
                <span className="eyebrow">JAVASCRIPT</span>
                <span className="difficulty">
                  {lang === "ru" ? "Начальный" : "Beginner"}
                </span>
              </div>
              <h3>{t.task}</h3>
              <p>{t.taskDesc}</p>
              <div className="code-example">
                <div>
                  <span className="line-number">1</span>
                  <code>
                    <span className="code-purple">function</span>{" "}
                    <span className="code-blue">findMax</span>(numbers) {"{"}
                  </code>
                </div>
                <div>
                  <span className="line-number">2</span>
                  <code>
                    {" "}
                    <span className="code-comment">
                      //{" "}
                      {lang === "ru"
                        ? "Твоё решение начинается здесь"
                        : "Your solution starts here"}
                    </span>
                  </code>
                </div>
                <div>
                  <span className="line-number">3</span>
                  <code>{"}"}</code>
                </div>
                <div className="code-spacer" />
                <div>
                  <span className="line-number">5</span>
                  <code>
                    <span className="code-blue">findMax</span>([
                    <span className="code-orange">3, 8, 2, 5</span>]){" "}
                    <span className="code-comment">// → 8</span>
                  </code>
                </div>
              </div>
              <div className="challenge-bottom">
                <span>{t.example}</span>
                <button
                  className="icon-button"
                  aria-label={t.nav[1]}
                  onClick={() => open("start")}
                >
                  <Icon name="arrow" />
                </button>
              </div>
            </article>
            <div className="project-list" id="projects">
              {t.projects.map((project, i) => (
                <CourseCard
                  key={project}
                  title={project}
                  description={t.projectDescs[i]}
                  cover={
                    <Icon name={["globe", "layers", "terminal"][i]} size={30} />
                  }
                  action={t.explore}
                  onClick={() => open(i)}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="section container">
          <div className="ai-section">
            <div className="ai-copy">
              <p className="eyebrow">{t.aiTag}</p>
              <h2>{t.aiTitle}</h2>
              <p>{t.aiDesc}</p>
              <div className="ai-actions">
                {t.aiActions.map((action, i) => (
                  <button
                    key={action}
                    className={ai === i ? "active" : ""}
                    onClick={() => setAi(i)}
                  >
                    <Icon name="spark" size={15} />
                    {action}
                  </button>
                ))}
              </div>
            </div>
            <div className="chat">
              <div className="chat-heading">
                <span className="mentor-icon">
                  <Icon name="spark" size={20} />
                </span>
                <strong>WeCode AI</strong>
                <span className="demo-tag">{t.demo}</span>
              </div>
              <p className="chat-question">{t.aiQuestion}</p>
              <div className="chat-response">
                <Icon name="spark" size={18} />
                <p key={`${lang}-${ai}`} aria-live="polite">
                  {t.aiReplies[ai]}
                </p>
              </div>
              <div className="chat-disclaimer">{t.aiDemo}</div>
            </div>
          </div>
        </section>
        <section className="final-cta container">
          <p className="eyebrow">{t.badge}</p>
          <h2>
            {t.finalTitle}
            <br />
            <em>{t.finalAccent}</em>
          </h2>
          <Button onClick={() => open("start")}>
            {t.finalButton}
            <Icon name="arrow" />
          </Button>
          <p>
            {t.free} · {t.pace}
          </p>
        </section>
      </main>
      <footer className="footer container">
        <div className="footer-top">
          <div>
            <a href="#" className="wordmark">
              We<span>Code</span>
              <i />
            </a>
            <p>{t.footer}</p>
          </div>
          <nav>
            {t.nav.map((item, i) => (
              <a key={item} href={`#${links[i]}`}>
                {item}
              </a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} WeCode</span>
          <span>{t.footerNote}</span>
          <a href="#">↑ {lang === "ru" ? "Наверх" : "Back to top"}</a>
        </div>
      </footer>
      {modal !== null && (
        <Modal
          title={modalTitle}
          close={() => setModal(null)}
          closeLabel={t.close}
        >
          {modal === "start" ? (
            <>
              <span className="modal-badge">{t.proto}</span>
              <p>{t.modalDesc}</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  persist("wecode-path", path)
                  persist("wecode-level", level)
                  setModal("ready")
                }}
              >
                <fieldset>
                  <legend>{t.choose}</legend>
                  {["front", "back"].map((value, i) => (
                    <label className="choice" key={value}>
                      <input
                        type="radio"
                        name="path"
                        value={value}
                        checked={path === value}
                        onChange={() => setPath(value)}
                      />
                      <span>{i ? t.back : t.front}</span>
                      <Icon name={i ? "layers" : "code"} />
                    </label>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>{t.pickLevel}</legend>
                  {t.levels.map((value, i) => (
                    <label className="choice" key={value}>
                      <input
                        type="radio"
                        name="level"
                        checked={level === String(i)}
                        onChange={() => setLevel(String(i))}
                      />
                      <span>{value}</span>
                    </label>
                  ))}
                </fieldset>
                <Button type="submit">
                  {t.save}
                  <Icon name="arrow" />
                </Button>
              </form>
            </>
          ) : modal === "login" ? (
            <>
              <p>{t.loginDesc}</p>
              <Button onClick={() => setModal("start")}>
                {t.choose}
                <Icon name="arrow" />
              </Button>
            </>
          ) : typeof modal === "number" ? (
            <>
              <span className="modal-badge">{t.included}</span>
              <p>{t.projectDetail}</p>
              <Tags
                items={
                  modal === 2
                    ? backTech
                    : modal === 1
                      ? frontTech
                      : ["HTML", "CSS", "JavaScript", "Git"]
                }
              />
              <Button
                onClick={() => {
                  setPath(modal === 2 ? "back" : "front")
                  setModal("start")
                }}
              >
                {t.start}
                <Icon name="arrow" />
              </Button>
            </>
          ) : (
            <>
              {modal === "ready" && (
                <>
                  <p>{t.readyDesc}</p>
                  <span className="modal-badge">
                    {path === "back" ? t.back : t.front} ·{" "}
                    {t.levels[Number(level)]}
                  </span>
                </>
              )}
              <p>{t.modules[0]}</p>
              <ol className="curriculum">
                {curriculum.map((item, i) => (
                  <li key={item}>
                    <span>0{i + 1}</span>
                    <div>
                      <strong>{item}</strong>
                      <p>{t.modules[1]}</p>
                    </div>
                  </li>
                ))}
                <li>
                  <span>05</span>
                  <div>
                    <strong>
                      {modal === "back" ||
                      (modal === "ready" && path === "back")
                        ? t.backProject
                        : t.frontProject}
                    </strong>
                    <p>{t.modules[3]}</p>
                  </div>
                </li>
              </ol>
              {modal !== "ready" && (
                <Button
                  onClick={() => {
                    setPath(modal === "back" ? "back" : "front")
                    setModal("start")
                  }}
                >
                  {t.start}
                  <Icon name="arrow" />
                </Button>
              )}
            </>
          )}
        </Modal>
      )}
    </>
  )
}
