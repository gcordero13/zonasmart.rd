import { motion, useReducedMotion } from 'framer-motion'

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 28 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] },
    }),
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: { duration: 0.6, delay: i * 0.08, ease: 'easeOut' },
    }),
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] },
    }),
  },
  slideLeft: {
    hidden: { opacity: 0, x: 40 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.55, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] },
    }),
  },
  slideRight: {
    hidden: { opacity: 0, x: -40 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.55, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] },
    }),
  },
}

const variantMap = {
  '': 'fadeUp',
  'reveal-zoom': 'zoom',
  'reveal-fade': 'fadeIn',
  'reveal-left': 'slideLeft',
  'reveal-right': 'slideRight',
  'reveal-up': 'fadeUp',
}

export default function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  delay = 0,
  variant = '',
}) {
  const preferredReduce = useReducedMotion()
  const mode = variantMap[variant] || 'fadeUp'
  const preset = variants[mode]
  const MotionTag = motion[Tag] || motion.div

  return (
    <MotionTag
      className={className}
      initial={preferredReduce ? false : 'hidden'}
      whileInView={preferredReduce ? undefined : 'visible'}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      variants={preferredReduce ? undefined : preset}
      custom={delay}
    >
      {children}
    </MotionTag>
  )
}
