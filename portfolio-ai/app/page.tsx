'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import styles from './page.module.css'

interface Project {
  id: string
  title: string
  description: string
  techStack: string
  demoUrl?: string
  repoUrl?: string
  author?: {
    name: string
    profile?: { title?: string }
  }
}

interface Developer {
  id: string
  name: string
  email: string
  profile?: {
    title?: string
    location?: string
    bio?: string
    githubUrl?: string
    linkedinUrl?: string
    website?: string
  } | null
}

type Page = 'home' | 'projects' | 'developers'

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } 
  }
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
}

const cardHover = {
  scale: 1.03,
  y: -8,
  transition: { type: "spring" as const, stiffness: 400, damping: 15 }
}

const buttonTap = {
  scale: 0.9,
  transition: { type: "spring" as const, stiffness: 500, damping: 10 }
}

function useTypingEffect(text: string, speed: number = 50) {
  const [displayedText, setDisplayedText] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index))
        setIndex(index + 1)
      }, speed)
      return () => clearTimeout(timer)
    }
  }, [index, text, speed])

  return displayedText
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [projects, setProjects] = useState<Project[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoaded, setInitialLoaded] = useState(false)

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      let projectsList = []
      if (Array.isArray(data)) projectsList = data
      else if (data.projects && Array.isArray(data.projects)) projectsList = data.projects
      else if (data.data && Array.isArray(data.data)) projectsList = data.data
      setProjects(projectsList)
    } catch (err) {
      console.error('Ошибка загрузки проектов:', err)
      setProjects([])
    }
  }, [])

  const fetchDevelopers = useCallback(async () => {
    try {
      const res = await fetch('/api/developers')
      const data = await res.json()
      let developersList = []
      if (Array.isArray(data)) developersList = data
      else if (data.developers && Array.isArray(data.developers)) developersList = data.developers
      else if (data.data && Array.isArray(data.data)) developersList = data.data
      setDevelopers(developersList)
    } catch (err) {
      console.error('Ошибка загрузки разработчиков:', err)
      setDevelopers([])
    }
  }, [])

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      await Promise.all([fetchProjects(), fetchDevelopers()])
      setLoading(false)
      setInitialLoaded(true)
    }
    loadInitialData()
  }, [fetchProjects, fetchDevelopers])

  useEffect(() => {
    if (!initialLoaded) return
    if (currentPage === 'projects' && projects.length === 0) fetchProjects()
    if (currentPage === 'developers' && developers.length === 0) fetchDevelopers()
  }, [currentPage, projects.length, developers.length, fetchProjects, fetchDevelopers, initialLoaded])

  const parseTechStack = (techStack: string): string[] => {
    if (!techStack) return []
    try { 
      const parsed = JSON.parse(techStack)
      return Array.isArray(parsed) ? parsed : []
    } catch { return [] }
  }

  const navigateTo = (page: Page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const typedTitle = useTypingEffect('Создавай. Публикуй. Находи.', 60)

  const floatingIcons = [
    { icon: '⚛️', top: '10%', left: '8%', delay: 0, size: 2.5 },
    { icon: '🟦', top: '70%', left: '88%', delay: 1.2, size: 2 },
    { icon: '🔷', top: '85%', left: '12%', delay: 0.6, size: 2.2 },
    { icon: '🟩', top: '20%', left: '92%', delay: 1.8, size: 1.8 },
    { icon: '🟨', top: '75%', left: '72%', delay: 2.5, size: 2.4 },
    { icon: '⬡', top: '35%', left: '4%', delay: 0.9, size: 2.1 },
    { icon: '🔶', top: '90%', left: '55%', delay: 2, size: 2 },
    { icon: '🟣', top: '50%', left: '95%', delay: 1.5, size: 1.7 },
  ]

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 3 + Math.random() * 5,
  }))

  return (
    <AnimatePresence mode="wait">
      <div className={styles.landing}>
        {/* Хедер */}
        <motion.header 
          className={styles.header}
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.1 }}
        >
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <motion.div 
                onClick={() => navigateTo('home')} 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                <motion.svg 
                  height="32" viewBox="0 0 24 24" width="32" className={styles.logo}
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.path fill="#c9d1d9" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut" }}
                  />
                  <path fill="#f97316" d="M11.5 3.5c-1.5 0-3 .5-4 1.5l-.5.5c-1 1-1.5 2.5-1.5 4v.5l1-1c.5-.5 1.5-1 2.5-1s2 .5 2.5 1l1 1v-.5c0-1.5-.5-3-1.5-4l-.5-.5c-1-1-2.5-1.5-4-1.5z"/>
                </motion.svg>
                <motion.span 
                  className={styles.headerBrand}
                  animate={{ textShadow: ['0 0 0px #58a6ff', '0 0 15px #58a6ff', '0 0 0px #58a6ff'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  DevPortal
                </motion.span>
              </motion.div>
            </div>
            <nav className={styles.headerNav}>
              {['projects', 'developers'].map((page) => (
                <motion.button
                  key={page}
                  onClick={() => navigateTo(page as Page)}
                  className={`${styles.headerLinkBtn} ${currentPage === page ? styles.headerLinkActive : ''}`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {page === 'projects' ? 'Проекты' : 'Разработчики'}
                </motion.button>
              ))}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link href="/auth/signin" className={styles.headerLinkSignIn}>Войти</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
                <Link href="/auth/signup" className={styles.headerButtonPrimary}>Регистрация</Link>
              </motion.div>
            </nav>
          </div>
        </motion.header>

        {/* Главная страница */}
        {currentPage === 'home' && (
          <motion.div
            key="home"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -80, filter: 'blur(10px)' }}
            variants={fadeIn}
          >
            <motion.main className={styles.hero} variants={fadeInUp}>
              {/* Парящие иконки */}
              <div className={styles.floatingIcons}>
                {floatingIcons.map((item, i) => (
                  <motion.span
                    key={i}
                    className={styles.floatingIcon}
                    style={{ top: item.top, left: item.left, fontSize: `${item.size}rem` }}
                    animate={{
                      y: [0, -40, 0],
                      x: [0, 15, -15, 0],
                      rotate: [0, 25, -15, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      delay: item.delay,
                      ease: 'easeInOut',
                    }}
                  >
                    {item.icon}
                  </motion.span>
                ))}
              </div>

              {/* Частицы */}
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  style={{
                    position: 'absolute',
                    left: p.left,
                    bottom: '-10px',
                    width: p.size,
                    height: p.size,
                    borderRadius: '50%',
                    background: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`,
                    filter: 'blur(1px)',
                    zIndex: 0,
                  }}
                  animate={{
                    y: ['110vh', '-10vh'],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                    ease: 'linear',
                  }}
                />
              ))}

              <div className={styles.heroContent}>
                <motion.h1
                  className={styles.heroTitle}
                  initial={{ opacity: 0, scale: 0.8, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
                >
                  {typedTitle}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                    style={{ color: '#58a6ff', marginLeft: '0.1em' }}
                  >
                    |
                  </motion.span>
                </motion.h1>
                <motion.p 
                  className={styles.heroSubtitle}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                >
                  DevPortal — платформа, где разработчики показывают проекты, а работодатели находят таланты. Твой код говорит сам за себя.
                </motion.p>
                <motion.div 
                  className={styles.ctaButtons}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  <motion.div whileHover={{ scale: 1.08, y: -5 }} whileTap={{ scale: 0.9 }}>
                    <Link href="/auth/signup" className={styles.ctaButtonPrimary}>Начать как разработчик</Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.08, y: -5 }} whileTap={{ scale: 0.9 }}>
                    <Link href="/auth/signup?role=employer" className={styles.ctaButtonSecondary}>Я работодатель</Link>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className={styles.divider}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <span className={styles.dividerLine}></span>
                </motion.div>
                
                <motion.div 
                  className={styles.stats}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    { number: projects.length.toString() + '+', label: 'Проектов' },
                    { number: developers.length.toString() + '+', label: 'Разработчиков' },
                    { number: '45+', label: 'Компаний' }
                  ].map((stat, index) => (
                    <motion.div 
                      key={index}
                      className={styles.statItem}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.1, y: -8 }}
                    >
                      <motion.span 
                        className={styles.statNumber}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.12, type: "spring", stiffness: 200 }}
                      >
                        {stat.number}
                      </motion.span>
                      <span className={styles.statLabel}>{stat.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                className={styles.heroGlow}
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 120, 0],
                  opacity: [0.15, 0.45, 0.15],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.main>

            <motion.section 
              className={styles.howItWorks}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2 
                className={styles.sectionTitle}
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Как это работает
              </motion.h2>
              <motion.div 
                className={styles.stepsGrid}
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { num: '1', title: 'Создайте профиль', desc: 'Зарегистрируйтесь как разработчик или работодатель. Заполните информацию о себе или компании.' },
                  { num: '2', title: 'Публикуйте проекты', desc: 'Разработчики добавляют свои проекты с описанием, технологиями и ссылками на код.' },
                  { num: '3', title: 'Находите друг друга', desc: 'Работодатели просматривают портфолио, связываются с разработчиками и приглашают на собеседования.' }
                ].map((step, idx) => (
                  <motion.div 
                    key={idx}
                    className={styles.stepCard}
                    variants={fadeInUp}
                    whileHover={{ y: -15, scale: 1.05, boxShadow: '0 15px 50px rgba(88, 166, 255, 0.2)' }}
                  >
                    <motion.div 
                      className={styles.stepNumber}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, delay: idx * 0.15 }}
                    >
                      {step.num}
                    </motion.div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          </motion.div>
        )}

        {/* Вкладка Проекты */}
        {currentPage === 'projects' && (
          <motion.section 
            key="projects"
            className={styles.pageSection}
            initial={{ opacity: 0, x: -80, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: 80, rotateY: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div 
              className={styles.pageHeader}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.h2 className={styles.pageTitle}>
                Все проекты 
                <motion.span 
                  className={styles.countBadge}
                  initial={{ scale: 0, rotate: -360 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  {projects.length}
                </motion.span>
              </motion.h2>
              <p className={styles.pageSubtitle}>Портфолио разработчиков платформы</p>
            </motion.div>

            {loading && projects.length === 0 ? (
              <motion.div 
                className={styles.projectsGrid}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {[1,2,3,4,5,6].map(i => (
                  <motion.div key={i} className={styles.projectCard} variants={fadeInUp}>
                    <div className={styles.projectCardBody}>
                      <motion.div 
                        className={styles.skeletonLine} 
                        style={{ width: '50%', height: '20px', marginBottom: '12px', background: '#21262d', borderRadius: '4px' }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                      <div className={styles.skeletonLine} style={{ width: '100%', height: '14px', marginBottom: '8px', background: '#21262d', borderRadius: '4px' }} />
                      <div className={styles.skeletonLine} style={{ width: '70%', height: '14px', marginBottom: '16px', background: '#21262d', borderRadius: '4px' }} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : projects.length === 0 ? (
              <motion.div 
                className={styles.emptyState}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                <h3 className={styles.emptyTitle}>Пока нет проектов</h3>
                <p className={styles.emptyText}>Разработчики ещё не добавили свои работы. Станьте первым!</p>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link href="/auth/signup" className={styles.createButton}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"/></svg>
                    Создать проект
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                className={styles.projectsGrid}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {projects.map((project, idx) => (
                  <motion.div 
                    key={project.id} 
                    className={styles.projectCard}
                    variants={fadeInUp}
                    whileHover={cardHover}
                    custom={idx}
                  >
                    <div className={styles.projectCardAccent}></div>
                    <div className={styles.projectCardBody}>
                      <div className={styles.projectCardHeader}>
                        <motion.div 
                          className={styles.projectIcon}
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.6 }}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                          </svg>
                        </motion.div>
                        <div className={styles.projectTitleBlock}>
                          <h3 className={styles.projectCardTitle}>{project.title}</h3>
                          {project.author && (
                            <p className={styles.projectAuthor}>{project.author.name}</p>
                          )}
                        </div>
                      </div>
                      
                      <p className={styles.projectCardDescription}>
                        {project.description || 'Описание отсутствует'}
                      </p>

                      {project.techStack && parseTechStack(project.techStack).length > 0 && (
                        <div className={styles.techStack}>
                          {parseTechStack(project.techStack).map((tech: string) => (
                            <motion.span 
                              key={tech} 
                              className={styles.techBadge}
                              whileHover={{ scale: 1.15, backgroundColor: '#58a6ff', color: 'white' }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      )}

                      <div className={styles.projectCardFooter}>
                        <div className={styles.projectLinks}>
                          {project.repoUrl && (
                            <motion.a 
                              href={project.repoUrl} target="_blank" rel="noopener noreferrer" 
                              className={styles.projectLink}
                              whileHover={{ scale: 1.1, x: 5 }}
                            >
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 .88.01 1.52.01 1.72 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                              </svg>
                              <span>Код</span>
                            </motion.a>
                          )}
                          {project.demoUrl && (
                            <motion.a 
                              href={project.demoUrl} target="_blank" rel="noopener noreferrer" 
                              className={styles.projectLink}
                              whileHover={{ scale: 1.1, x: 5 }}
                            >
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path fillRule="evenodd" d="M10.5 1a.5.5 0 01.5.5V2h1.5a2 2 0 012 2v9a2 2 0 01-2 2h-9a2 2 0 01-2-2V4a2 2 0 012-2H5v-.5a.5.5 0 011 0V2h4v-.5a.5.5 0 01.5-.5z"/>
                              </svg>
                              <span>Демо</span>
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.section>
        )}

        {/* Вкладка Разработчики */}
        {currentPage === 'developers' && (
          <motion.section 
            key="developers"
            className={styles.pageSection}
            initial={{ opacity: 0, x: 80, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -80, rotateY: 10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div 
              className={styles.pageHeader}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.h2 className={styles.pageTitle}>
                Все разработчики 
                <motion.span 
                  className={styles.countBadge}
                  initial={{ scale: 0, rotate: -360 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  {developers.length}
                </motion.span>
              </motion.h2>
              <p className={styles.pageSubtitle}>Талантливые специалисты на платформе</p>
            </motion.div>

            {loading && developers.length === 0 ? (
              <motion.div 
                className={styles.developersGrid}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {[1,2,3,4].map(i => (
                  <motion.div key={i} className={styles.developerCard} variants={fadeInUp}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <motion.div 
                        style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#21262d' }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                      <div style={{ flex: 1 }}>
                        <div className={styles.skeletonLine} style={{ width: '50%', height: '16px', marginBottom: '6px', background: '#21262d', borderRadius: '4px' }} />
                        <div className={styles.skeletonLine} style={{ width: '35%', height: '12px', background: '#21262d', borderRadius: '4px' }} />
                      </div>
                    </div>
                    <div className={styles.skeletonLine} style={{ width: '100%', height: '14px', background: '#21262d', borderRadius: '4px' }} />
                  </motion.div>
                ))}
              </motion.div>
            ) : developers.length === 0 ? (
              <motion.div 
                className={styles.emptyState}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                <h3 className={styles.emptyTitle}>Нет разработчиков</h3>
                <p className={styles.emptyText}>На платформе пока нет зарегистрированных разработчиков</p>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link href="/auth/signup" className={styles.createButton}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"/></svg>
                    Стать разработчиком
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                className={styles.developersGrid}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {developers.map((dev, idx) => (
                  <motion.div 
                    key={dev.id} 
                    className={styles.developerCard}
                    variants={fadeInUp}
                    whileHover={cardHover}
                    custom={idx}
                  >
                    <div className={styles.developerHeader}>
                      <motion.div 
                        className={styles.developerAvatar}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        {dev.name?.charAt(0)?.toUpperCase() || '?'}
                      </motion.div>
                      <div className={styles.developerHeaderInfo}>
                        <h3 className={styles.developerName}>{dev.name || 'Без имени'}</h3>
                        <p className={styles.developerTitle}>{dev.profile?.title || 'Разработчик'}</p>
                        {dev.profile?.location && (
                          <p className={styles.developerLocation}>
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                              <path fillRule="evenodd" d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"/>
                            </svg>
                            {dev.profile.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {dev.profile?.bio && (
                      <motion.p 
                        className={styles.developerBioText}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        {dev.profile.bio.length > 150 ? dev.profile.bio.substring(0, 150) + '...' : dev.profile.bio}
                      </motion.p>
                    )}

                    {(dev.profile?.githubUrl || dev.profile?.linkedinUrl || dev.profile?.website) && (
                      <div className={styles.developerLinksRow}>
                        {dev.profile.githubUrl && (
                          <motion.a 
                            href={dev.profile.githubUrl} target="_blank" rel="noopener noreferrer" 
                            className={styles.devLink}
                            whileHover={{ scale: 1.1, y: -3 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 .88.01 1.52.01 1.72 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                            GitHub
                          </motion.a>
                        )}
                        {dev.profile.linkedinUrl && (
                          <motion.a 
                            href={dev.profile.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                            className={styles.devLink}
                            whileHover={{ scale: 1.1, y: -3 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
                            LinkedIn
                          </motion.a>
                        )}
                        {dev.profile.website && (
                          <motion.a 
                            href={dev.profile.website} target="_blank" rel="noopener noreferrer" 
                            className={styles.devLink}
                            whileHover={{ scale: 1.1, y: -3 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M3.75 2h3.5a.75.75 0 010 1.5h-3.5a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25v-3.5a.75.75 0 011.5 0v3.5A1.75 1.75 0 0112.25 14h-8.5A1.75 1.75 0 012 12.25v-8.5C2 2.784 2.784 2 3.75 2zm6.854-1h4.146a.25.25 0 01.25.25v4.146a.25.25 0 01-.427.177L13.03 4.03 9.28 7.78a.751.751 0 01-1.042-.018.751.751 0 01-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0110.604 1z"/></svg>
                            Сайт
                          </motion.a>
                        )}
                      </div>
                    )}

                    <div className={styles.developerCardFooter}>
                      <motion.div whileHover={{ scale: 1.08 }} whileTap={buttonTap}>
                        <Link href={`/auth/signin`} className={styles.viewProfileLink}>
                          Связаться
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.section>
        )}

        {/* Футер */}
        <motion.footer 
          className={styles.footer}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.footerContent}>
            <div className={styles.footerTop}>
              <motion.div 
                className={styles.footerBrand}
                whileHover={{ scale: 1.08, y: -5 }}
              >
                <motion.svg 
                  height="24" viewBox="0 0 24 24" width="24"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <path fill="#8b949e" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  <path fill="#f97316" d="M11.5 3.5c-1.5 0-3 .5-4 1.5l-.5.5c-1 1-1.5 2.5-1.5 4v.5l1-1c.5-.5 1.5-1 2.5-1s2 .5 2.5 1l1 1v-.5c0-1.5-.5-3-1.5-4l-.5-.5c-1-1-2.5-1.5-4-1.5z"/>
                </motion.svg>
                <span>DevPortal</span>
              </motion.div>
              <div className={styles.footerLinks}>
                {['projects', 'developers'].map((page) => (
                  <motion.button 
                    key={page}
                    onClick={() => navigateTo(page as Page)}
                    whileHover={{ scale: 1.15, color: '#58a6ff' }}
                  >
                    {page === 'projects' ? 'Проекты' : 'Разработчики'}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className={styles.footerBottom}>
              <motion.p 
                className={styles.copyright}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                © {new Date().getFullYear()} DevPortal. Создано Кострыгина Виктория ИС-24
              </motion.p>
            </div>
          </div>
        </motion.footer>
      </div>
    </AnimatePresence>
  )
}