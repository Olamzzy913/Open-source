import { useEffect, useState } from "react";

const IsLoading = ({ loading }) => {
  return (
    <>
      <div
        className={
          loading
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

          <div className="inline-block float-middle align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="py-8 text-left px-[3rem]">
              <div className="flex flex-col justify-center items-center gap-10">
                <div className="loader2"></div>
                <p>Searcging for Plus code details provided.....</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IsLoading;
