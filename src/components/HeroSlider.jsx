import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { getImagePath } from '../utils/paths'

const BASE = [
  '/images/slider1.png',
  '/images/slider2.png',
  '/images/slider3.png',
  '/images/slider2.png'
].map(getImagePath)

const SLIDES = [...BASE, ...BASE]

export default function HeroSlider() {
  const [swiper, setSwiper] = useState(null)
  const prev = () => swiper?.slidePrev()
  const next = () => swiper?.slideNext()

  return (
    <section className="mb-10">
      <div className="relative w-full max-w-7xl mx-auto px-4">
        <button
          className="
            absolute top-1/2 -translate-y-1/2
            left-0 -translate-x-full
            z-20
          "
          onClick={prev}
        >
          <img src={getImagePath("/images/prev.svg")} alt="prev" />
        </button>

        <button
          className="
            absolute top-1/2 -translate-y-1/2
            right-0 translate-x-full
            z-20
          "
          onClick={next}
        >
          <img src={getImagePath("/images/next.svg")} alt="next" />
        </button>

        <Swiper
          modules={[Autoplay]}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={650}
          slidesPerView={2}
          spaceBetween={32}
          onInit={setSwiper}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 16 },
            700: { slidesPerView: 2, spaceBetween: 28 }
          }}
          className="w-full"
        >
          {SLIDES.map((src, i) => (
            <SwiperSlide key={i} className="select-none">
              <div className="rounded-xl shadow-lg overflow-hidden h-[300px] md:h-[340px] flex bg-white">
                <img
                  src={src}
                  alt={`slide-${i + 1}`}
                  className="w-full h-full object-cover object-center"
                  style={ src.includes('slider2') ? { objectPosition: '22% 40%' } : undefined }
                  draggable={false}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  )
}
