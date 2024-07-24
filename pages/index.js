import {  useState } from "react";
import Head from "next/head";
import { auth, db, signOutUser } from "@/utils/firebase";
import { FaSearch } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
import Link from "next/link";
import FetchData from "@/components/search/searchData";
import Map from "@/components/map/map";
import IsLoading from "@/components/isloading/isLoading";

export default function Home() {
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [searchResult, setSearchResult] = useState(false);

  

  const getUserLocationData = async () => {
    console.log("Searching.......");
    setLoading(true);
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
      console.log("Done.......");
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <FetchData
        searchData={searchData}
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

        <title>Openstate</title>
      </Head>
      <IsLoading loading />
      <div className="flex relative justify-between items-center px-6 py-2">
        <Link href="/" className="flex items-center ">
          <SiGooglemaps className="text-[2rem] text-[#006A34]" />
          <h1 className="text-[1.6rem] font-medium leading-[1.6rem]">
            penstate
          </h1>
        </Link>
        <div className="md:flex hidden items-center justify-between gap-8 py-4 px-8 w-[32rem] md:w-[50rem] rounded-full border border-gray-300 ">
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="block text-[1.2rem] w-[28rem] md:w-[40rem] text-gray-900 bg-transparent appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#6A08CD] focus:outline-none focus:ring-0 focus:border-[#0826cd] peer"
            placeholder="Search with Plus Code "
          />
          {search && (
            <FaSearch
              onClick={getUserLocationData}
              className="py-2 px-2 bg-[#145524] text-[#0e0d0d] cursor-pointer rounded-full text-[2.5rem]"
            />
          )}
        </div>
        <button
          onClick={signOutUser}
          className="text-[1.2rem] font-medium hover:bg-[#006A34] rounded-full hover:text-white p-4"
        >
          Log Out
        </button>
      </div>
      <div className="md:hidden align-middle mx-auto flex items-center justify-between gap-8 py-4 px-8 w-[32rem] md:w-[50rem] rounded-full border border-gray-300 ">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="block text-[1.2rem] w-[28rem] md:w-[40rem] text-gray-900 bg-transparent appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#6A08CD] focus:outline-none focus:ring-0 focus:border-[#0826cd] peer"
          placeholder="Search with Plus Code "
        />
        {search && (
          <FaSearch
            onClick={getUserLocationData}
            className="py-2 px-2 bg-[#145524] text-[#0e0d0d] cursor-pointer rounded-full text-[2.5rem]"
          />
        )}
      </div>
      <Map className="mx-auto" />
      {searchData && (<SiGooglemaps
        onClick={() => {
          setSearchResult(true);
        }}
        className="text-[4rem] mx-auto mt-10 cursor-pointer text-[#006A34]"
      />)}
    </>
  );
}
