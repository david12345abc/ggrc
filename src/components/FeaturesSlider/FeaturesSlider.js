import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { FaUserMd, FaHospital, FaHandHoldingHeart, FaGlobe } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './FeaturesSlider.css';

const features = [
  {
    icon: <FaUserMd />,
    title: 'Professional Excellence',
    description:
      'We bring together specialists with international experience who follow the latest advancements in reproductive medicine.',
  },
  {
    icon: <FaHospital />,
    title: 'Advanced Technology',
    description:
      'Our clinic is equipped with state-of-the-art technology including Time-lapse Embryoscope and AI-integrated IVF systems.',
  },
  {
    icon: <FaHandHoldingHeart />,
    title: 'Personalized Care',
    description:
      'Every patient receives an individualized treatment plan tailored to their unique medical needs and personal circumstances.',
  },
  {
    icon: <FaGlobe />,
    title: 'International Standards',
    description:
      'As a branch of the renowned Georgian-German Reproductive Center, we maintain the highest international standards of care.',
  },
];

const FeaturesSlider = () => {
  return (
    <section className="features">
      <div className="features__container">
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
          {features.map((feature, index) => (
            <SwiperSlide key={index}>
              <div className="features__card">
                <div className="features__icon">{feature.icon}</div>
                <h3 className="features__title">{feature.title}</h3>
                <p className="features__desc">{feature.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturesSlider;
