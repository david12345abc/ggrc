import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FaQuoteLeft } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import './Testimonials.css';

const testimonials = [
  {
    text: "I had PCOS and hormonal disorders. We had attempted IVF multiple times in Russia, but without success. At GGRC Armenia, the impossible became possible. I'm honestly impressed by the level of professionalism in such a small country.",
    author: 'Patient from Russia',
  },
  {
    text: 'The team at GGRC Armenia treated us with such warmth and care. After years of trying, we finally became parents. We are forever grateful for their expertise and dedication.',
    author: 'International Patient',
  },
  {
    text: 'From the very first consultation, we felt that we were in good hands. The doctors explained every step clearly and gave us hope when we had almost given up.',
    author: 'Patient from CIS',
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="testimonials__bg-pattern" />
      <div className="container">
        <h2 className="testimonials__title">PATIENTS ABOUT GGRC ARMENIA</h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="testimonials__swiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="testimonials__card">
                <FaQuoteLeft className="testimonials__quote-icon" />
                <p className="testimonials__text">{testimonial.text}</p>
                <span className="testimonials__author">
                  — {testimonial.author}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
