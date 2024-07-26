/*eslint-disable*/
import React, { useEffect, useContext, useState } from "react";
import Head from "next/head";
import { auth, db } from "@/utils/firebase";
import { UserContext } from "@/store/user/user.context";
import { collection, query, getDocs } from "firebase/firestore";
import { SiGooglemaps } from "react-icons/si";
// import "leaflet/dist/leaflet.css";
// import { MapContainer, TileLayer, useMap } from "react-leaflet";

const Map = ({ address }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
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
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    setStatus("");
  };

  return (
    <>
      <Head></Head>
      <div className="relative h-svh">
        <div className="h-full w-full">
          {/* <img
            className="w-full h-full object-cover"
            src="https://plus.unsplash.com/premium_photo-1712866130915-df4bfaf0fc11?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFwJTIwc2NyZWVufGVufDB8fDB8fHww"
          /> */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d990.3365341377!2d3.6523790694856113!3d6.849045731106661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bdbdb4409cbb5%3A0x303fef9476c06de8!2sOlabisi%20Onabanjo%20University%20Teaching%20Hospital!5e0!3m2!1sen!2sng!4v1721940457248!5m2!1sen!2sng"
            className="w-full h-full border-none"
            allowfullscreen=""
            loading="lazy"
          ></iframe>
          {/* <MapContainer
            center={[latitude || 0, longitude || 0]}
            zoom={13}
            style={{ height: "100vh", width: "100%" }}
          >
          
            {latitude && longitude && (
              <Marker position={[latitude, longitude]}></Marker>
            )}
          </MapContainer> */}
        </div>

        <div className="flex  flex-col justify-center items-center text-white bg-[rgba(101,103,107,0.57)] rounded-2xl w-[26rem] md:w-[30rem]  h-[20rem] gap-4 backdrop-blur-sm absolute bottom-6 right-6">
          <SiGooglemaps className="text-[4rem] text-[#006A34]" />
          {currentUser ? (
            <>
              <p className="font-normal">Welcome back to Open State </p>
              <span className="font-semibold text-lg">
                Your Plus Code {currentUserPlusCode}
              </span>
            </>
          ) : (
            <>
              <p className="font-normal">Welcome back to Open State </p>
              <span className="font-semibold text-lg">
                Sign in to get your plus code
              </span>
            </>
          )}
          <span>Latitude of current location {latitude}</span>
          <span>Longitude of current location {longitude}</span>
        </div>
      </div>
    </>
  );
};

export default Map;

// import React from "react";
// import Head from "next/head";
// import { useEffect, useContext, useState, useRef, useMemo } from "react";
// import { GoogleMap, LoadScript } from "@react-google-maps/api";
// import { auth, db } from "@/utils/firebase";
// import { UserContext } from "@/store/user/user.context";
// import { collection, query, getDocs } from "firebase/firestore";
// import { SiGooglemaps } from "react-icons/si";
// import { MapContainer, TileLayer, Marker } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// const Map = ({ address }) => {
//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [status, setStatus] = useState("");
//   const [currentUserPlusCode, setCurrentUserPlusCode] = useState("");
//   const { currentUser } = useContext(UserContext);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         getPlusCode();
//         getLocation();
//       } else {
//         getLocation();
//       }
//     });
//   }, []);

//   const getPlusCode = async () => {
//     try {
//       const userQuery = query(
//         collection(db, "users", currentUser.uid, "additionalData")
//       );
//       const userQuerySnapshot = await getDocs(userQuery);

//       userQuerySnapshot.forEach((doc) => {
//         if (doc.data()) {
//           const userData = { id: doc.id, ...doc.data() };
//           console.log(userData.plusCode);
//           setCurrentUserPlusCode(userData.plusCode);
//         }
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const getLocation = async () => {
//     if (!navigator.geolocation) {
//       setStatus("Geolocation is not supported by your browser");
//     } else {
//       setStatus("Locating…");
//       navigator.geolocation.getCurrentPosition(success);
//     }
//   };

//   const success = (position) => {
//     setLatitude(position.coords.latitude);
//     setLongitude(position.coords.longitude);

//     setStatus("");
//   };

//   return (
//     <>
//       <Head></Head>
//       <div className="relative h-full">
//         <div className="h-[50rem] w-full">
//           <MapContainer
//             center={position}
//             zoom={13}
//             style={{ height: "100vh", width: "100%" }}
//           >
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
//             <Marker position={position}></Marker>
//           </MapContainer>
//         </div>

//         <div className="flex  flex-col justify-center items-center bg-transparent rounded-xl w-[30rem]  h-[20rem] gap-10 backdrop-blur-sm absolute bottom-6 right-6">
//           <SiGooglemaps className="text-[4rem] text-[#006A34]" />
//           {currentUser ? (
//             <p className="mb-8">
//               Welcome to Open State.{" "}
//               <span className="font-semibold text-lg">
//                 Your Plus Code {currentUserPlusCode}
//               </span>
//             </p>
//           ) : (
//             <p className="mb-4">
//               Welcome to Open State.{" "}
//               <span className="font-semibold text-lg">
//                 Sign in to get your plus code
//               </span>
//             </p>
//           )}
//           Latitude of current location {latitude} <br></br>Longitude of current
//           location {longitude}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Map;
