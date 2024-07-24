import { useEffect, useState, useRef } from "react";
import { db } from "@/utils/firebase";
import { useRouter } from "next/router";
import generateCode from "@/utils/genratePlusCode";
import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  getDocs,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Profile = ({ isSigned, setIsSigned, uid }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const storage = getStorage();
  const router = useRouter();
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [selectedImage3, setSelectedImage3] = useState(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);
  const [provided, setProvided] = useState(false);
  const [landMark, setLandMark] = useState("");
  const [houseName, setHouseName] = useState("");
  const [houseType, setHouseType] = useState("");
  const [nature, setNature] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleButtonClick1 = () => {
    fileInputRef1.current.click();
  };

  const handleButtonClick2 = () => {
    fileInputRef2.current.click();
  };

  const handleButtonClick3 = () => {
    fileInputRef3.current.click();
  };

  const handleFileChange1 = (event) => {
    const file1 = event.target.files[0];
    if (file1) {
      setFile1(file1);
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage1(reader.result);
      };
      reader.readAsDataURL(file1);
    }
    console.log(file1);
  };

  const handleFileChange2 = (event) => {
    const file2 = event.target.files[0];
    if (file2) {
      setFile2(file2);
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage2(reader.result);
      };
      reader.readAsDataURL(file2);
    }
    console.log(file2);
  };

  const handleFileChange3 = (event) => {
    const file3 = event.target.files[0];
    if (file3) {
      setFile3(file3);
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage3(reader.result);
      };
      reader.readAsDataURL(file3);
    }
    console.log(file3);
  };

  const handleSubmit = async () => {
    setProvided(!provided);
    getLocation();
  };

  const [status, setStatus] = useState("");

  const getLocation = () => {
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

  const handleDataUpload = async () => {
    setIsLoading(true);
    let imageUrl1 = null;
    let imageUrl2 = null;
    let imageUrl3 = null;
    if (file1) {
      // Upload the image to Firebase Storage
      try {
        const fileName1 = `${new Date().getTime()}_${file1.name}`;
        const storageRef1 = ref(storage, `images/${fileName1}`);
        const snapshot1 = await uploadBytes(storageRef1, file1);
        imageUrl1 = await getDownloadURL(snapshot1.ref);

        const fileName2 = `${new Date().getTime()}_${file2.name}`;
        const storageRef2 = ref(storage, `images/${fileName2}`);
        const snapshot2 = await uploadBytes(storageRef2, file2);
        imageUrl2 = await getDownloadURL(snapshot2.ref);

        const fileName3 = `${new Date().getTime()}_${file3.name}`;
        const storageRef3 = ref(storage, `images/${fileName3}`);
        const snapshot3 = await uploadBytes(storageRef3, file3);
        imageUrl3 = await getDownloadURL(snapshot3.ref);
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
        alert("Failed to upload file. Please try again.");
        return;
      }
    }
    const id = generateCode();
    const data = {
      houseName,
      houseType,
      landMark,
      plusCode: id,
      latitude,
      longitude,
      nature,
      imageUrl1,
      imageUrl2,
      imageUrl3,
    };
    console.log(uid);
    try {
      console.log(data);
      // await setDoc(doc(db, "users", uid), data);
      await addDoc(collection(db, "users", uid, "additionalData"), data);
      router.push("/signin");
    } catch (error) {
      console.log(error);
    }

    setLandMark("");
    setIsLoading(false);
    setHouseType("");
    setNature("");
    setHouseName("");
    setSelectedImage1(null);
    setSelectedImage2(null);
    setSelectedImage3(null);
    setFile1(null);
    setFile2(null);
    setFile3(null);
  };

  return (
    <>
      <div
        className={
          isSigned
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

          {!provided ? (
            <div className="inline-block float-middle align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:max-w-[46rem] sm:max-w-lg sm:w-full">
              <div className="py-8 text-left px-6">
                <div className="flex justify-between items-center pb-4">
                  <p className="text-2xl font-bold">Additional Resident Data</p>
                  <div className="modal-close cursor-pointer z-50">
                    <button
                      type="button"
                      className="end-2.5 cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => {
                        setIsSigned(!isSigned);
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
                  <input
                    type="text"
                    name="landMark"
                    value={landMark}
                    onChange={(e) => {
                      setLandMark(e.target.value);
                    }}
                    placeholder="Nearest Land Mark"
                    className="mx-auto p-3 mt-[2rem] w-[25rem] outline-none border rounded-xl text-[1.15rem] focus:outline-none focus:border-indigo-300"
                  />

                  <input
                    type="text"
                    name="houseName"
                    value={houseName}
                    onChange={(e) => {
                      setHouseName(e.target.value);
                    }}
                    placeholder="House Name e.g family own residence"
                    className="mx-auto p-3 mt-[2rem] w-[25rem] outline-none border rounded-xl text-[1.15rem] focus:outline-none focus:border-indigo-300"
                  />

                  <input
                    type="text"
                    name="houseType"
                    value={houseType}
                    onChange={(e) => {
                      setHouseType(e.target.value);
                    }}
                    placeholder="House Type e.g duples"
                    className="mx-auto p-3 mt-[2rem] w-[25rem] outline-none border rounded-xl text-[1.15rem] focus:outline-none focus:border-indigo-300"
                  />

                  <input
                    type="text"
                    name="nature"
                    value={nature}
                    onChange={(e) => {
                      setNature(e.target.value);
                    }}
                    placeholder="Nature of building e.g Residential/Business apartment"
                    className="mx-auto p-3 mt-[2rem] w-[25rem] outline-none border rounded-xl text-[1.15rem] focus:outline-none focus:border-indigo-300"
                  />

                  <button
                    onClick={() => {
                      handleSubmit();
                    }}
                    className="px-[2rem] mx-auto py-[1rem] bg-[#006A34] text-white rounded-xl hover:bg-[#235f40] w-[9rem]"
                  >
                    {isLoading ? (
                      <div className="loader mx-auto"></div>
                    ) : (
                      <span v-else>Proceed</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="inline-block float-middle align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:max-w-[50rem] sm:max-w-lg sm:w-full">
              <div className="py-8 text-left px-6 flex flex-col justify-center">
                <div className="flex justify-between items-center pb-4">
                  <p className="text-2xl font-bold">Upload Residence Images</p>
                  <div className="modal-close cursor-pointer z-50">
                    <button
                      type="button"
                      className="end-2.5 cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => {
                        setIsSigned(!isSigned);
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {selectedImage1 ? (
                    <img
                      src={selectedImage1}
                      className="w-[14rem] h-[14rem] mx-auto object-cover border-indigo-300 border rounded-xl"
                    />
                  ) : (
                    <div
                      onClick={handleButtonClick1}
                      className="w-[14rem] rounded-xl text-[1rem] flex items-center justify-center h-[14rem] mx-auto border-indigo-300 border hover:bg-[#006A34] hover:text-white transition-all duration-400"
                    >
                      Click to select Image
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef1}
                    style={{ display: "none" }}
                    onChange={handleFileChange1}
                  />

                  {selectedImage2 ? (
                    <img
                      src={selectedImage2}
                      className="w-[14rem] h-[14rem] mx-auto object-cover border-indigo-300 border rounded-xl"
                    />
                  ) : (
                    <div
                      onClick={handleButtonClick2}
                      className="w-[14rem] rounded-xl text-[1rem] flex items-center justify-center h-[14rem] mx-auto border-indigo-300 border hover:bg-[#006A34] hover:text-white transition-all duration-400"
                    >
                      Click to select Images
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef2}
                    style={{ display: "none" }}
                    onChange={handleFileChange2}
                  />

                  {selectedImage3 ? (
                    <img
                      src={selectedImage3}
                      className="w-[14rem] h-[14rem] mx-auto object-cover border-indigo-300 border rounded-xl"
                    />
                  ) : (
                    <div
                      onClick={handleButtonClick3}
                      className="w-[14rem] rounded-xl text-[1rem] flex items-center justify-center h-[14rem] mx-auto border-indigo-300 border hover:bg-[#006A34] hover:text-white transition-all duration-400"
                    >
                      Click to select Images
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef3}
                    style={{ display: "none" }}
                    onChange={handleFileChange3}
                  />
                </div>
                <button
                  onClick={() => {
                    handleDataUpload();
                  }}
                  className="px-[2rem] mx-auto mt-10 py-[1rem] bg-[#006A34] text-white rounded-xl hover:bg-[#235f40] w-[9rem]"
                >
                  {isLoading ? (
                    <div className="loader mx-auto"></div>
                  ) : (
                    <span v-else>Submit</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
