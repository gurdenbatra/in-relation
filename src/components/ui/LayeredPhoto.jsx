export default function LayeredPhoto({ src, alt = '', style = {}, parallaxSpeed = 0.5 }) {
  return (
    <div
      className="layered-photo absolute overflow-hidden rounded-sm"
      data-parallax-speed={parallaxSpeed}
      style={style}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />
    </div>
  )
}
