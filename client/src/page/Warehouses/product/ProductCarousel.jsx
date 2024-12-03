/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { FaRegTrashAlt } from "react-icons/fa";


const ProductCarousel = ({ photos,deletePhoto,index }) => {
    if (!photos || photos.length === 0) return null;

    return (
        <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="w-full h-full text-gray-500"
        >
            {photos.map((photo, idx) => (
                <SwiperSlide key={idx}>
                <div className="relative">
                    <img
                        src={photo}
                        alt={`Photo ${idx}`}
                        className="w-full h-auto object-cover rounded-md"
                    />
                    <button
                        type="button"
                        onClick={() => deletePhoto(index,idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                    >
                        <FaRegTrashAlt />
                    </button>
                </div>
            </SwiperSlide>
            ))}
        </Swiper>
    );
};
export default ProductCarousel;

