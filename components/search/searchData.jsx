/*eslint-disable*/
import Image from "next/image";
import { SiGooglemaps } from "react-icons/si";
import { FaLandmark } from "react-icons/fa";
import { FaHouseUser, FaFileSignature } from "react-icons/fa6";
import { TbWorldLatitude, TbWorldLongitude } from "react-icons/tb";
import { BsFillHouseDownFill } from "react-icons/bs";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { useContext, useState } from "react";
import { UserContext } from "@/store/user/user.context";
import { ToggleContext } from "@/store/dataFound/toggle.context";

const FetchData = ({
  searchData,
  setSearchData,
  setSearchResult,
  searchResult,
}) => {
  const { currentUser } = useContext(UserContext);
  const { toggle, setToggle } = useContext(ToggleContext);
  const {
    houseName,
    houseType,
    landMark,
    plusCode,
    latitude,
    longitude,
    nature,
    imageUrl1,
    imageUrl2,
    imageUrl3,
  } = searchData;
  console.log(searchData);

  const image1 = imageUrl1;
  const image2 = imageUrl2;
  const image3 = imageUrl3;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselRunning, setCarouselRunning] = useState(true);

  const slides = [image1, image2, image3];
  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + totalSlides) % totalSlides);
  };

  return (
    <>
      <div
        className={
          toggle && !currentUser
            ? "fixed z-50 inset-0 overflow-y-auto backdrop-blur-sm"
            : "hidden"
        }
        id="modal"
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0  bg-gray-800   opacity-75"></div>
          </div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
            &#8203;
          </span>

          <div className="inline-block float-middle align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:max-w-[56rem] sm:max-w-lg sm:w-full">
            <div className="py-8 text-left px-[3rem]">
              {/* {plusCode && currentUser && (
                <>
                  <div className="flex justify-between items-center pb-4">
                    <p className="text-2xl font-bold">Resident Details</p>
                    <div className="modal-close cursor-pointer z-50">
                      <button
                        type="button"
                        className="end-2.5 cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => {
                          setToggle(!toggle);
                        }}
                      >
                        <svg
                          className="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-5">
                    <div className="mx-auto flex my-[2rem]">
                      <SiGooglemaps className="text-[1.5rem] text-[#006A34]" />
                      <p className="font-bold text-[1.2rem]">
                        Plue code{" "}
                        <span className="font-medium">{plusCode} </span>
                      </p>
                    </div>

                    <div className="md:grid hidden md:grid-cols-3 gap-[3rem]">
                      <img
                        src={imageUrl1}
                        alt=""
                        className="w-[14rem] h-[14rem] mx-auto object-cover border-indigo-300 border rounded-xl"
                      />
                      <img
                        src={imageUrl2}
                        alt=""
                        className="w-[14rem] h-[14rem] mx-auto object-cover border-indigo-300 border rounded-xl"
                      />
                      <img
                        src={imageUrl3}
                        alt=""
                        className="w-[14rem] h-[14rem] mx-auto object-cover border-indigo-300 border rounded-xl"
                      />
                    </div>
                    <div className="carouselContainer block md:hidden">
                      <div
                        className="carouselWrapper"
                        style={{
                          transform: `translateX(${-currentSlide * 260}px)`,
                        }}
                      >
                        {slides.map((slide, index) => (
                          <div className="slide  " key={index}>
                            <img
                              className="w-full h-[18rem] mx-auto object-cover border-indigo-300 border rounded-xl"
                              src={slide}
                              alt=""
                            />
                          </div>
                        ))}
                      </div>
                      <IoIosArrowDropleftCircle
                        className="button left-[10px] text-[2rem] text-[#151a18]"
                        onClick={prevSlide}
                      />
                      <IoIosArrowDroprightCircle
                        className="button right-[10px] text-[2rem] text-[#151a18]"
                        onClick={nextSlide}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.5rem] md:gap-[3rem] my-6 md:my-8">
                      <div className=" flex items-center">
                        <FaLandmark className="text-[1.1rem] mr-3 text-blue-600" />

                        <p className="font-bold">
                          Nearest Landmark{" "}
                          <span className="font-medium"> {landMark}</span>
                        </p>
                      </div>
                      <div className=" flex items-center">
                        <BsFillHouseDownFill className="text-[1.3rem] mr-3 text-blue-600" />
                        <p className="font-bold">
                          Known House name{" "}
                          <span className="font-medium"> {houseName}</span>
                        </p>
                      </div>
                      <div className=" flex items-center">
                        <FaHouseUser className="text-[1.3rem] mr-3 text-blue-600" />
                        <p className="font-bold">
                          House Type{" "}
                          <span className="font-medium"> {houseType}</span>
                        </p>
                      </div>
                      <div className=" flex items-center">
                        <FaFileSignature className="text-[1.3rem] mr-3 text-blue-600" />
                        <p className="font-bold">
                          Nature of Building{" "}
                          <span className="font-medium"> {nature}</span>
                        </p>
                      </div>
                      <div className=" flex items-center">
                        <TbWorldLatitude className="text-[1.5rem] mr-3 text-blue-600" />
                        <p className="font-bold">
                          Latitude{" "}
                          <span className="font-medium"> {latitude}</span>
                        </p>
                      </div>
                      <div className=" flex items-center">
                        <TbWorldLongitude className="text-[1.5rem] mr-3 text-blue-600" />
                        <p className="font-bold">
                          Longitude{" "}
                          <span className="font-medium"> {longitude}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )} */}
              {plusCode && !currentUser && (
                <>
                  <div className="flex justify-between items-center pb-4">
                    <p className="text-2xl font-bold">Resident Details</p>
                    <div className="modal-close cursor-pointer z-50">
                      <button
                        type="button"
                        className="end-2.5 cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => {
                          setToggle(!toggle);
                        }}
                      >
                        <svg
                          className="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-5">
                    <div className="mx-auto flex my-[2rem]">
                      <SiGooglemaps className="text-[1.5rem] text-[#006A34]" />
                      <p className="font-bold text-[1.2rem]">
                        Plue code{" "}
                        <span className="font-medium">{plusCode} </span>
                      </p>
                    </div>

                    <div className="md:grid hidden md:grid-cols-3 gap-[3rem]">
                      <img
                        src={imageUrl1}
                        alt=""
                        className="w-[14rem] h-[14rem] mx-auto object-cover border-indigo-300 border rounded-xl"
                      />
                      <img
                        src={imageUrl2}
                        alt=""
                        className="w-[14rem] h-[14rem] mx-auto object-cover border-indigo-300 border rounded-xl"
                      />
                      <img
                        src={imageUrl3}
                        alt=""
                        className="w-[14rem] h-[14rem] mx-auto object-cover border-indigo-300 border rounded-xl"
                      />
                    </div>
                    <div className="carouselContainer block md:hidden">
                      <div
                        className="carouselWrapper"
                        style={{
                          transform: `translateX(${-currentSlide * 260}px)`,
                        }}
                      >
                        {slides.map((slide, index) => (
                          <div className="slide  " key={index}>
                            <img
                              className="w-full h-[18rem] mx-auto object-cover border-indigo-300 border rounded-xl"
                              src={slide}
                              alt=""
                            />
                          </div>
                        ))}
                      </div>
                      <IoIosArrowDropleftCircle
                        className="button left-[10px] text-[2rem] text-[#151a18]"
                        onClick={prevSlide}
                      />
                      <IoIosArrowDroprightCircle
                        className="button right-[10px] text-[2rem] text-[#151a18]"
                        onClick={nextSlide}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.5rem] md:gap-[3rem] my-6 md:my-8">
                      <div className=" flex items-center">
                        <FaLandmark className="text-[1.1rem] mr-3 text-blue-600" />

                        <p className="font-bold">
                          Nearest Landmark{" "}
                          <span className="font-medium"> {landMark}</span>
                        </p>
                      </div>
                      <div className=" flex items-center">
                        <BsFillHouseDownFill className="text-[1.3rem] mr-3 text-blue-600" />
                        <p className="font-bold">
                          Known House name{" "}
                          <span className="font-medium"> {houseName}</span>
                        </p>
                      </div>
                      <div className=" flex items-center">
                        <FaHouseUser className="text-[1.3rem] mr-3 text-blue-600" />
                        <p className="font-bold">
                          House Type{" "}
                          <span className="font-medium"> {houseType}</span>
                        </p>
                      </div>
                      <div className=" flex items-center">
                        <FaFileSignature className="text-[1.3rem] mr-3 text-blue-600" />
                        <p className="font-bold">
                          Nature of Building{" "}
                          <span className="font-medium"> {nature}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {!plusCode && (
                <>
                  <div className="flex flex-col gap-4  text-center justify-center items-center">
                    No Data found Please Input a valid Plus Code!! Ensure you
                    connected to internet
                    <button
                      className="px-6 py-2 bg-green-800 hover:bg-green-950 text-white rounded-2xl"
                      onClick={() => {
                        setToggle(false);
                      }}
                    >
                      Try Again
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FetchData;
