import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { FiArrowRight } from 'react-icons/fi';
import { getImgPosition } from '../../utils/imgPosition';
import { buildSectionStyle, buildTitleStyle } from '../../utils/sectionStyles';
import 'swiper/css';
import 'swiper/css/pagination';
import './Blog.css';

const Blog = ({ data }) => {
  if (!data) return null;
  const items = data.items || [];

  return (
    <section className="blog" id="blog" style={buildSectionStyle(data)}>
      <div className="container">
        <h2 className="section-title" style={buildTitleStyle(data)}>{data.title}</h2>

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
          {items.map((post) => (
            <SwiperSlide key={post.id}>
              <div className="blog__card">
                {post.image_url && (
                  <div className="blog__card-img">
                    <img src={post.image_url} alt={post.title} style={getImgPosition(post) ? { objectPosition: getImgPosition(post) } : undefined} />
                  </div>
                )}
                <div className="blog__card-content">
                  <h3 className="blog__card-title">{post.title}</h3>
                  <a href={post.link_url || '#'} className="blog__card-link">
                    {post.link_text || 'READ MORE'} <FiArrowRight />
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
