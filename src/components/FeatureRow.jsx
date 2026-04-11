export default function FeatureRow({ title, text, video, reverse }) {
  return (
    <div className={`feature-row ${reverse ? "reverse" : ""}`}>

      <div className="btf-card">
        <h2>{title}</h2>
        <p>{text}</p>
      </div>

      <div className="btf-media">
        <video autoPlay loop muted playsInline className="feature-video">
          <source src={video} type="video/mp4" />
        </video>
      </div>

    </div>
  )
}