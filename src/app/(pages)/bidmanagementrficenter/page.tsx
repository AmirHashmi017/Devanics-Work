'use client';
import React, { useState } from 'react';
import tabsData from './tabs.json';
import convenienceStore from './data.json';
import MessageComponent from './MessageComponent';

// module imports
import Button from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import PrimaryHeading from '@/app/component/headings/primary';
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from '@material-tailwind/react';
import Modal from './modal';

const BidManagementRFICenter = () => {
  const [activeTab, setActiveTab] = React.useState('rfi-center');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-cloudWhite2 grid place-items-center mt-7">
        <section className="bg-white shadow-md w-full px-10">
          <div className="container mx-auto px-6">
            <div className="px-2 py-4 flex justify-between items-center">
              <div className="grid items-center">
                <PrimaryHeading title="Seabreeza Village comercial Developemnst - convenience store" />
                <div className="text-gray-500 pe-4 flex justify-start items-center space-x-4">
                  <p className="flex p-font-size">
                    Creation Date: 05/22/2023 @ 06:37 AM
                  </p>
                  <p className="flex p-font-size">
                    Bid Date: 06/05/2023 12:00 AM EST
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  text="Submit a bid"
                  className="whitespace-nowrap !p-[12px] mx-2"
                  type="submit"
                  onClick={openModal}
                />
              </div>
            </div>
            <div>
              <Tabs value={activeTab}>
                <TabsHeader
                  className="rounded-none bg-transparent p-0 space-x-4"
                  indicatorProps={{
                    className:
                      'bg-transparent-2 border-gray-900 shadow-none rounded-none',
                  }}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {tabsData.map((tab, index) => (
                    <Tab
                      key={index}
                      value={
                        tab.value !== undefined ? tab.value?.toString() : ''
                      }
                      onClick={() =>
                        setActiveTab(
                          tab.value !== undefined ? tab.value.toString() : ''
                        )
                      }
                      className={
                        activeTab === tab.value
                          ? 'whitespace-nowrap width-xl height-xl foundation-primary-700'
                          : 'whitespace-nowrap width-xl height-xl'
                      }
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {tab.label}
                    </Tab>
                  ))}
                </TabsHeader>
                <TabsBody
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  className="hidden"
                >
                  {tabsData.map((tab, index) => (
                    <TabPanel
                      key={index}
                      value={tab.value !== undefined ? tab.value : ''}
                    >
                      {tab.label}
                    </TabPanel>
                  ))}
                </TabsBody>
              </Tabs>
            </div>
          </div>
        </section>

        <section className="w-11/12 lg:w-95 mt-5 rounded-md">
          <div className="container mx-auto p-5">
            <section className="w-12/12 lg:w-95">
              <div className="container mx-auto">
                {tabsData.map(
                  ({ value, label }) =>
                    activeTab === value && (
                      <>
                        <div className="flex items-center justify-between">
                          <h4 className="text-gray-700 gap-6">{label}</h4>

                          <div className="flex items-center">
                            <WhiteButton
                              text="Export"
                              className="whitespace-nowrap !p-[12px] mx-2"
                              type="submit"
                            />
                            <Button
                              text="Send an RFI"
                              className="whitespace-nowrap !p-[12px] mx-2"
                              type="submit"
                              icon={
                                <svg
                                  className="h-5 w-5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="12" y1="5" x2="12" y2="19" />
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                              }
                            />
                          </div>
                        </div>
                        <div className="lg:col-span-5 mt-5">
                          {convenienceStore.map((item, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-lg cosmicGray mb-5 px-3.5"
                            >
                              <MessageComponent
                                title={item.title}
                                posted={item.posted}
                                messageType={item.messageType}
                                description={item.description}
                                openModal={openModal}
                                chatType={item.chatType}
                                chatIcon={item.chatIcon}
                              />
                              {item.chatType === 'Edit' && (
                                <>
                                  <div className="w-full h-0.5 bg-mistyWhite"></div>
                                  <MessageComponent
                                    title={item.title}
                                    posted={item.posted}
                                    messageType={item.messageType}
                                    description={item.description}
                                    openModal={openModal}
                                    chatType={item.chatType}
                                    chatIcon={item.chatIcon}
                                  />
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
      {isModalOpen && <Modal onClose={closeModal} />}
    </>
  );
};

export default BidManagementRFICenter;
