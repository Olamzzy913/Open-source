/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { SiGooglemaps } from "react-icons/si";
import Head from "next/head";
import Profile from "@/components/signup/additionalInfo";

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "@/utils/firebase";

const defaultFormFields = {
  name: "",
  email: "",
  phone: "",
  occupation: "",
  password: "",
};

const signUpform = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uid, setUid] = useState("");

  const handleToggle = () => {
    setShowPassword(!showPassword);
  };

  const [formFields, setFormFields] = useState(defaultFormFields);
  const { name, email, phone, occupation, password } = formFields;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formFields);
    setIsLoading(true);
    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      const userCredential = await createUserDocumentFromAuth(user, {
        name,
        email,
        phone,
        occupation,
      });
      const signUpUser = userCredential._key.path.segments;
      console.log(signUpUser[signUpUser.length - 1]);

      setUid(signUpUser[signUpUser.length - 1]);
      resetFormFields();
      setIsSigned(true);
      setIsLoading(false);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email already in use");
      } else {
        console.log("user creation encountered an error", error);
      }
    }
  };

  return (
    <>
      {" "}
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

        <title>New Account | Openstate</title>
      </Head>
      <Profile isSigned={isSigned} setIsSigned={setIsSigned} uid={uid} />
      <div className="flex justify-between items-center px-6 py-2">
        <Link href="/" className="flex items-center ">
          <SiGooglemaps className="text-[2rem] text-[#006A34]" />
          <h1 className="text-[1.6rem] font-medium leading-[1.6rem]">
            penstate
          </h1>
        </Link>
        <Link
          href="/signin"
          className="text-[1.2rem] font-medium hover:bg-[#006A34] rounded-full hover:text-white transition py-2 px-6"
        >
          Login
        </Link>
      </div>
      <div className="flex justify-center items-center mt-[7rem]">
        <div className="max-w-[30rem] w-full px-5 py-4 flex flex-col items-center justify-center">
          <h1 className="text-[2rem] font-semibold">Create New Account</h1>
          <p className="mb-10 text-[1rem] font-normal">
            Ensure to provide a valid data so as to avoid false record
          </p>
          <form className="w-full px-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              id="name"
              value={formFields.name}
              onChange={handleChange}
              class="block mb-6 py-4 px-8 w-full text-[1.2rem] text-gray-900 bg-transparent rounded-full border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#6A08CD] focus:outline-none focus:ring-0 focus:border-[#0826cd] peer"
              placeholder="Full Name "
              required
            />

            <input
              type="email"
              name="email"
              id="email"
              value={formFields.email}
              onChange={handleChange}
              class="block mb-6 py-4 px-8 w-full text-[1.2rem] text-gray-900 bg-transparent rounded-full border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#6A08CD] focus:outline-none focus:ring-0 focus:border-[#0826cd] peer"
              placeholder="Email "
              required
            />

            <input
              type="number"
              name="phone"
              id="phone"
              value={formFields.phone}
              onChange={handleChange}
              class="block mb-6 py-4 px-8 w-full text-[1.2rem] text-gray-900 bg-transparent rounded-full border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#6A08CD] focus:outline-none focus:ring-0 focus:border-[#0826cd] peer"
              placeholder="Phone Number"
              required
            />

            <input
              type="text"
              name="occupation"
              id="occupation"
              value={formFields.occupation}
              onChange={handleChange}
              class="block mb-6 py-4 px-8 w-full text-[1.2rem] text-gray-900 bg-transparent rounded-full border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#6A08CD] focus:outline-none focus:ring-0 focus:border-[#0826cd] peer"
              placeholder="Occupation "
              required
            />

            <input
              type="password"
              name="password"
              id="password"
              value={formFields.password}
              onChange={handleChange}
              class="block mb-6 py-4 px-8 w-full text-[1.2rem] text-gray-900 bg-transparent rounded-full border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#6A08CD] focus:outline-none focus:ring-0 focus:border-[#0826cd] peer"
              placeholder="Password "
              required
            />

            <button
              type="submit"
              className="text-white py-4 px-8 w-full bg-[#006A34] hover:bg-[#006a33de] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-[1.1rem] text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {isLoading ? (
                <div className="loader mx-auto"></div>
              ) : (
                <span v-else>Submit</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default signUpform;
