/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { onAuthStateChangedListener } from "@/utils/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { SiGooglemaps } from "react-icons/si";

const Map = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [status, setStatus] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserPlusCode, setCurrentUserPlusCode] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });
    getLocation();
    console.log(latitude, longitude);
  }, []);

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating…");
      navigator.geolocation.getCurrentPosition(success);
    }

    try {
      const userQuery = query(
        collection(db, "users", currentUserId, "additionalData")
      );
      const userQuerySnapshot = await getDocs(userQuery);

      userQuerySnapshot.forEach((doc) => {
        if (doc.data()) {
          const userData = { id: doc.id, ...doc.data() };
          console.log(userData.plusCode);
          setCurrentUserPlusCode(userData.plusCode);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const success = (position) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);

    setStatus("");
  };

  return (
    <>
      <Head></Head>
      <div className="flex  flex-col justify-center items-center h-[40rem] gap-10">
        <SiGooglemaps className="text-[4rem] text-[#006A34]" />
        {currentUserId ? (
          <p className="mb-8">
            Welcome to Open State.{" "}
            <span className="font-semibold text-lg">
              Your Plus Code {currentUserPlusCode}
            </span>
          </p>
        ) : (
          <p className="mb-4">
            Welcome to Open State.{" "}
            <span className="font-semibold text-lg">
              Sign in to get your plus code
            </span>
          </p>
        )}
        Latitude of current location {latitude} <br></br>Longitude of current
        location {longitude}
      </div>
    </>
  );
};

export default Map;
