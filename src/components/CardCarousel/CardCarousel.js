import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getImgPosition } from '../../utils/imgPosition';
import { buildSectionStyle, buildTitleStyle } from '../../utils/sectionStyles';
import 'swiper/css';
import 'swiper/css/pagination';
import './CardCarousel.css';

const CardCarousel = ({ data }) => {
  if (!data) return null;
  const items = data.items || [];
  const s = data.settings || {};
  const swiperRef = useRef(null);

  const slidesPerView = Number(s.slides_per_view) || 3;
  const loop = items.length > slidesPerView && (s.loop !== false);
  const autoplayEnabled = s.autoplay !== false;
  const autoplayDelay = Number(s.autoplay_delay) || 4000;

  const swiperModules = [Navigation, Pagination];
  if (autoplayEnabled) swiperModules.push(Autoplay);

  const autoplayConfig = autoplayEnabled
    ? { delay: autoplayDelay, disableOnInteraction: false, pauseOnMouseEnter: true }
    : false;

  return (
    <section className="card-carousel" style={buildSectionStyle(data)}>
      <div className="container">
        {data.title && (
          <h2 className="card-carousel__title" style={buildTitleStyle(data)}>
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <p className="card-carousel__subtitle">{data.subtitle}</p>
        )}

        <div className="card-carousel__swiper-wrap">
          <button
            className="card-carousel__arrow card-carousel__arrow--prev"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous"
          >
            &#8249;
          </button>

          <Swiper
            modules={swiperModules}
            spaceBetween={24}
            slidesPerView={1}
            navigation={false}
            pagination={{ clickable: true }}
            loop={loop}
            autoplay={autoplayConfig}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            breakpoints={{
              640: { slidesPerView: Math.min(2, slidesPerView), spaceBetween: 20 },
              1024: { slidesPerView: Math.min(slidesPerView, items.length), spaceBetween: 24 },
            }}
            className="card-carousel__swiper"
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="card-carousel__card">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="card-carousel__img"
                      style={
                        getImgPosition(item)
                          ? { objectPosition: getImgPosition(item) }
                          : undefined
                      }
                    />
                  )}
                  <div className="card-carousel__body">
                    {item.title && (
                      <h3 className="card-carousel__card-title">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="card-carousel__desc">{item.description}</p>
                    )}
                    {item.link_url && item.link_text && (
                      <a href={item.link_url} className="card-carousel__link">
                        {item.link_text}
                      </a>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className="card-carousel__arrow card-carousel__arrow--next"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next"
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
};

export default CardCarousel;
