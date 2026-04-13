/**
 * Footstep — shoe sole imprint shape.
 * Left foot: inner arch on left side, toe box rotated slightly outward.
 * Right foot: mirrored.
 */
export default function Footstep({ side = 'left', scale = 1, className = '', style = {} }) {
  // Natural gait inward rotation: left foot tilts CW, right foot tilts CCW
  const rotation = side === 'right' ? '-11deg' : '11deg'
  const flipX = side === 'right' ? 'scaleX(-1)' : ''
  return (
    <svg
      className={className}
      style={{ transform: `scale(${scale}) rotate(${rotation}) ${flipX}`, transformOrigin: 'center', ...style }}
      width="28" height="44" viewBox="0 0 28 44" fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main sole imprint */}
      <path
        d="M 14.1 40.8
           C 8.6 40.5 5.2 36.8 5.2 31.8
           C 5.2 26.9 6.9 23.1 7.4 19.3
           C 7.8 16.1 7.4 12.7 8.9 9.9
           C 10.6 6.7 12.3 5.4 14.2 5.3
           C 16.4 5.3 18.8 6.8 20.7 10.4
           C 22.2 13.2 21.9 17 21.8 20.8
           C 21.7 25.7 21.4 30.5 20 34.6
           C 18.7 38.5 16.9 41 14.1 40.8 Z"
        fill="#c7b596"
      />
      {/* Heel pressure zone */}
      <ellipse cx="14" cy="33.8" rx="5.8" ry="3.3" fill="#ac9a7f" opacity="0.45" />
      {/* Arch + ball pressure texture */}
      <path d="M 9.3 26.8 C 10.8 24.8 13.8 24.2 16.9 24.9" stroke="#aa977a" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
      <path d="M 8.9 22.4 C 11.7 20.9 15.6 20.8 18.2 22.2" stroke="#aa977a" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <path d="M 9 18.8 C 11.4 17.7 15.2 17.6 17.8 18.6" stroke="#aa977a" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      {/* Toes as separate authentic marks */}
      <ellipse cx="13.8" cy="8.7" rx="2.3" ry="1.5" fill="#ac9a7f" opacity="0.5" />
      <ellipse cx="17.4" cy="9.8" rx="1.7" ry="1.2" fill="#ac9a7f" opacity="0.48" />
      <ellipse cx="20.1" cy="11.3" rx="1.35" ry="1.05" fill="#ac9a7f" opacity="0.45" />
      <ellipse cx="21.8" cy="13.1" rx="1.1" ry="0.9" fill="#ac9a7f" opacity="0.4" />
    </svg>
  )
}
