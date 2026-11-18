// Each path follows the pen's centerline, so the letters are written rather than outlined.
const strokes = [
  { d: 'M20 25 C18 35 16 47 11 53 C6 59 2 53 7 49 C12 45 21 41 27 33', duration: '.65s', delay: '.15s' },
  { d: 'M21 16 L21.5 15', duration: '.12s', delay: '.82s' },
  { d: 'M43 28 C38 20 27 29 28 37 C29 47 39 38 43 27 L40 39 C39 44 44 41 49 34', duration: '.5s', delay: '.96s' },
  { d: 'M52 26 C49 34 46 45 54 39 L63 25 C59 38 57 52 50 57 C43 62 40 55 48 50 L65 39', duration: '.65s', delay: '1.48s' },
  { d: 'M82 29 C87 22 97 23 99 26 L82 41 C90 37 98 45 104 37', duration: '.45s', delay: '2.3s' },
  { d: 'M116 25 C105 23 100 42 109 43 C118 44 124 25 116 25 C114 31 120 34 126 29', duration: '.5s', delay: '2.77s' },
  { d: 'M130 26 C126 36 124 44 131 41 C136 38 139 30 141 26 L137 38 C135 47 143 44 151 35', duration: '.5s', delay: '3.29s' },
  { d: 'M70 55 C94 50 125 52 158 47', duration: '.45s', delay: '3.9s' },
]

const HandwrittenName = () => <svg className="handwritten-name" viewBox="0 0 170 64" width="132" height="44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
  {strokes.map(({ d, duration, delay }) => <path key={d} d={d} pathLength="1" style={{ animationDuration: duration, animationDelay: delay }} />)}
</svg>

export default HandwrittenName
