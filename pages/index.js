/*eslint-disable*/
import { useEffect, useContext, useState } from "react";
import Head from "next/head";
import { auth, db, signOutUser } from "@/utils/firebase";
import { FaSearch } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import { collection, query, getDocs } from "firebase/firestore";
import { UserContext } from "@/store/user/user.context";
import { LoadingContext } from "@/store/isLoading/loadingMessage";
import { ToggleContext } from "@/store/dataFound/toggle.context";
import Link from "next/link";
import FetchData from "@/components/search/searchData";
import Map from "@/components/map/map";
import IsLoading from "@/components/isloading/isLoading";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [searchResult, setSearchResult] = useState(false);
  const { currentUser } = useContext(UserContext);
  const { setLoadingMessage } = useContext(LoadingContext);
  const { setToggle } = useContext(ToggleContext);

  useEffect(() => {
    console.log(currentUser);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsActive(user.email);
        console.log(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const signOutHandler = async () => {
    await signOutUser();
    setIsActive(null);
  };

  const getUserLocationData = async () => {
    console.log("Searching.......");
    setLoadingMessage("Searching for all detail on this plus code");

    try {
      console.log(search);
      const allUsers = [];
      const allUserUid = query(collection(db, "users"));
      const userQuerySnapshotUserUid = await getDocs(allUserUid);

      userQuerySnapshotUserUid.forEach((doc) => {
        if (doc.data()) {
          const user = { id: doc.id, ...doc.data() };
          allUsers.push(user);
        }
      });
      console.log(allUsers);

      await Promise.all(
        allUsers.map(async (user) => {
          const userQuery = query(
            collection(db, "users", user.id, "additionalData")
          );
          const userQuerySnapshot = await getDocs(userQuery);

          userQuerySnapshot.forEach((doc) => {
            if (doc.data()) {
              const userData = { id: doc.id, ...doc.data() };
              console.log(userData.plusCode);
              if (search === userData.plusCode) {
                console.log("Found.......");
                setSearchData(userData);
                console.log(userData.plusCode);
              }
            }
          });
        })
      );

      setSearchResult(true);
      setToggle(true);
      console.log("Done.......");
      setLoadingMessage("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <FetchData
        searchData={searchData}
        setSearchData={setSearchData}
        setSearchResult={setSearchResult}
        searchResult={searchResult}
      />
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
        />
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />

        {search ? (
          <title>{search} | Openstate</title>
        ) : (
          <title>Openstate</title>
        )}
      </Head>
      <IsLoading loading={loading} />
      <div className="relative max-h-svh">
        <div className="flex justify-between items-center w-[30rem] sm:w-[50rem] md:w-[70rem]  lg:w-[100rem] px-4 sm:px-6 py-2 absolute top-[2rem] transform -translate-x-1/2 left-1/2 z-30 bg-white shadow-lg rounded-full">
          <Link href="/" className=" items-center hidden sm:flex">
            <SiGooglemaps className="text-[2rem] text-[#006A34]" />
            <h1 className=" text-[1.2rem] font-medium leading-[1.3rem]">
              penstate
            </h1>
          </Link>
          <div
            className={
              !search
                ? "flex items-center justify-between sm:gap-8 py-4 px-8 w-[22rem] md:w-[50rem] rounded-full border border-gray-300 "
                : "flex items-center justify-between sm:gap-8 py-[0.625rem] px-8 w-[22rem] md:w-[50rem] rounded-full border border-gray-300 "
            }
          >
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="block text-[1.2rem] w-[80%] text-gray-900 bg-transparent appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#6A08CD] focus:outline-none focus:ring-0 focus:border-[#0826cd] peer"
              placeholder="Search with Plus Code "
            />
            {search && (
              <FaSearch
                onClick={getUserLocationData}
                className="py-0 sm:py-2 px-2 bg-[#145524] text-white cursor-pointer rounded-full h-[2.6rem] text-[2.5rem] "
              />
            )}
          </div>
          {isActive ? (
            <button
              onClick={signOutHandler}
              className="text-[1.12rem] sm:text-[1.2rem] font-medium hover:bg-[#006A34] rounded-full hover:text-white transition py-2 px-3 sm:px-6"
            >
              Log Out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-[1.2rem] font-medium hover:bg-[#006A34] rounded-full hover:text-white transition py-2 px-3 sm:px-6"
            >
              Sign in
            </Link>
          )}
        </div>
        <Map searchData={searchData} searchResult={searchResult} />
        {/* {searchResult && (
          <SiGooglemaps
            onClick={() => {
              setSearchResult(true);
            }}
            className="text-[4rem] mx-auto mt-10 cursor-pointer text-[#006A34]"
          />
        )} */}
      </div>
    </>
  );
};

export default Home;
