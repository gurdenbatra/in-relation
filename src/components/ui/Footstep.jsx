export default function Footstep({ side = 'left', scale = 1, className = '', style = {} }) {
  const mirrorTransform = side === 'right' ? `scale(${scale}) scaleX(-1)` : `scale(${scale})`
  return (
    <svg
      className={className}
      style={{ transform: mirrorTransform, ...style }}
      width="32" height="46" viewBox="0 0 32 46" fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="16" cy="32" rx="13" ry="12" fill="#c8b89a" />
      <ellipse cx="16" cy="40" rx="10" ry="6" fill="#b8a888" />
      <ellipse cx="10" cy="20" rx="5" ry="6" fill="#c8b89a" />
      <ellipse cx="16" cy="17" rx="4" ry="5.5" fill="#c8b89a" />
      <ellipse cx="21" cy="19" rx="3.5" ry="5" fill="#c8b89a" />
      <ellipse cx="25" cy="22" rx="3" ry="4.5" fill="#c8b89a" />
      <ellipse cx="28" cy="26" rx="2.5" ry="4" fill="#c8b89a" />
    </svg>
  )
}
