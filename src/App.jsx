import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion'

// Utility for tailwind class merging
const cn = (...classes) => classes.filter(Boolean).join(' ')

// Data Logs Component - Technical metadata scattered in corners
const DataLogs = () => {
  const [logs, setLogs] = useState({
    topLeft: { coords: '45.5231° N, 122.6765° W', hash: '0x7f8a9b', latency: '12ms' },
    topRight: { coords: '51.5074° N, 0.1278° W', hash: '0x3c4d5e', latency: '8ms' },
    bottomLeft: { coords: '35.6762° N, 139.6503° E', hash: '0x9a8b7c', latency: '24ms' },
    bottomRight: { coords: '40.7128° N, 74.0060° W', hash: '0x1f2e3d', latency: '16ms' }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => ({
        topLeft: { ...prev.topLeft, hash: '0x' + Math.random().toString(16).substr(2, 6), latency: Math.floor(Math.random() * 30) + 'ms' },
        topRight: { ...prev.topRight, hash: '0x' + Math.random().toString(16).substr(2, 6), latency: Math.floor(Math.random() * 30) + 'ms' },
        bottomLeft: { ...prev.bottomLeft, hash: '0x' + Math.random().toString(16).substr(2, 6), latency: Math.floor(Math.random() * 30) + 'ms' },
        bottomRight: { ...prev.bottomRight, hash: '0x' + Math.random().toString(16).substr(2, 6), latency: Math.floor(Math.random() * 30) + 'ms' }
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="fixed top-6 left-6 z-50 mono-text hidden md:block">
        <div className="text-cyan-400">LOC: {logs.topLeft.coords}</div>
        <div className="text-gray-500">HASH: {logs.topLeft.hash}</div>
        <div className="text-gray-600">LAT: {logs.topLeft.latency}</div>
      </div>
      <div className="fixed top-6 right-6 z-50 mono-text text-right hidden md:block">
        <div className="text-cyan-400">LOC: {logs.topRight.coords}</div>
        <div className="text-gray-500">HASH: {logs.topRight.hash}</div>
        <div className="text-gray-600">LAT: {logs.topRight.latency}</div>
      </div>
      <div className="fixed bottom-6 left-6 z-50 mono-text hidden md:block">
        <div className="text-cyan-400">LOC: {logs.bottomLeft.coords}</div>
        <div className="text-gray-500">HASH: {logs.bottomLeft.hash}</div>
        <div className="text-gray-600">LAT: {logs.bottomLeft.latency}</div>
      </div>
      <div className="fixed bottom-6 right-6 z-50 mono-text text-right hidden md:block">
        <div className="text-cyan-400">LOC: {logs.bottomRight.coords}</div>
        <div className="text-gray-500">HASH: {logs.bottomRight.hash}</div>
        <div className="text-gray-600">LAT: {logs.bottomRight.latency}</div>
      </div>
    </>
  )
}

// Custom Neural Cursor with Magnetic Effect
const NeuralCursor = () => {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const springConfig = { damping: 25, stiffness: 400 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  const outerRingX = useSpring(cursorX, { damping: 20, stiffness: 100 })
  const outerRingY = useSpring(cursorY, { damping: 20, stiffness: 100 })

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setCoords({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'A') {
        setIsHovering(true)
      }
    }

    const handleMouseOut = () => {
      setIsHovering(false)
    }

    window.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [cursorX, cursorY, isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main crosshair */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[10000]"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: '-50%',
              translateY: '-50%'
            }}
          >
            <div className="relative">
              <div className="w-4 h-4 border border-cyan-400 rounded-full" />
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-8 h-px bg-cyan-400/50 -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-px h-8 bg-cyan-400/50 -translate-x-1/2 -translate-y-1/2" />

              {/* Coordinates display */}
              <div className="absolute top-6 left-6 mono-text text-cyan-400 whitespace-nowrap">
                <div>X: {coords.x.toString().padStart(4, '0')} Y: {coords.y.toString().padStart(4, '0')}</div>
                <div className="text-[8px] animate-pulse">SCANNING...</div>
              </div>
            </div>
          </motion.div>

          {/* Magnetic outer ring */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{
              x: outerRingX,
              y: outerRingY,
              translateX: '-50%',
              translateY: '-50%'
            }}
          >
            <motion.div
              animate={{
                scale: isHovering ? 2 : 1,
                rotate: isHovering ? 180 : 0,
                borderColor: isHovering ? 'rgba(0, 255, 255, 0.8)' : 'rgba(0, 255, 255, 0.3)'
              }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 border rounded-full"
              style={{
                borderStyle: isHovering ? 'solid' : 'dashed'
              }}
            />
          </motion.div>

          {/* Glitch trail effect */}
          {isHovering && (
            <motion.div
              className="fixed top-0 left-0 pointer-events-none z-[9998]"
              style={{
                x: cursorX,
                y: cursorY,
                translateX: '-50%',
                translateY: '-50%'
              }}
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 border border-red-500/50 rounded-full" />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

// Liquid Obsidian Monolith with Canvas-based distortion
const LiquidMonolith = ({ scrollProgress }) => {
  const canvasRef = useRef(null)
  const [isFragmenting, setIsFragmenting] = useState(false)
  const mouseRef = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)

    const draw = () => {
      if (scrollProgress > 0.3) {
        setIsFragmenting(true)
        return
      }
      setIsFragmenting(false)

      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const time = timeRef.current

      ctx.clearRect(0, 0, width, height)

      // Create liquid obsidian effect
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#0a0a0a')
      gradient.addColorStop(0.5, '#000000')
      gradient.addColorStop(1, '#1a1a1a')

      ctx.fillStyle = gradient

      // Draw monolith with distortion
      ctx.beginPath()
      const segments = 20
      const mouse = mouseRef.current

      for (let i = 0; i <= segments; i++) {
        const x = (width / segments) * i
        const yBase = height * 0.1
        const yHeight = height * 0.8

        // Calculate distortion based on mouse proximity
        const distX = x - mouse.x
        const distY = yBase + yHeight / 2 - mouse.y
        const dist = Math.sqrt(distX * distX + distY * distY)
        const maxDist = 150
        const distortion = Math.max(0, 1 - dist / maxDist) * 30

        const wave = Math.sin(time * 0.002 + i * 0.5) * 5
        const dent = distortion * Math.sin(time * 0.01)

        if (i === 0) {
          ctx.moveTo(x + wave - dent, yBase)
        } else {
          ctx.lineTo(x + wave - dent, yBase)
        }
      }

      for (let i = segments; i >= 0; i--) {
        const x = (width / segments) * i
        const yBase = height * 0.9

        const distX = x - mouse.x
        const distY = yBase - mouse.y
        const dist = Math.sqrt(distX * distX + distY * distY)
        const maxDist = 150
        const distortion = Math.max(0, 1 - dist / maxDist) * 30

        const wave = Math.sin(time * 0.002 + i * 0.5) * 5
        const dent = distortion * Math.sin(time * 0.01)

        ctx.lineTo(x + wave - dent, yBase)
      }

      ctx.closePath()
      ctx.fill()

      // Add silver iridescent veins
      ctx.strokeStyle = 'rgba(192, 192, 192, 0.3)'
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(width * 0.2 + i * width * 0.15, height * 0.2)
        ctx.lineTo(width * 0.25 + i * width * 0.15 + Math.sin(time * 0.001) * 20, height * 0.8)
        ctx.stroke()
      }

      // Chrome reflection highlight
      const highlightGrad = ctx.createLinearGradient(0, 0, width, 0)
      highlightGrad.addColorStop(0, 'transparent')
      highlightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)')
      highlightGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = highlightGrad
      ctx.fill()

      timeRef.current += 16
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [scrollProgress])

  // Fragmentation shards
  const shards = Array.from({ length: 64 }, (_, i) => ({
    id: i,
    x: (i % 8) * 12.5,
    y: Math.floor(i / 8) * 12.5,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.2
  }))

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className={cn(
          "w-64 h-96 md:w-80 md:h-[500px] transition-opacity duration-500",
          isFragmenting ? "opacity-0" : "opacity-100"
        )}
      />

      {/* Fragmentation effect */}
      <AnimatePresence>
        {isFragmenting && (
          <div className="absolute inset-0 flex items-center justify-center">
            {shards.map((shard) => (
              <motion.div
                key={shard.id}
                className="shard w-8 h-8 md:w-12 md:h-12"
                initial={{
                  x: 0,
                  y: 0,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  rotate: shard.rotation + 360,
                  opacity: 0
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: shard.delay,
                  ease: [0.23, 1, 0.32, 1]
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Shatter Reveal Text Animation
const ShatterReveal = ({ children, delay = 0, className }) => {
  const [isRevealed, setIsRevealed] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsRevealed(true), delay)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
        animate={{
          clipPath: isRevealed
            ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            : 'polygon(0 0, 0 0, 0 100%, 0 100%)'
        }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-cyan-400"
        initial={{ x: '-100%' }}
        animate={{ x: isRevealed ? '100%' : '-100%' }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.77, 0, 0.175, 1] }}
      />
    </div>
  )
}

// The Vault - 3D Origami Animation
const Vault = () => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsOpen(true)
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="vault-3d relative w-full max-w-md mx-auto h-96 perspective-1000">
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isOpen ? 180 : 0 }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Front face - Safe door */}
        <div className="vault-face absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 flex items-center justify-center backface-hidden">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full border-4 border-cyan-400/30 flex items-center justify-center mb-4 mx-auto">
              <div className="w-24 h-24 rounded-full border-2 border-cyan-400/50 flex items-center justify-center">
                <SafeIcon name="lock" size={32} className="text-cyan-400" />
              </div>
            </div>
            <div className="mono-text text-gray-500">SECURE VAULT</div>
          </div>
        </div>

        {/* Back face - Dashboard */}
        <div
          className="vault-face absolute inset-0 bg-charcoal rounded-2xl border border-gray-800 p-6 backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xl font-bold tracking-wider">DASHBOARD</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="mono-text text-green-500">LIVE</span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="glass-card rounded-lg p-4">
                <div className="mono-text text-gray-500 mb-1">BALANCE</div>
                <div className="text-3xl font-bold text-cyan-400">$2,847,293.00</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-lg p-3">
                  <div className="mono-text text-gray-500 text-[8px]">ASSETS</div>
                  <div className="text-lg font-bold">14</div>
                </div>
                <div className="glass-card rounded-lg p-3">
                  <div className="mono-text text-gray-500 text-[8px]">YIELD</div>
                  <div className="text-lg font-bold text-green-400">+12.4%</div>
                </div>
              </div>

              <div className="glass-card rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="mono-text text-gray-500 text-[8px]">LAST TRANSACTION</div>
                  <div className="text-sm">Wire Transfer</div>
                </div>
                <div className="mono-text text-cyan-400">-$50,000</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Live Analytics with SVG Waves
const LiveAnalytics = () => {
  return (
    <div className="relative w-full h-48 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Multiple wave layers */}
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            fill="none"
            stroke="#00ffff"
            strokeWidth="1"
            strokeOpacity={0.3 - i * 0.1}
            d=""
            animate={{
              d: [
                `M0,${50 + i * 20} Q${100},${20 + i * 20} ${200},${50 + i * 20} T${400},${50 + i * 20} T${600},${50 + i * 20} T${800},${50 + i * 20}`,
                `M0,${50 + i * 20} Q${100},${80 + i * 20} ${200},${50 + i * 20} T${400},${50 + i * 20} T${600},${50 + i * 20} T${800},${50 + i * 20}`,
                `M0,${50 + i * 20} Q${100},${20 + i * 20} ${200},${50 + i * 20} T${400},${50 + i * 20} T${600},${50 + i * 20} T${800},${50 + i * 20}`
              ]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Filled area */}
        <motion.path
          fill="url(#waveGradient)"
          d=""
          animate={{
            d: [
              "M0,100 Q100,50 200,100 T400,100 T600,100 T800,100 L800,200 L0,200 Z",
              "M0,100 Q100,150 200,100 T400,100 T600,100 T800,100 L800,200 L0,200 Z",
              "M0,100 Q100,50 200,100 T400,100 T600,100 T800,100 L800,200 L0,200 Z"
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>

      {/* Data points */}
      <div className="absolute inset-0 flex items-end justify-around pb-4">
        {[65, 82, 45, 90, 55, 78, 62, 88].map((height, i) => (
          <motion.div
            key={i}
            className="w-8 bg-cyan-400/20 rounded-t"
            animate={{ height: [`${height}%`, `${100 - height}%`, `${height}%`] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  )
}

// Glassmorphism Card with 3D Tilt
const GlassCard = ({ title, description, icon, className }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * 20, y: -x * 20 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn("glass-card metal-edge rounded-2xl p-6 md:p-8", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-cyan-400/10 rounded-lg">
          <SafeIcon name={icon} size={24} className="text-cyan-400" />
        </div>
        <div className="mono-text text-[8px] text-gray-500">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
      </div>
      <h3 className="text-xl font-bold mb-2 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

      {/* Brushed metal edge effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  )
}

// Main App Component
function App() {
  const { scrollYProgress } = useScroll()
  const [headerVisible, setHeaderVisible] = useState(false)
  const [clickGlitch, setClickGlitch] = useState(false)

  // Kinetic typography weight based on scroll
  const fontWeight = useTransform(scrollYProgress, [0, 0.5], [100, 900])

  // Screen shake on click
  const handleClick = () => {
    setClickGlitch(true)
    setTimeout(() => setClickGlitch(false), 300)
  }

  useEffect(() => {
    const handleScroll = () => {
      setHeaderVisible(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn("min-h-screen bg-black transition-transform", clickGlitch && "animate-glitch")}
      onClick={handleClick}
    >
      {/* Atmosphere effects */}
      <div className="film-grain" />
      <div className="scanlines" />
      <div className="scanline-bar" />
      <div className="chromatic-aberration" />

      {/* Data Logs */}
      <DataLogs />

      {/* Custom Cursor */}
      <NeuralCursor />

      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-900"
        initial={{ y: -100 }}
        animate={{ y: headerVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-cyan-400 flex items-center justify-center">
              <div className="w-4 h-4 bg-cyan-400" />
            </div>
            <span className="text-xl font-bold tracking-widest">NEO-AXIS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {['PROTOCOL', 'VAULT', 'ANALYTICS', 'ACCESS'].map((item) => (
              <button
                key={item}
                className="mono-text text-[10px] text-gray-400 hover:text-cyan-400 transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>
          <button className="px-6 py-2 border border-cyan-400 text-cyan-400 mono-text text-[10px] hover:bg-cyan-400 hover:text-black transition-all">
            CONNECT
          </button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="mono-text text-cyan-400 mb-4 text-[10px] tracking-[0.3em]">
                SYSTEM v2.0.84 // ONLINE
              </div>

              <ShatterReveal delay={300}>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter mb-6 text-stretch">
                  <span className="block text-white">NEO</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-800">AXIS</span>
                </h1>
              </ShatterReveal>

              <ShatterReveal delay={500}>
                <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-lg leading-relaxed">
                  The next-generation financial protocol.
                  <span className="text-cyan-400"> Secure. Anonymous. Limitless.</span>
                </p>
              </ShatterReveal>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <button className="group relative px-8 py-4 bg-cyan-400 text-black font-bold tracking-wider overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    INITIATE
                    <SafeIcon name="arrow-right" size={16} />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
                <button className="px-8 py-4 border border-gray-700 text-gray-300 font-bold tracking-wider hover:border-cyan-400 hover:text-cyan-400 transition-colors">
                  MANIFESTO
                </button>
              </motion.div>
            </motion.div>
          </div>

          <div className="relative order-1 md:order-2 h-[500px] md:h-[600px]">
            <LiquidMonolith scrollProgress={scrollYProgress.get()} />

            {/* Floating elements */}
            <motion.div
              className="absolute top-10 right-10 mono-text text-[8px] text-cyan-400/50"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              [MONOLITH_ACTIVE]
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 mono-text text-[10px] text-gray-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span>SCROLL TO FRAGMENT</span>
            <motion.div
              className="w-px h-8 bg-gradient-to-b from-cyan-400 to-transparent"
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Vault Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />

        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <ShatterReveal>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                  THE <span className="text-cyan-400">VAULT</span>
                </h2>
              </ShatterReveal>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Military-grade encryption meets institutional liquidity.
                Your assets, secured by quantum-resistant protocols and
                distributed across the neo-banking mesh.
              </p>

              <div className="space-y-4">
                {[
                  { label: 'Encryption', value: 'AES-4096' },
                  { label: 'Uptime', value: '99.999%' },
                  { label: 'Latency', value: '<0.4ms' }
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-3 border-b border-gray-800">
                    <span className="mono-text text-gray-500 text-[10px]">{stat.label}</span>
                    <span className="text-cyan-400 font-mono">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <Vault />
          </div>
        </div>
      </section>

      {/* Live Analytics Section */}
      <section className="py-32 px-6 bg-charcoal relative">
        <div className="container mx-auto">
          <div className="mb-16">
            <ShatterReveal>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                LIVE <span className="text-cyan-400">ANALYTICS</span>
              </h2>
            </ShatterReveal>
            <p className="text-gray-400 mono-text text-[10px] tracking-widest">
              REAL-TIME SONAR PING // GLOBAL NETWORK STATUS
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 md:p-12">
            <LiveAnalytics />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 pt-8 border-t border-gray-800">
              {[
                { label: 'TRANSACTIONS', value: '2.4M', change: '+12%' },
                { label: 'VOLUME', value: '$847B', change: '+8%' },
                { label: 'NODES', value: '14,892', change: '+24' },
                { label: 'SECURITY', value: '100%', change: 'OPTIMAL' }
              ].map((metric) => (
                <div key={metric.label} className="text-center">
                  <div className="mono-text text-[8px] text-gray-500 mb-2">{metric.label}</div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-green-400 text-sm">{metric.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <ShatterReveal>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                PROTOCOL <span className="text-cyan-400">FEATURES</span>
              </h2>
            </ShatterReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
            <GlassCard
              title="Quantum Ledger"
              description="Immutable transaction history secured by quantum-resistant cryptographic proofs."
              icon="shield"
              className="md:col-span-2 md:row-span-2"
            />
            <GlassCard
              title="Neural Routing"
              description="AI-optimized payment paths for zero-latency transfers."
              icon="zap"
            />
            <GlassCard
              title="Ghost Accounts"
              description="Anonymous sub-accounts with disposable identifiers."
              icon="eye-off"
            />
            <GlassCard
              title="Flash Loans"
              description="Uncollateralized liquidity for arbitrage opportunities."
              icon="bolt"
              className="md:col-span-2"
            />
            <GlassCard
              title="Cold Storage"
              description="Air-gapped asset protection with biometric access."
              icon="snowflake"
            />
          </div>
        </div>
      </section>

      {/* Credit Card Reformation */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="container mx-auto text-center">
          <ShatterReveal>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-16">
              THE <span className="text-cyan-400">ARTIFACT</span>
            </h2>
          </ShatterReveal>

          <motion.div
            className="relative max-w-md mx-auto"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            {/* Credit Card */}
            <div className="relative aspect-[1.586/1] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 p-8 shadow-2xl">
              {/* Holographic effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 via-transparent to-purple-500/10 opacity-50" />

              {/* Card content */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="mono-text text-[10px] text-gray-500">NEO-AXIS</div>
                  <SafeIcon name="wifi" size={24} className="text-gray-400 rotate-90" />
                </div>

                <div>
                  <div className="flex gap-4 mb-6">
                    <div className="w-12 h-8 bg-yellow-600/80 rounded" />
                    <div className="mono-text text-gray-400 text-sm tracking-widest self-center">
                      **** **** **** 8492
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <div className="mono-text text-[8px] text-gray-500 mb-1">CARDHOLDER</div>
                      <div className="text-sm tracking-widest">PROTOCOL USER</div>
                    </div>
                    <div className="text-right">
                      <div className="mono-text text-[8px] text-gray-500 mb-1">EXPIRES</div>
                      <div className="text-sm tracking-widest">12/28</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 credit-card-shine"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
            </div>

            <div className="mt-8 mono-text text-[10px] text-gray-500">
              SECURE CHIP ENABLED // CONTACTLESS // BIOMETRIC
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-t from-gray-950 to-black">
        <div className="container mx-auto text-center">
          <ShatterReveal>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8">
              JOIN THE <span className="text-cyan-400">PROTOCOL</span>
            </h2>
          </ShatterReveal>

          <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
            Experience the future of decentralized finance.
            Anonymous. Secure. Unstoppable.
          </p>

          <motion.button
            className="group relative px-12 py-6 bg-cyan-400 text-black font-bold text-lg tracking-widest overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-3">
              INITIALIZE ACCESS
              <SafeIcon name="arrow-right" size={20} />
            </span>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <div className="mt-8 mono-text text-[10px] text-gray-600">
            BY ACCESSING YOU AGREE TO THE TERMS OF THE PROTOCOL
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-900">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border border-cyan-400 flex items-center justify-center">
                <div className="w-3 h-3 bg-cyan-400" />
              </div>
              <span className="text-lg font-bold tracking-widest">NEO-AXIS</span>
            </div>

            <div className="flex gap-8">
              {['PRIVACY', 'TERMS', 'DOCS', 'STATUS'].map((link) => (
                <button key={link} className="mono-text text-[10px] text-gray-500 hover:text-cyan-400 transition-colors">
                  {link}
                </button>
              ))}
            </div>

            <div className="mono-text text-[10px] text-gray-600">
              © 2024 NEO-AXIS PROTOCOL
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App