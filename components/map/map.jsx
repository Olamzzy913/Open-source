/*eslint-disable*/

import React, { useEffect, useContext, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { auth, db } from "@/utils/firebase";
import { UserContext } from "@/store/user/user.context";
import { ToggleContext } from "@/store/dataFound/toggle.context";
import { collection, query, getDocs } from "firebase/firestore";
import { SiGooglemaps } from "react-icons/si";

const Map = ({ searchData, searchResult }) => {
  const [currentLatitude, setcurrentLatitude] = useState(null);
  const [currentLongitude, setcurrentLongitude] = useState(null);
  const [status, setStatus] = useState("");
  const [currentUserPlusCode, setCurrentUserPlusCode] = useState("");
  const { currentUser } = useContext(UserContext);
  const { toggle, setToggle } = useContext(ToggleContext);
  const { latitude, longitude, houseName } = searchData;

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

      //  .addEventListener("click", () => {
      //     setToggle(true);
      //     console.log("Marker clicked");
      //   })

      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(houseName)
        .openPopup();
    }
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
          <div className="flex h-full  p-4 -z-50">
            <div className="sidebar"></div>
            <div id="map" className="flex-1"></div>
          </div>
        )}

        <div className="flex flex-col justify-center items-center text-white bg-[rgba(101,103,107,0.57)] rounded-2xl w-[26rem] md:w-[30rem] h-[12rem] gap-4 backdrop-blur-sm absolute bottom-6 right-6">
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
