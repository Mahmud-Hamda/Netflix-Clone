import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import TitleCard from "../TitleCard/TitleCard";
import styles from "./TitleCarousel.module.css";

/**
 * Renders a headed, horizontally scrolling row of title cards with
 * previous/next arrows. Renders nothing when there are no titles.
 *
 * @param {Object} props
 * @param {string} props.heading - Row heading, e.g. "Top Rated".
 * @param {import("../../services/tmdbService").Title[]} [props.titles=[]] - Movies or shows to show.
 * @returns {JSX.Element | null}
 */
export default function TitleCarousel({ heading, titles = [] }) {
  if (!titles.length) return null;

  return (
    <div className={styles.slideShow}>
      <h2 className={styles.title}>{heading}</h2>

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
        {titles.map((title) => (
          <SwiperSlide key={`${title.media_type || "title"}-${title.id}`}>
            <TitleCard title={title} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
