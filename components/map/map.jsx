/*eslint-disable*/
import React, { useEffect, useContext, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { auth, db } from "@/utils/firebase";
import { UserContext } from "@/store/user/user.context";
import { collection, query, getDocs } from "firebase/firestore";
import { SiGooglemaps } from "react-icons/si";

const Map = ({ searchData }) => {
  const [currentLatitude, setcurrentLatitude] = useState(null);
  const [currentLongitude, setcurrentLongitude] = useState(null);
  const [status, setStatus] = useState("");
  const [currentUserPlusCode, setCurrentUserPlusCode] = useState("");
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    console.log(typeof window);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getPlusCode();
        getLocation();
      } else {
        getLocation();
      }
    });
    return () => unsubscribe();
  }, [currentUser]);

  const getPlusCode = async () => {
    try {
      const userQuery = query(
        collection(db, "users", currentUser.uid, "additionalData")
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

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating…");
      navigator.geolocation.getCurrentPosition(success);
    }
  };

  const success = (position) => {
    setcurrentLatitude(position.coords.latitude);
    setcurrentLongitude(position.coords.longitude);
    setStatus("");
  };

  const { latitude, longitude } = searchData;

  const googleMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d990.3365341377!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bdbdb4409cbb5%3A0x303fef9476c06de8!2sOlabisi%20Onabanjo%20University%20Teaching%20Hospital!5e0!3m2!1sen!2sng!4v1721940457248!5m2!1sen!2sng`;

  return (
    <>
      <Head></Head>
      <div className="relative h-svh">
        {currentUser && (
          <>
            {searchData ? (
              <div className="h-[50rem] w-full pt-[10rem] px-6 ">
                <div className="rounded-[2rem] w-full h-full">
                  <iframe
                    src={googleMapUrl}
                    allowFullScreen=""
                    className="w-full h-full border-none"
                    loading="lazy"
                  ></iframe>
                  {/* <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d990.3365341377!2d3.6523790694856113!3d6.849045731106661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bdbdb4409cbb5%3A0x303fef9476c06de8!2sOlabisi%20Onabanjo%20University%20Teaching%20Hospital!5e0!3m2!1sen!2sng!4v1721940457248!5m2!1sen!2sng"
                    className="w-full h-full border-none"
                    allowfullscreen=""
                    loading="lazy"
                  ></iframe> */}
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex flex-col justify-center items-center gap-4 px-3">
                <SiGooglemaps className="text-[4rem] text-[#006A34]" />
                <p className="font-normal">Welcome back to Open State</p>
                <p className="font-normal text-center">
                  Now You will get access to all data on the search plus code
                  provided
                </p>
              </div>
            )}
          </>
        )}

        {!currentUser && (
          <div className="h-full w-full flex flex-col justify-center items-center gap-4 px-3">
            <SiGooglemaps className="text-[4rem] text-[#006A34]" />
            <p className="font-normal">Welcome back to Open State</p>
            <p className="font-normal text-center">
              Ensure You logged so you can have access to full information of
              the plus code provided
            </p>
            <Link
              href="/login"
              className="text-[1.2rem] font-medium bg-[#006A34] hover:bg-[#10301f] rounded-full text-white transition py-3 px-8"
            >
              Sign in
            </Link>
          </div>
        )}

        <div className="flex  flex-col justify-center items-center text-white bg-[rgba(101,103,107,0.57)] rounded-2xl w-[26rem] md:w-[30rem]  h-[12rem] gap-4 backdrop-blur-sm absolute bottom-6 right-6">
          {currentUser ? (
            <>
              <span className="font-semibold text-lg">
                Your Plus Code {currentUserPlusCode}
              </span>
            </>
          ) : (
            <>
              <span className="font-semibold text-lg">
                Sign in to get your plus code
              </span>
            </>
          )}
          <span>Latitude of current location {currentLatitude}</span>
          <span>Longitude of current location {currentLongitude}</span>
        </div>
      </div>
    </>
  );
};

export default Map;
