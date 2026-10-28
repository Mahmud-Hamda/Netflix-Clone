import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Card from "../Card/Card";
import styles from "./SlideShow.module.css";

export default function SlideShow({ title, movies = [] }) {
  if (!movies.length) return null;

  return (
    <div className={styles.slideShow}>
      <h2 className={styles.title}>{title}</h2>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={10}
        slidesPerView={2.2}
        breakpoints={{
          640: { slidesPerView: 3.2, spaceBetween: 10 },
          1024: { slidesPerView: 5.5, spaceBetween: 10 },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={`${movie.media_type || "title"}-${movie.id}`}>
            <Card movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
