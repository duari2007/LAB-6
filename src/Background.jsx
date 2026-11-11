const STAR_A =
  'M108.0 34.3L117.7 56.5Q122.9 68.4 135.8 70.2L155.3 72.9Q175.1 75.6 161.4 90.2L148.9 103.5Q139.9 113.0 142.2 125.8L146.4 149.1Q150.0 168.8 132.9 158.3L111.1 144.8Q100.0 138.0 88.7 144.4L70.4 154.8Q53.0 164.7 56.0 145.0L59.0 125.5Q61.0 112.7 51.6 103.7L35.5 88.2Q21.1 74.4 41.0 72.3L64.1 69.8Q77.1 68.4 82.3 56.5L92.0 34.3Q100.0 16.0 108.0 34.3Z'

const STAR_B =
  'M110.1 45.5L115.9 56.8Q122.3 69.3 136.3 70.7L153.2 72.5Q177.0 75.0 158.2 89.9L143.3 101.8Q132.3 110.5 135.6 124.1L139.1 138.5Q144.7 161.5 124.6 150.5L112.3 143.7Q100.0 137.0 88.0 144.3L72.3 153.9Q51.8 166.3 58.0 143.2L63.1 124.3Q66.7 110.8 56.3 101.5L45.8 92.1Q28.7 76.8 50.7 73.4L63.8 71.4Q77.7 69.3 84.1 56.8L89.9 45.5Q100.0 26.0 110.1 45.5Z'

function Star({ shape, cx, cy, size, rotate, opacity }) {
  const scale = size / 200
  return (
    <use
      href={`#${shape}`}
      fill="#FF8282"
      fillOpacity={opacity}
      transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale}) translate(-100 -100)`}
    />
  )
}

function Background() {
  return (
    <div className="decor" aria-hidden="true">
      <svg className="decor__wide" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <path id="star-a" d={STAR_A} />
          <path id="star-b" d={STAR_B} />
        </defs>
        <Star shape="star-b" cx={180} cy={870} size={780} rotate={-10} opacity={0.2} />
        <Star shape="star-a" cx={1093} cy={776} size={220} rotate={6} opacity={0.3} />
        <Star shape="star-a" cx={1493} cy={217} size={122} rotate={-6} opacity={0.6} />
        <Star shape="star-b" cx={1290} cy={58} size={66} rotate={12} opacity={0.6} />
      </svg>

      <svg className="decor__narrow" viewBox="0 0 430 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <path id="star-a-m" d={STAR_A} />
          <path id="star-b-m" d={STAR_B} />
        </defs>
        <Star shape="star-b-m" cx={-30} cy={820} size={380} rotate={-12} opacity={0.2} />
        <Star shape="star-a-m" cx={345} cy={735} size={170} rotate={8} opacity={0.3} />
        <Star shape="star-a-m" cx={360} cy={95} size={110} rotate={-6} opacity={0.6} />
        <Star shape="star-b-m" cx={255} cy={45} size={60} rotate={12} opacity={0.6} />
      </svg>
    </div>
  )
}

export default Background
