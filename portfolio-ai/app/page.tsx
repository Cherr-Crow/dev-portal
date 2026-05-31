'use client'

import { useState, useEffect } from 'react'
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

// Анимационные варианты с правильными типами
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
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
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const cardHover = {
  scale: 1.02,
  transition: { type: "spring" as const, stiffness: 300, damping: 20 }
}

const buttonTap = {
  scale: 0.95,
  transition: { type: "spring" as const, stiffness: 400, damping: 10 }
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [projects, setProjects] = useState<Project[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      const list = data.projects || data || []
      setProjects(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('Ошибка загрузки проектов:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDevelopers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/developers')
      const data = await res.json()
      const list = data.developers || data || []
      setDevelopers(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('Ошибка загрузки разработчиков:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentPage === 'projects') fetchProjects()
    if (currentPage === 'developers') fetchDevelopers()
  }, [currentPage])

  const parseTechStack = (techStack: string): string[] => {
    try { return JSON.parse(techStack) }
    catch { return [] }
  }

  const navigateTo = (page: Page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence mode="wait">
      <div className={styles.landing}>
     
        {/* Хедер с анимацией */}
        <motion.header 
          className={styles.header}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <motion.div 
                onClick={() => navigateTo('home')} 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg height="32" viewBox="0 0 24 24" width="32" className={styles.logo}>
                  <motion.path 
                    fill="#c9d1d9" 
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                  <path fill="#f97316" d="M11.5 3.5c-1.5 0-3 .5-4 1.5l-.5.5c-1 1-1.5 2.5-1.5 4v.5l1-1c.5-.5 1.5-1 2.5-1s2 .5 2.5 1l1 1v-.5c0-1.5-.5-3-1.5-4l-.5-.5c-1-1-2.5-1.5-4-1.5z"/>
                  <circle fill="#c9d1d9" cx="9" cy="8" r="1"/>
                  <circle fill="#c9d1d9" cx="14" cy="8" r="1"/>
                  <path fill="none" stroke="#c9d1d9" strokeWidth="1.5" strokeLinecap="round" d="M8 12c0 0 1.5 2 4 2s4-2 4-2"/>
                </svg>
                <span className={styles.headerBrand}>DevPortal</span>
              </motion.div>
            </div>
            <nav className={styles.headerNav}>
              {['projects', 'developers'].map((page) => (
                <motion.button
                  key={page}
                  onClick={() => navigateTo(page as Page)}
                  className={`${styles.headerLinkBtn} ${currentPage === page ? styles.headerLinkActive : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    color: currentPage === page ? '#58a6ff' : '#8b949e',
                    borderBottomColor: currentPage === page ? '#58a6ff' : 'transparent'
                  }}
                >
                  {page === 'projects' ? 'Проекты' : 'Разработчики'}
                </motion.button>
              ))}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/signin" className={styles.headerLinkSignIn}>Войти</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/signup" className={styles.headerButtonPrimary}>Регистрация</Link>
              </motion.div>
            </nav>
          </div>
        </motion.header>

        {/* Главная страница с анимациями */}
        {currentPage === 'home' && (
          <motion.div
            key="home"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -50 }}
            variants={fadeIn}
          >
            <motion.main 
              className={styles.hero}
              variants={fadeInUp}
            >
              <div className={styles.heroContent}>
                <motion.h1 
                  className={styles.heroTitle}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                >
                  Создавай. Публикуй. Находи.
                </motion.h1>
                <motion.p 
                  className={styles.heroSubtitle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  DevPortal — платформа, где разработчики показывают проекты, а работодатели находят таланты. Твой код говорит сам за себя.
                </motion.p>
                <motion.div 
                  className={styles.ctaButtons}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/auth/signup" className={styles.ctaButtonPrimary}>Начать как разработчик</Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/auth/signup?role=employer" className={styles.ctaButtonSecondary}>Я работодатель</Link>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className={styles.divider}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
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
                    { number: '250+', label: 'Проектов' },
                    { number: '180+', label: 'Разработчиков' },
                    { number: '45+', label: 'Компаний' }
                  ].map((stat, index) => (
                    <motion.div 
                      key={index}
                      className={styles.statItem}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <motion.span 
                        className={styles.statNumber}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + index * 0.1, type: "spring" }}
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
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.main>

            <motion.section 
              className={styles.howItWorks}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className={styles.sectionTitle}
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                    whileHover={{ y: -10, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
                  >
                    <motion.div 
                      className={styles.stepNumber}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: idx * 0.2 }}
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

        {/* Страница проектов с анимациями */}
        {currentPage === 'projects' && (
          <motion.section 
            key="projects"
            className={styles.pageSection}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div 
              className={styles.pageHeader}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.h2 className={styles.pageTitle}>
                <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                </svg>
                Все проекты 
                <motion.span 
                  className={styles.countBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  {projects.length}
                </motion.span>
              </motion.h2>
              <p className={styles.pageSubtitle}>Портфолио разработчиков платформы</p>
            </motion.div>

            {loading ? (
              <motion.div 
                className={styles.projectsGrid}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {[1,2,3,4,5,6].map(i => (
                  <motion.div 
                    key={i} 
                    className={styles.projectCard}
                    variants={fadeInUp}
                  >
                    <div className={styles.projectCardBody}>
                      <motion.div 
                        className={styles.skeletonLine} 
                        style={{ width: '50%', height: '20px', marginBottom: '12px', background: '#21262d', borderRadius: '4px' }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" }}
              >
                <motion.div 
                  className={styles.emptyIconWrapper}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#484f58" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </motion.div>
                <h3 className={styles.emptyTitle}>Пока нет проектов</h3>
                <p className={styles.emptyText}>Разработчики ещё не добавили свои работы. Станьте первым!</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
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
                              whileHover={{ scale: 1.05, backgroundColor: '#58a6ff', color: 'white' }}
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
                              whileHover={{ scale: 1.05, x: 2 }}
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
                              whileHover={{ scale: 1.05, x: 2 }}
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

        {/* Страница разработчиков с анимациями */}
        {currentPage === 'developers' && (
          <motion.section 
            key="developers"
            className={styles.pageSection}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div 
              className={styles.pageHeader}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.h2 className={styles.pageTitle}>
                <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5z"/>
                </svg>
                Все разработчики 
                <motion.span 
                  className={styles.countBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  {developers.length}
                </motion.span>
              </motion.h2>
              <p className={styles.pageSubtitle}>Талантливые специалисты на платформе</p>
            </motion.div>

            {loading ? (
              <motion.div 
                className={styles.developersGrid}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {[1,2,3,4].map(i => (
                  <motion.div 
                    key={i} 
                    className={styles.developerCard}
                    variants={fadeInUp}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <motion.div 
                        style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#21262d' }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" }}
              >
                <motion.div 
                  className={styles.emptyIconWrapper}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#484f58" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </motion.div>
                <h3 className={styles.emptyTitle}>Нет разработчиков</h3>
                <p className={styles.emptyText}>На платформе пока нет зарегистрированных разработчиков</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                        whileHover={{ scale: 1.1, rotate: 5 }}
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
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
                            whileHover={{ scale: 1.05, x: 2 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 .88.01 1.52.01 1.72 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                            GitHub
                          </motion.a>
                        )}
                        {dev.profile.linkedinUrl && (
                          <motion.a 
                            href={dev.profile.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                            className={styles.devLink}
                            whileHover={{ scale: 1.05, x: 2 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
                            LinkedIn
                          </motion.a>
                        )}
                        {dev.profile.website && (
                          <motion.a 
                            href={dev.profile.website} target="_blank" rel="noopener noreferrer" 
                            className={styles.devLink}
                            whileHover={{ scale: 1.05, x: 2 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M3.75 2h3.5a.75.75 0 010 1.5h-3.5a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25v-3.5a.75.75 0 011.5 0v3.5A1.75 1.75 0 0112.25 14h-8.5A1.75 1.75 0 012 12.25v-8.5C2 2.784 2.784 2 3.75 2zm6.854-1h4.146a.25.25 0 01.25.25v4.146a.25.25 0 01-.427.177L13.03 4.03 9.28 7.78a.751.751 0 01-1.042-.018.751.751 0 01-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0110.604 1z"/></svg>
                            Сайт
                          </motion.a>
                        )}
                      </div>
                    )}

                    <div className={styles.developerCardFooter}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={buttonTap}>
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

        {/* Футер с анимацией */}
        <motion.footer 
          className={styles.footer}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.footerContent}>
            <div className={styles.footerTop}>
              <motion.div 
                className={styles.footerBrand}
                whileHover={{ scale: 1.05 }}
              >
                <svg height="24" viewBox="0 0 24 24" width="24">
                  <path fill="#8b949e" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  <path fill="#f97316" d="M11.5 3.5c-1.5 0-3 .5-4 1.5l-.5.5c-1 1-1.5 2.5-1.5 4v.5l1-1c.5-.5 1.5-1 2.5-1s2 .5 2.5 1l1 1v-.5c0-1.5-.5-3-1.5-4l-.5-.5c-1-1-2.5-1.5-4-1.5z"/>
                  <circle fill="#8b949e" cx="9" cy="8" r="1"/><circle fill="#8b949e" cx="14" cy="8" r="1"/>
                  <path fill="none" stroke="#8b949e" strokeWidth="1.5" strokeLinecap="round" d="M8 12c0 0 1.5 2 4 2s4-2 4-2"/>
                </svg>
                <span>DevPortal</span>
              </motion.div>
              <div className={styles.footerLinks}>
                {['projects', 'developers'].map((page) => (
                  <motion.button 
                    key={page}
                    onClick={() => navigateTo(page as Page)}
                    whileHover={{ scale: 1.05, color: '#58a6ff' }}
                  >
                    {page === 'projects' ? 'Проекты' : 'Разработчики'}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className={styles.footerBottom}>
              <motion.p 
                className={styles.copyright}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
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