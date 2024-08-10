/*eslint-disable*/

import Link from "next/link";
import Head from "next/head";
import React, { useEffect, useContext, useState } from "react";
import { SiGooglemaps } from "react-icons/si";
import { FaLandmark } from "react-icons/fa";
import { FaHouseUser, FaFileSignature } from "react-icons/fa6";
import { TbWorldLatitude, TbWorldLongitude } from "react-icons/tb";
import { BsFillHouseDownFill } from "react-icons/bs";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { auth, db } from "@/utils/firebase";
import { UserContext } from "@/store/user/user.context";
import { ToggleContext } from "@/store/dataFound/toggle.context";
import { collection, query, getDocs } from "firebase/firestore";

const Map = ({ searchData, searchResult }) => {
  const [currentLatitude, setcurrentLatitude] = useState(null);
  const [currentLongitude, setcurrentLongitude] = useState(null);
  const [status, setStatus] = useState("");
  const [currentUserPlusCode, setCurrentUserPlusCode] = useState("");
  const { currentUser } = useContext(UserContext);
  const { toggle, setToggle } = useContext(ToggleContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (searchData) {
          console.log("Data available to be displayed.....:", searchData);
          initMap();
        }
        getPlusCode();
      }
      getLocation();
    });
    return () => unsubscribe();
  }, [currentUser, searchData]);

  const getPlusCode = async () => {
    try {
      const userQuery = query(
        collection(db, "users", currentUser.uid, "additionalData")
      );
      const userQuerySnapshot = await getDocs(userQuery);

      userQuerySnapshot.forEach((doc) => {
        if (doc.data()) {
          const userData = { id: doc.id, ...doc.data() };
          setCurrentUserPlusCode(userData.plusCode);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating…");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  const success = (position) => {
    setcurrentLatitude(position.coords.latitude);
    setcurrentLongitude(position.coords.longitude);
    setStatus("");
  };

  const error = () => {
    setStatus("Unable to retrieve your location");
  };

  const initMap = async () => {
    if (typeof window !== "undefined" && latitude && longitude) {
      const L = await import("leaflet");

      const map = L.map("map").setView([latitude, longitude], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(houseName)
        .openPopup();
    }
  };

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

  const image1 = imageUrl1;
  const image2 = imageUrl2;
  const image3 = imageUrl3;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [hideData, setHideData] = useState(false);
  const hideDateToggle = () => {
    setHideData(!hideData);
  };

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
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xwEAXDEdKuLeM2W0+IexHtS5wA0S7kD3Ugq1LNJ3JTfjbPpz6zIlzLW8PJcJwwAPVfY3Msh5p+IQTBKx01dpQg=="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
          integrity="sha512-dwQ4MJXvdEDvYwy8YvHlGvVRt14rQy7SGD+VQ/Ux9/m4FtkKoVAMp2SjlHMTjZBzFz4dmDZJZoZzKGOlRkLAGQ=="
          crossOrigin=""
        ></script>
      </Head>
      <div className="relative h-svh">
        {!currentUser && (
          <div className="h-full w-full flex flex-col justify-center items-center gap-4 px-3">
            <SiGooglemaps className="text-[4rem] text-[#006A34]" />
            <p className="font-normal">Welcome back to Open State</p>
            <p className="font-normal text-center">
              Ensure you are logged in to have access to the full information of
              the plus code provided.
            </p>
            <Link
              href="/login"
              className="text-[1.2rem] font-medium bg-[#006A34] hover:bg-[#10301f] rounded-full text-white transition py-3 px-8"
            >
              Sign in
            </Link>
          </div>
        )}

        {currentUser && !searchResult && (
          <div className="h-full w-full flex flex-col justify-center items-center gap-4 px-3">
            <SiGooglemaps className="text-[4rem] text-[#006A34]" />
            <p className="font-normal">Welcome back to Open State</p>
            <p className="font-normal text-center">
              Get Resident data just by making a search with the provided PLus
              code
            </p>
          </div>
        )}

        {currentUser && searchResult && (
          <>
            <div className="sidebar md:hidden z-40 absolute bottom-0 w-full flex flex-col justify-center gap-3 px-4 py-3">
              {!hideData ? (
                <IoIosArrowUp
                  className="cursor-pointer text-[2rem] text-[#696969] mx-auto"
                  onClick={hideDateToggle}
                />
              ) : (
                <IoIosArrowDown
                  className="cursor-pointer text-[2rem] text-[#696969] mx-auto"
                  onClick={hideDateToggle}
                />
              )}
              <div className="flex my-[1rem] mx-auto">
                <SiGooglemaps className="text-[1.5rem] text-[#006A34]" />
                <p className="font-bold text-[1.2rem] text-white">
                  Plue code <span className="font-normal">{plusCode} </span>
                </p>
              </div>
              {hideData && (
                <>
                  <div className="carouselContainer block mx-auto transition ">
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
                  <div className="grid grid-cols-1 gap-[2rem] my-6 md:my-8 mx-auto">
                    <div className=" flex items-center">
                      <FaLandmark className="text-[1.1rem] mr-3 text-blue-600" />

                      <p className="font-semibold text-white">
                        Nearest Landmark{" "}
                        <span className="font-normal"> {landMark}</span>
                      </p>
                    </div>
                    <div className=" flex items-center">
                      <BsFillHouseDownFill className="text-[1.3rem] mr-3 text-blue-600" />
                      <p className="font-semibold text-white">
                        Known House name{" "}
                        <span className="font-normal"> {houseName}</span>
                      </p>
                    </div>
                    <div className=" flex items-center">
                      <FaHouseUser className="text-[1.3rem] mr-3 text-blue-600" />
                      <p className="font-semibold text-white">
                        House Type{" "}
                        <span className="font-normal"> {houseType}</span>
                      </p>
                    </div>
                    <div className=" flex items-center">
                      <FaFileSignature className="text-[1.3rem] mr-3 text-blue-600" />
                      <p className="font-semibold text-white">
                        Nature of Building{" "}
                        <span className="font-normal"> {nature}</span>
                      </p>
                    </div>
                    <div className=" flex items-center">
                      <TbWorldLatitude className="text-[1.5rem] mr-3 text-blue-600" />
                      <p className="font-semibold text-white">
                        Latitude{" "}
                        <span className="font-normal"> {latitude}</span>
                      </p>
                    </div>
                    <div className=" flex items-center">
                      <TbWorldLongitude className="text-[1.5rem] mr-3 text-blue-600" />
                      <p className="font-semibold text-white">
                        Longitude{" "}
                        <span className="font-normal"> {longitude}</span>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex h-full -z-50">
              <div className="sidebar hidden md:flex flex-col justify-center gap-3 px-4 py-3">
                <div className="mx-auto flex my-[2rem]">
                  <SiGooglemaps className="text-[1.5rem] text-[#006A34]" />
                  <p className="font-bold text-[1.2rem] text-white">
                    Plue code <span className="font-normal">{plusCode} </span>
                  </p>
                </div>
                <div className="carouselContainer block mx-auto">
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
                <div className="grid grid-cols-1 gap-[2rem] my-6 md:my-8 pl-[1.6rem]">
                  <div className=" flex items-center">
                    <FaLandmark className="text-[1.1rem] mr-3 text-blue-600" />

                    <p className="font-semibold text-white">
                      Nearest Landmark{" "}
                      <span className="font-normal"> {landMark}</span>
                    </p>
                  </div>
                  <div className=" flex items-center">
                    <BsFillHouseDownFill className="text-[1.3rem] mr-3 text-blue-600" />
                    <p className="font-semibold text-white">
                      Known House name{" "}
                      <span className="font-normal"> {houseName}</span>
                    </p>
                  </div>
                  <div className=" flex items-center">
                    <FaHouseUser className="text-[1.3rem] mr-3 text-blue-600" />
                    <p className="font-semibold text-white">
                      House Type{" "}
                      <span className="font-normal"> {houseType}</span>
                    </p>
                  </div>
                  <div className=" flex items-center">
                    <FaFileSignature className="text-[1.3rem] mr-3 text-blue-600" />
                    <p className="font-semibold text-white">
                      Nature of Building{" "}
                      <span className="font-normal"> {nature}</span>
                    </p>
                  </div>
                  <div className=" flex items-center">
                    <TbWorldLatitude className="text-[1.5rem] mr-3 text-blue-600" />
                    <p className="font-semibold text-white">
                      Latitude <span className="font-normal"> {latitude}</span>
                    </p>
                  </div>
                  <div className=" flex items-center">
                    <TbWorldLongitude className="text-[1.5rem] mr-3 text-blue-600" />
                    <p className="font-semibold text-white">
                      Longitude{" "}
                      <span className="font-normal"> {longitude}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div id="map" className="flex-1"></div>
            </div>
          </>
        )}

        <div className="flex flex-col  justify-center items-center text-white bg-[rgba(101,103,107,0.57)] rounded-2xl w-[26rem] md:w-[30rem] h-[12rem] gap-4 backdrop-blur-sm absolute bottom-[10rem] md:bottom-6 right-6">
          {currentUser ? (
            <span className="font-semibold text-lg">
              Your Plus Code: {currentUserPlusCode}
            </span>
          ) : (
            <span className="font-semibold text-lg">
              Sign in to get your plus code
            </span>
          )}
          <span>Latitude of current location: {currentLatitude}</span>
          <span>Longitude of current location: {currentLongitude}</span>
        </div>
      </div>
    </>
  );
};

export default Map;
