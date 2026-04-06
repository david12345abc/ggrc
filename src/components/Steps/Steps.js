import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './Steps.css';

const steps = [
  {
    number: '01',
    title: 'Get an Appointment',
    description:
      'Start Your journey to parenthood with the guidance of experienced specialists',
    image: '/images/about-interview.png',
  },
  {
    number: '02',
    title: 'Start Check-Up',
    description: "We'll carefully assess Your reproductive health",
    image: '/images/doctors-hero.png',
  },
  {
    number: '03',
    title: 'Begin Treatment',
    description:
      'Our specialists will create a personalized treatment plan for you',
    image: '/images/hands.png',
  },
  {
    number: '04',
    title: 'Achieve Your Dream',
    description: 'Take the final step towards becoming a parent',
    image: '/images/about-interview.png',
  },
];

const Steps = () => {
  return (
    <section className="steps">
      <div className="container">
        <h2 className="section-title">STEPS</h2>

        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={1.1}
          pagination={{ clickable: true }}
          breakpoints={{
            480: { slidesPerView: 1.3 },
            768: { slidesPerView: 2.2, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
          }}
          className="steps__swiper"
        >
          {steps.map((step, index) => (
            <SwiperSlide key={index}>
              <div className="steps__card">
                <span className="steps__number">{step.number}</span>
                <div className="steps__card-img">
                  <img src={step.image} alt={step.title} />
                </div>
                <h3 className="steps__card-title">{step.title}</h3>
                <p className="steps__card-desc">{step.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Steps;
