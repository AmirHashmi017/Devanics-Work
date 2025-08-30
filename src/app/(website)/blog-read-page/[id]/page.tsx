'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../navbar';
import Image from 'next/image';
import Footer from '../../footer';
import blogsData from '@/app/constants/blogs.json';
import Link from 'next/link';

export default function Blogs() {
  const { id } = useParams();
  const [blogData, setBlogData] = useState<any>({});

  useEffect(() => {
    const findBlog = blogsData.find((blog: any) => blog.key == id);
    setBlogData(findBlog);
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="w-full">
        <div className="bg-[url('/blogs-img/artical.png')] bg-cover bg-center bg-no-repeat w-full ">
          <div className="container">
            <div className="pt-[499px] px-4 lg:px-0">
              <h1 className="font-Gilroy font-bold text-[24px] md:text-[60px] tracking-[-2px] text-[#161C2D] md:leading-[65px]">
                {blogData.title}
              </h1>
              <p className="font-Gilroy font-normal text-[14px] md:text-[16px] pt-4 text-[#555B6D] md:leading-[32px]">
                {blogData.date}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[44px]">
        <div className="container">
          <div className="w-full max-w-[998px] flex gap-6 px-4 lg:px-0">
            <div className="w-full max-w-[72px]">
              <div className="flex flex-col w-8 gap-2">
                <Link
                  href="https://x.com/schestitech?s=21"
                  className="cursor-pointer "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/blogs-img/Social2.svg"
                    alt=""
                    height={32}
                    width={32}
                  />
                </Link>
                <Link
                  href="https://www.facebook.com/people/Schesti-Technologies/61563918897388/?mibextid=kFxxJD&rdid=DE1M3ERYzkc3fefQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F65Z2ZQLrnZSKh4Eb%2F%3Fmibextid%3DkFxxJD"
                  className="cursor-pointer "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/blogs-img/Social1.svg"
                    alt=""
                    height={32}
                    width={32}
                  />
                </Link>
                <Link
                  href="https://www.instagram.com/schesti.technologies/?igsh=MW5zOGRqZW0xMWFhMg%3D%3D"
                  className="cursor-pointer "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/blogs-img/Social3.svg"
                    alt=""
                    height={32}
                    width={32}
                  />
                </Link>

                <Link
                  href="https://www.linkedin.com/posts/schesti_schesti-constructionmanagement-projectmanagement-activity-7240798897957150720-G07_/"
                  className="cursor-pointer "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/blogs-img/Social5.svg"
                    alt=""
                    height={32}
                    width={32}
                  />
                </Link>
              </div>
            </div>

            <div className="w-full max-w-[901px]">
              <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                {blogData.intro}
              </p>
              {/* Commom Data  */}
              {/* Heading 1 */}
              {blogData.heading1 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading1}
                </p>
              )}
              {blogData.paragraph1 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph1}
                </p>
              )}
              {blogData.benefits1 && blogData.benefits1.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.benefits1.map((benefit: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy text-[14px] md:text-[18px] text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
              {/* basics blog 9 */}
              {blogData.basics && blogData.basics.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.basics.map((requirement: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {requirement}
                    </li>
                  ))}
                </ul>
              )}
              {/* Image Blog */}
              {blogData.img && (
                // <div className="rounded-[24px] pb-8">
                //   <Image src={blogData.img} alt="" width={901} height={318} />
                // </div>
                <div
                  className="w-full overflow-hidden relative"
                  style={{ height: '30vh' }}
                >
                  <Image
                    layout="fill"
                    objectFit="contain"
                    src={blogData.img}
                    alt="adf"
                  />
                </div>
              )}

              {/* Heading 2 */}
              {blogData.heading2 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading2}
                </p>
              )}
              {blogData.paragraph2 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph2}
                </p>
              )}
              {blogData.benefits2 && blogData.benefits2.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.benefits2.map((benefit: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy text-[14px] md:text-[18px] text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}

              {/* importancePoints blog 6 */}
              {blogData.importancePoints &&
                blogData.importancePoints.length > 0 && (
                  <ul className="pl-5 list-disc">
                    {blogData.importancePoints.map(
                      (requirement: string, index: number) => (
                        <li
                          key={index}
                          className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                        >
                          {requirement}
                        </li>
                      )
                    )}
                  </ul>
                )}
              {/* Heading 3 */}
              {blogData.heading3 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading3}
                </p>
              )}
              {blogData.paragraph3 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph3}
                </p>
              )}
              {blogData.benefits3 && blogData.benefits3.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.benefits3.map((benefit: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy text-[14px] md:text-[18px] text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
              {/* details1 blog 9 */}
              {/* {blogData.details1 && blogData.details1.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.details1.map(
                    (requirement: string, index: number) => (
                      <li
                        key={index}
                        className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                      >
                        {requirement}
                      </li>
                    )
                  )}
                </ul>
              )} */}
              {/* importancePoints blog 6 */}
              {blogData.importancePoints &&
                blogData.importancePoints.length > 0 && (
                  <ul className="pl-5 list-disc">
                    {blogData.importancePoints.map(
                      (requirement: string, index: number) => (
                        <li
                          key={index}
                          className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                        >
                          {requirement}
                        </li>
                      )
                    )}
                  </ul>
                )}
              {/* requirementsList */}
              {blogData.requirementsList &&
                blogData.requirementsList.length > 0 && (
                  <ul className="pl-5 list-disc">
                    {blogData.requirementsList.map(
                      (requirement: string, index: number) => (
                        <li
                          key={index}
                          className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                        >
                          {requirement}
                        </li>
                      )
                    )}
                  </ul>
                )}

              {/* Heading 4 */}
              {blogData.heading4 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading4}
                </p>
              )}
              {/* Image Blog */}
              {blogData.img2 && (
                <div className="rounded-[24px] pb-8">
                  <Image src={blogData.img2} alt="" width={901} height={1400} />
                </div>
              )}
              {/* Image Blog */}
              {blogData.img3 && (
                <div className="rounded-[24px] pb-8">
                  <Image src={blogData.img3} alt="" width={901} height={1400} />
                </div>
              )}
              {blogData.paragraph4 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph4}
                </p>
              )}
              {/* causes blog 8 */}
              {blogData.causes && blogData.causes.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.causes.map((requirement: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {requirement}
                    </li>
                  ))}
                </ul>
              )}
              {blogData.benefits4 && blogData.benefits4.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.benefits4.map((benefit: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy text-[14px] md:text-[18px] text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
              {/* details2 blog 9 */}
              {/* {blogData.details2 && blogData.details2.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.details2.map(
                    (requirement: string, index: number) => (
                      <li
                        key={index}
                        className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                      >
                        {requirement}
                      </li>
                    )
                  )}
                </ul>
              )} */}
              {/* Specific requirements blog 6 */}
              {blogData.specificRequirements &&
                Object.keys(blogData.specificRequirements).length > 0 && (
                  <ul className="pl-5 list-disc">
                    {Object.entries(blogData.specificRequirements).map(
                      ([key, value]: any, index) => (
                        <li
                          key={index}
                          className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                        >
                          <strong>{key}:</strong> {value}
                        </li>
                      )
                    )}
                  </ul>
                )}

              {/* Heading 5 */}
              {blogData.heading5 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading5}
                </p>
              )}
              {/* stepss blog 8 */}
              {blogData.stepss && blogData.stepss.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.stepss.map((requirement: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {requirement}
                    </li>
                  ))}
                </ul>
              )}

              {blogData.paragraph5 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph5}
                </p>
              )}
              {/* Keys blog 6 */}
              {blogData.keyPoints && blogData.keyPoints.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.keyPoints.map(
                    (requirement: string, index: number) => (
                      <li
                        key={index}
                        className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                      >
                        {requirement}
                      </li>
                    )
                  )}
                </ul>
              )}
              {blogData.benefits5 && blogData.benefits5.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.benefits5.map((benefit: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy text-[14px] md:text-[18px] text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
              {/* details3 blog 9 */}
              {blogData.details3 && blogData.details3.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.details3.map(
                    (requirement: string, index: number) => (
                      <li
                        key={index}
                        className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                      >
                        {requirement}
                      </li>
                    )
                  )}
                </ul>
              )}
              {/* conclusion */}
              {blogData.conclusion1 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.conclusion1}
                </p>
              )}
              {/* Heading 6 */}
              {blogData.heading6 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading6}
                </p>
              )}

              {/* submissionOptions blog 6 */}
              {blogData.submissionOptions &&
                blogData.submissionOptions.length > 0 && (
                  <ul className="pl-5 list-disc">
                    {blogData.submissionOptions.map(
                      (requirement: string, index: number) => (
                        <li
                          key={index}
                          className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                        >
                          {requirement}
                        </li>
                      )
                    )}
                  </ul>
                )}

              {/* whatsIncluded blog 6 */}
              {blogData.whatsIncluded &&
                Object.keys(blogData.whatsIncluded).length > 0 && (
                  <ul className="pl-5 list-disc">
                    {Object.entries(blogData.whatsIncluded).map(
                      ([key, value]: any, index) => (
                        <li
                          key={index}
                          className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                        >
                          <strong>{key}:</strong> {value}
                        </li>
                      )
                    )}
                  </ul>
                )}

              {blogData.paragraph6 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph6}
                </p>
              )}
              {/* preventionStrategies blog 6 */}
              {blogData.preventionStrategies &&
                blogData.preventionStrategies.length > 0 && (
                  <ul className="pl-5 list-disc">
                    {blogData.preventionStrategies.map(
                      (requirement: string, index: number) => (
                        <li
                          key={index}
                          className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                        >
                          {requirement}
                        </li>
                      )
                    )}
                  </ul>
                )}
              {blogData.benefits6 && blogData.benefits6.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.benefits6.map((benefit: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy text-[14px] md:text-[18px] text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
              {/* details4 blog 9 */}
              {blogData.details4 && blogData.details4.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.details4.map(
                    (requirement: string, index: number) => (
                      <li
                        key={index}
                        className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                      >
                        {requirement}
                      </li>
                    )
                  )}
                </ul>
              )}
              {/* Image Blog */}
              {blogData.img4 && (
                <div className="rounded-[24px] pb-8">
                  <Image src={blogData.img4} alt="" width={901} height={500} />
                </div>
              )}
              {/* Heading 7 */}
              {blogData.heading7 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading7}
                </p>
              )}
              {/* penaltiesList blog 6 */}
              {blogData.penaltiesList && blogData.penaltiesList.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.penaltiesList.map(
                    (requirement: string, index: number) => (
                      <li
                        key={index}
                        className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                      >
                        {requirement}
                      </li>
                    )
                  )}
                </ul>
              )}
              {blogData.paragraph7 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph7}
                </p>
              )}
              {blogData.benefits7 && blogData.benefits7.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.benefits7.map((benefit: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy text-[14px] md:text-[18px] text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
              {/* details5 blog 9 */}
              {blogData.details5 && blogData.details5.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.details5.map(
                    (requirement: string, index: number) => (
                      <li
                        key={index}
                        className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                      >
                        {requirement}
                      </li>
                    )
                  )}
                </ul>
              )}
              {/* conclusion 3 */}
              {blogData.conclusion3 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.conclusion3}
                </p>
              )}
              {/* Heading 8 */}
              {blogData.heading8 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading8}
                </p>
              )}
              {/* bestPractices blog 6 */}
              {blogData.bestPractices && blogData.bestPractices.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.bestPractices.map(
                    (requirement: string, index: number) => (
                      <li
                        key={index}
                        className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                      >
                        {requirement}
                      </li>
                    )
                  )}
                </ul>
              )}
              {blogData.paragraph8 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph8}
                </p>
              )}
              {blogData.benefits8 && blogData.benefits8.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.benefits8.map((benefit: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy text-[14px] md:text-[18px] text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
              {/* details6 blog 9 */}
              {blogData.details6 && blogData.details6.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.details6.map(
                    (requirement: string, index: number) => (
                      <li
                        key={index}
                        className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                      >
                        {requirement}
                      </li>
                    )
                  )}
                </ul>
              )}
              {/* Heading 9 */}
              {blogData.heading9 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading9}
                </p>
              )}
              {blogData.paragraph9 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph9}
                </p>
              )}
              {blogData.benefits9 && blogData.benefits9.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.benefits9.map((benefit: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy text-[14px] md:text-[18px] text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
              {/* details7 blog 9 */}
              {blogData.details7 && blogData.details7.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.details7.map(
                    (requirement: string, index: number) => (
                      <li
                        key={index}
                        className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                      >
                        {requirement}
                      </li>
                    )
                  )}
                </ul>
              )}
              {/* Image Blog */}
              {blogData.img5 && (
                <div className="rounded-[24px] pb-8">
                  <Image src={blogData.img5} alt="" width={801} height={500} />
                </div>
              )}
              {/* Heading 10 */}
              {blogData.heading10 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading10}
                </p>
              )}
              {blogData.paragraph10 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph10}
                </p>
              )}
              {blogData.benefits10 && blogData.benefits10.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.benefits10.map((benefit: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy text-[14px] md:text-[18px] text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
              {/* details8 blog 9 */}
              {blogData.details8 && blogData.details8.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.details8.map(
                    (requirement: string, index: number) => (
                      <li
                        key={index}
                        className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                      >
                        {requirement}
                      </li>
                    )
                  )}
                </ul>
              )}
              {/* conclusion */}
              {blogData.Conclusion2 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.Conclusion2}
                </p>
              )}
              {blogData.paragraph22 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph22}
                </p>
              )}
              {/* Heading 11 */}
              {blogData.heading11 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading11}
                </p>
              )}
              {blogData.paragraph11 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph11}
                </p>
              )}
              {blogData.benefits11 && blogData.benefits11.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.benefits11.map((benefit: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy text-[14px] md:text-[18px] text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
              {/* details9 blog 9 */}
              {blogData.details9 && blogData.details9.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.details9.map(
                    (requirement: string, index: number) => (
                      <li
                        key={index}
                        className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                      >
                        {requirement}
                      </li>
                    )
                  )}
                </ul>
              )}
              {/* Heading 12 */}
              {blogData.heading12 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading12}
                </p>
              )}
              {blogData.paragraph12 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph12}
                </p>
              )}
              {blogData.benefits12 && blogData.benefits12.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.benefits12.map((benefit: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy text-[14px] md:text-[18px] text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
              {/* details10 blog 9 */}
              {blogData.details10 && blogData.details10.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.details10.map(
                    (requirement: string, index: number) => (
                      <li
                        key={index}
                        className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                      >
                        {requirement}
                      </li>
                    )
                  )}
                </ul>
              )}
              {/* refrences */}
              {blogData.References && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.References}
                </p>
              )}
              {/* Heading 13 */}
              {blogData.heading13 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading13}
                </p>
              )}
              {blogData.paragraph13 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph13}
                </p>
              )}
              {blogData.benefits13 && blogData.benefits13.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.benefits13.map((benefit: string, index: number) => (
                    <li
                      key={index}
                      className="font-Gilroy text-[14px] md:text-[18px] text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}

              {/* blog 3 data */}
              {blogData.overview && (
                <>
                  <h2 className="font-Gilroy font-bold text-[18px] pb-4 text-[#1D1D1DE5]">
                    {blogData.overview.heading}
                  </h2>
                  {blogData.overview.methods.map(
                    (method: any, index: number) => (
                      <div key={index}>
                        <h3 className="font-Gilroy font-bold text-[18px] pb-2 text-[#1D1D1DE5]">
                          {method.method}
                        </h3>
                        <p className="font-Gilroy font-normal text-[18px] pb-4 text-[#1D1D1DE5]">
                          {method.description}
                        </p>
                      </div>
                    )
                  )}
                </>
              )}

              {blogData.details1 &&
                blogData.details1.map((detail: any, index: number) => (
                  <div key={index}>
                    <h2 className="font-Gilroy font-bold text-[18px] pb-4 text-[#1D1D1DE5]">
                      {detail.heading}
                    </h2>
                    <p className="font-Gilroy font-normal text-[18px] pb-4 text-[#1D1D1DE5]">
                      {detail.description}
                    </p>
                    <ul className="pl-5 list-disc">
                      {detail?.pros?.map((pro: string, i: number) => (
                        <li
                          key={i}
                          className="font-Gilroy text-[18px] pb-2 text-[#1D1D1DE5]"
                        >
                          {pro}
                        </li>
                      ))}
                    </ul>
                    <ul className="pl-5 mt-4 list-disc">
                      {detail?.cons?.map((con: string, i: number) => (
                        <li
                          key={i}
                          className="font-Gilroy text-[18px] pb-2 text-[#1D1D1DE5]"
                        >
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

              {blogData.howToChoose && (
                <>
                  <h2 className="font-Gilroy font-bold text-[18px] pb-4 text-[#1D1D1DE5]">
                    {blogData.howToChoose.heading}
                  </h2>
                  <ul className="pl-5 list-disc">
                    {blogData.howToChoose.considerations.map(
                      (consideration: string, i: number) => (
                        <li
                          key={i}
                          className="font-Gilroy text-[18px] pb-2 text-[#1D1D1DE5]"
                        >
                          {consideration}
                        </li>
                      )
                    )}
                  </ul>
                  <p className="font-Gilroy font-normal text-[18px] pt-4 pb-8 text-[#1D1D1DE5]">
                    {blogData.howToChoose.conclusion}
                  </p>
                </>
              )}

              {/* 11 blog */}

              {/* Heading 1 */}
              {blogData.heading111 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading111}
                </p>
              )}

              {/* Paragraph 1 */}
              {blogData.paragraph111 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph111}
                </p>
              )}

              {/* Heading 2 */}
              {blogData.heading211 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading211}
                </p>
              )}

              {/* Trends List */}
              {blogData.trends && blogData.trends.length > 0 && (
                <ul className="pl-5 list-disc">
                  {blogData.trends.map((trend: any, index: any) => (
                    <li
                      key={index}
                      className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5] md:leading-[32px]"
                    >
                      {trend}
                    </li>
                  ))}
                </ul>
              )}

              {/* Heading 3 */}
              {blogData.heading311 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading311}
                </p>
              )}

              {/* Paragraph 2 */}
              {blogData.paragraph211 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph211}
                </p>
              )}

              {/* Details Section for USA */}
              {blogData.details1 && (
                <div>
                  {blogData.details1.map((detail: any, index: any) => (
                    <div key={index}>
                      <h4 className="font-Gilroy font-bold text-[14px] md:text-[18px] text-[#1D1D1DE5]">
                        {detail?.subheading}
                      </h4>
                      <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5]">
                        {detail?.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Heading 4 */}
              {blogData.heading411 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading411}
                </p>
              )}

              {/* Paragraph 3 */}
              {blogData.paragraph311 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph311}
                </p>
              )}

              {/* Details Section for KSA */}
              {blogData.details && (
                <div>
                  {blogData.details.map((detail: any, index: any) => (
                    <div key={index}>
                      <h4 className="font-Gilroy font-bold text-[14px] md:text-[18px] text-[#1D1D1DE5]">
                        {detail?.subheading}
                      </h4>
                      <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5]">
                        {detail?.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Heading 5 */}
              {blogData.heading511 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading511}
                </p>
              )}

              {/* Paragraph 4 */}
              {blogData.paragraph411 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph411}
                </p>
              )}

              {/* Details Section for Egypt */}
              {blogData.details2 && (
                <div>
                  {blogData.details2.map((detail: any, index: any) => (
                    <div key={index}>
                      <h3 className="font-Gilroy font-bold text-[14px] md:text-[18px] text-[#1D1D1DE5]">
                        {detail?.subheading}
                      </h3>
                      <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-4 text-[#1D1D1DE5]">
                        {detail?.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Comparative Analysis Section */}
              {blogData.heading1011 && (
                <h2 className="font-Gilroy font-bold text-[24px] md:text-[32px] pb-8 text-[#161C2D] md:leading-[40px]">
                  {blogData.heading1011}
                </h2>
              )}

              {blogData.content && (
                <table className="min-w-full border border-collapse border-gray-300">
                  <thead>
                    <tr>
                      <th className="p-4 text-left border border-gray-300">
                        Aspect
                      </th>
                      <th className="p-4 text-left border border-gray-300">
                        USA
                      </th>
                      <th className="p-4 text-left border border-gray-300">
                        KSA
                      </th>
                      <th className="p-4 text-left border border-gray-300">
                        Egypt
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogData.content.map((item: any, index: any) => (
                      <tr key={index}>
                        <td className="p-4 border border-gray-300">
                          {item.aspect}
                        </td>
                        <td className="p-4 border border-gray-300">
                          {item.USA}
                        </td>
                        <td className="p-4 border border-gray-300">
                          {item.KSA}
                        </td>
                        <td className="p-4 border border-gray-300">
                          {item.Egypt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Heading 6 */}
              {blogData.heading611 && (
                <p className="font-Gilroy font-bold text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.heading611}
                </p>
              )}

              {/* Paragraph 5 */}
              {blogData.paragraph511 && (
                <p className="font-Gilroy font-normal text-[14px] md:text-[18px] pb-8 text-[#1D1D1DE5] md:leading-[32px]">
                  {blogData.paragraph511}
                </p>
              )}

              {/* Image 2 */}
              {blogData.img2 && (
                <div className="">
                  <Image
                    src={blogData.img2}
                    alt="BIM Analysis"
                    width={901}
                    height={318}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
