import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import getIcon from '../../utils/iconMap';
import { buildSectionStyle } from '../../utils/sectionStyles';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './FeaturesSlider.css';

const FeaturesSlider = ({ data }) => {
  if (!data) return null;
  const items = data.items || [];

  return (
    <section className="features" style={buildSectionStyle(data)}>
      <div className="container">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 40 },
          }}
          className="features__swiper"
        >
          {items.map((item) => {
            const IconComp = getIcon(item.icon_name);
            return (
              <SwiperSlide key={item.id}>
                <div className="features__card">
                  <div className="features__icon">
                    {IconComp ? <IconComp /> : null}
                  </div>
                  <h3 className="features__title">{item.title}</h3>
                  <p className="features__desc">{item.description}</p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturesSlider;
