// 'use client';
// import Button from '@/app/component/customButton/button';
// import WhiteButton from "@/app/component/customButton/white";
// import React, { useState } from 'react';

// // module imports

// const EmailModal = () => {

//     return (
//         <>
//             <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
//                 <div className="bg-white rounded-lg max-w-l w-ful">
//                     <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
//                         {/* <!-- Modal header --> */}
//                         <div className="flex items-center justify-between md:p-3 border-b rounded-t dark:border-gray-600 cosmicGray">
//                             <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Email</h3>
//                             <button type="button" className="end-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
//                                 <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
//                                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
//                                 </svg>
//                                 <span className="sr-only">Close modal</span>
//                             </button>
//                         </div>
//                         {/* <!-- Modal body --> */}
//                         <div className="p-4 md:p-5">
//                             <form className="space-y-4" action="#">
//                                 <div className="flex items-center border border-gray-300 rounded-lg">
//                                     <div className="text-sm font-medium cosmicGray p-2 rounded-l-md"><span>To</span></div>
//                                     <div><input type="email" className="text-sm font-medium ms-2 flex-grow border-none focus:outline-none text-gray-400" placeholder="Type an email" /></div>
//                                 </div>

//                                 <div className="col-span-2 flex flex-col border border-gray-300 rounded-lg">
//                                     <label htmlFor="description" className="text-sm font-medium text-gray-500 dark:text-white p-2">Subject</label>
//                                     <textarea id="description" rows={4} className="block p-2.5 w-full text-sm text-gray-400 border-t border-gray-300 focus:ring-gray-300 focus:border-gray-300 dark:bg-gray-500 dark:border-gray-300 dark:placeholder-gray-300 dark:text-white focus:outline-none" placeholder="Enter description"></textarea>
//                                 </div>

//                                 <div className="flex items-center">
//                                     <label
//                                         htmlFor="dropzone-file"
//                                         className='flex items-center justify-center w-22 h-22 border-2 border-dotted rounded-lg cursor-pointer dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
//                                     >
//                                         <div className="flex items-center justify-center p-3">
//                                             <svg className="h-8 w-8 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <polyline points="16 16 12 12 8 16" />  <line x1="12" y1="12" x2="12" y2="21" />  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />  <polyline points="16 16 12 12 8 16" /></svg>
//                                         </div>
//                                         <span className="ml-2 grid whitespace-nowrap">Select a file or drag and drop here</span>
//                                         <span className="ml-2 underline text-lavenderPurple">Browse</span>
//                                         <input
//                                             id="dropzone-file"
//                                             onChange={(e: any) => { const file = e.target.files[0]; }}
//                                             type="file" style={{ opacity: '0' }} accept="image/*"
//                                         />
//                                     </label>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <WhiteButton text='Setting' type='submit' className='cosmicGray foundation-primary-700 whitespace-nowrap' />
//                                     </div>
//                                     <div className="flex items-center space-x-3">
//                                         <WhiteButton text='Cancel' type='submit' className='whitespace-nowrap' />
//                                         <Button text='Send Email' type='submit' className="whitespace-nowrap" />
//                                     </div>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </>
//     );
// };

// export default EmailModal;

'use client';
import Button from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import React from 'react';

// module imports

const EmailModal = () => {
  return (
    <>
      <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg max-w-l w-ful">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between md:p-3 border-b rounded-t dark:border-gray-600 cosmicGray">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Email
              </h3>
              <button
                type="button"
                className="end-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal"
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
              <form className="space-y-4" action="#">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <div className="text-sm font-medium cosmicGray p-2 rounded-l-md">
                    <span>To</span>
                  </div>
                  <div>
                    <input
                      type="email"
                      className="text-sm font-medium ms-2 flex-grow border-none focus:outline-none text-gray-400"
                      placeholder="Type an email"
                    />
                  </div>
                </div>

                <div className="flex items-center border border-gray-300 rounded-lg">
                  <div className="text-sm font-medium cosmicGray p-2 rounded-l-md">
                    <span>CC</span>
                  </div>
                  <div>
                    <input
                      type="email"
                      className="text-sm font-medium ms-2 flex-grow border-none focus:outline-none text-gray-400"
                      placeholder="Type an email"
                    />
                  </div>
                </div>

                <div className="col-span-2 flex flex-col border border-gray-300 rounded-lg">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-500 dark:text-white p-2"
                  >
                    Subject
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-400 border-t border-gray-300 focus:ring-gray-300 focus:border-gray-300 dark:bg-gray-500 dark:border-gray-300 dark:placeholder-gray-300 dark:text-white focus:outline-none"
                    placeholder="Enter description"
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <label
                    htmlFor="dropzone-file"
                    className="flex items-center justify-center w-22 h-22 border-2 border-dotted rounded-lg cursor-pointer dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center justify-center p-3">
                      <svg
                        className="h-8 w-8 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        {' '}
                        <polyline points="16 16 12 12 8 16" />{' '}
                        <line x1="12" y1="12" x2="12" y2="21" />{' '}
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />{' '}
                        <polyline points="16 16 12 12 8 16" />
                      </svg>
                    </div>
                    <span className="ml-2 grid whitespace-nowrap">
                      Select a file or drag and drop here
                    </span>
                    <span className="ml-2 underline text-lavenderPurple">
                      Browse
                    </span>
                    <input
                      id="dropzone-file"
                      // onChange={(e: any) => {
                      //   const file = e.target.files[0];
                      // }}
                      type="file"
                      style={{ opacity: '0' }}
                      accept="image/*"
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <WhiteButton
                      text="Setting"
                      type="submit"
                      className="cosmicGray foundation-primary-700 whitespace-nowrap"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <WhiteButton
                      text="Cancel"
                      type="submit"
                      className="whitespace-nowrap"
                    />
                    <Button
                      text="Send Email"
                      type="submit"
                      className="whitespace-nowrap"
                    />
                  </div>
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
