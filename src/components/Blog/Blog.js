import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { FiArrowRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/pagination';
import './Blog.css';

const posts = [
  {
    image: '/images/about-interview.png',
    title:
      'With Confident Steps Toward the Joy of Parenthood: The Official Opening of GGRC Armenia',
    link: '#',
  },
  {
    image: '/images/doctors-hero.png',
    title:
      'Modern Approaches to Infertility Treatment: Professional Conference Initiated by GGRC Armenia',
    link: '#',
  },
  {
    image: '/images/hands.png',
    title:
      '\u201CAravot Luso\u201D on Armenian Public TV: GGRC Armenia: A New Hope in Reproductive Medicine',
    link: '#',
  },
];

const Blog = () => {
  return (
    <section className="blog" id="blog">
      <div className="container">
        <h2 className="section-title">BLOG</h2>

        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="blog__swiper"
        >
          {posts.map((post, index) => (
            <SwiperSlide key={index}>
              <div className="blog__card">
                <div className="blog__card-img">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="blog__card-content">
                  <h3 className="blog__card-title">{post.title}</h3>
                  <a href={post.link} className="blog__card-link">
                    READ MORE <FiArrowRight />
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Blog;
