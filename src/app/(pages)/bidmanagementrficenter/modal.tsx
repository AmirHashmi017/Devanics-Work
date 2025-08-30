'use client';
import Button from '@/app/component/customButton/button';
import React, { useState } from 'react';

// module imports

// Define the props interface
interface ModalProps {
  onClose: () => void;
}

const EmailModal: React.FC<ModalProps> = ({ onClose }) => {
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');

  const handleToEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToEmail(e.target.value);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSubject(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Send email logic here
  };

  const [selectedOption, setSelectedOption] = useState('public'); // Initial state is set to 'public'

  const handleSelectedOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between md:p-3 border-b rounded-t dark:border-gray-600 cosmicGray bg-cosmicGray">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                RFI
              </h3>
              <button
                type="button"
                className="end-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal"
                onClick={onClose}
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
            {/* <!-- Modal body --> */}
            <div className="p-4 md:p-5">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="text-sm font-medium cosmicGray">
                  <span>Title</span>
                </div>
                <div className="flex flex-col border border-gray-300 rounded-lg mt-1">
                  <div className="items-center">
                    <input
                      type="text"
                      className="text-sm font-medium ms-2 flex-grow border-none focus:outline-none text-gray-400 p-2.5 py-3.5"
                      value={toEmail}
                      onChange={handleToEmailChange}
                      placeholder="Enter title"
                    />
                  </div>
                </div>

                <div className="text-sm font-medium cosmicGray">
                  <span>Description</span>
                </div>
                <div className="flex flex-col border border-gray-300 rounded-lg mt-1">
                  <textarea
                    id="description"
                    rows={4}
                    className="block p-2.5 py-3.5 w-full text-sm text-gray-400s focus:ring-gray-300 focus:border-gray-300 dark:bg-gray-500 dark:border-gray-300 dark:placeholder-gray-300 dark:text-white focus:outline-none border border-gray-300 rounded-lg"
                    value={subject}
                    onChange={handleSubjectChange}
                    placeholder="Write description"
                  ></textarea>
                </div>

                <div className="text-sm font-medium cosmicGray">
                  <span>Type</span>
                </div>
                <div className="flex justify-start items-center space-x-8">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="public"
                      checked={selectedOption === 'public'}
                      onChange={handleSelectedOptionChange}
                      className="hidden"
                    />
                    <div
                      className={`relative w-5 h-5 rounded-full border-2 border-purple-600 bg-purple-200 flex-shrink-0 cursor-pointer ${selectedOption === 'public' ? 'ring-2 ring-purple-600' : ''}`}
                    >
                      {selectedOption === 'public' && (
                        <div className="w-full h-full bg-purple-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm text-purple-800">Public</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="private"
                      checked={selectedOption === 'private'}
                      onChange={handleSelectedOptionChange}
                      className="hidden"
                    />
                    <div
                      className={`relative w-5 h-5 rounded-full border-2 border-purple-600 bg-purple-200 flex-shrink-0 cursor-pointer ${selectedOption === 'private' ? 'ring-2 ring-purple-600' : ''}`}
                    >
                      {selectedOption === 'private' && (
                        <div className="w-full h-full bg-purple-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm text-purple-800">Private</span>
                  </label>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="items-center">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-22 h-22 border-2 border-dashed rounded-lg cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center p-5">
                        <svg
                          className="w-6 h-6 mb-3 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          Drop your image here, or{' '}
                          <span className="font-semibold text-purple-600">
                            browse
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, GIF, JPG, Max size: 2MB
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        style={{ opacity: '0' }}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    text="Send"
                    type="submit"
                    className="whitespace-nowrap"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailModal;
