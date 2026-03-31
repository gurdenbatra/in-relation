/**
 * Footstep — shoe sole imprint shape.
 * Left foot: inner arch on left side, toe box rotated slightly outward.
 * Right foot: mirrored.
 */
export default function Footstep({ side = 'left', scale = 1, className = '', style = {} }) {
  // Natural gait inward rotation: left foot tilts CW, right foot tilts CCW
  const rotation = side === 'right' ? '-8deg' : '8deg'
  const flipX = side === 'right' ? 'scaleX(-1)' : ''
  return (
    <svg
      className={className}
      style={{ transform: `scale(${scale}) rotate(${rotation}) ${flipX}`, transformOrigin: 'center', ...style }}
      width="28" height="44" viewBox="0 0 28 44" fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sole outline: wider heel, pinched arch on left (inner) side, full ball */}
      <path
        d="M 13,41
           C 7,41 4,36 4,31
           C 4,26 6,22 6.5,18
           C 7,14 6,10 8,7
           C 10,4 12,3 14,3
           C 16,3 19,4 21,8
           C 23,11 22,16 22,20
           C 22,25 22,30 21,34
           C 20,39 17,42 13,41 Z"
        fill="#c8b89a"
      />
      {/* Heel pad */}
      <ellipse cx="13" cy="35" rx="6" ry="3.5" fill="#b8a888" opacity="0.6"/>
      {/* Ball tread ridges */}
      <rect x="7" y="22.5" width="11" height="1.8" rx="0.9" fill="#b8a888" opacity="0.5"/>
      <rect x="6.5" y="19.5" width="12" height="1.8" rx="0.9" fill="#b8a888" opacity="0.5"/>
      {/* Toe box dots */}
      <circle cx="12" cy="9" r="1.6" fill="#b8a888" opacity="0.5"/>
      <circle cx="17" cy="10.5" r="1.4" fill="#b8a888" opacity="0.5"/>
    </svg>
  )
}
