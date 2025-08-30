'use client';
import { useRouter } from 'next/navigation';
import Navbar from '../navbar';
import Footer from '../footer';
import Link from 'next/link';

const APIS = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/contact-us');
  };

  return (
    <div>
      <div className="w-full h-[100%]">
        <div className="bg-[url('/apis-imges/Grop-hero.png')] bg-cover bg-center lg:max-h-[907px]   bg-no-repeat w-full">
          <Navbar />
          {/* Add your content here if needed */}
          {/* first section */}
          <div className="container ">
            <div className="flex items-center  justify-center  py-4 md:py-0 px-4 lg:px-0 ">
              <div className=" flex flex-col items-center md:pt-[123px]">
                <div className=" w-full  flex flex-col items-center">
                  <div className="pb-5">
                    <h1 className="font-Gilroy font-bold text-[24px] md:text-[48px] text-center text-[#161C2D] md:leading-[65px]">
                      Industry-Leading API Solutions
                    </h1>
                  </div>
                  <div className=" w-full max-w-[899px]">
                    <p className="font-normal font-Gilroy text-[15px] md:text-[19px]  text-[#161C2D] leading-[32px] text-center">
                      Discover Schesti, the leading provider of API solutions
                      tailored specifically for the construction industry. Our
                      platform offers a premier API designed for backend
                      software developers, empowering them to seamlessly
                      integrate cutting-edge functionalities into their
                      applications
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 pt-[47px]">
                  <button
                    className="bg-schestiPrimary text-white font-medium text-[18px] font-Poppins leading-[27px] rounded-[39px] px-[24px] py-3 md:py-[15px] cursor-pointer"
                    onClick={handleClick}
                  >
                    Connect with Us for Pricing
                  </button>
                </div>
                <div className="md:pt-[119px] pt-5">
                  <img
                    className="rounded-md w-full"
                    src="/images/Owner.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* section second */}
      <div className="w-full lg:mt-[40px] ">
        <div className="container ">
          <div className="flex justify-center">
            <div className="w-full max-w-[801px] pt-[131px] flex flex-col items-center">
              <div className="">
                <h1 className="font-Gilroy font-bold text-center text-[25px] md:text-[36px] tracking-[-1.2px] text-[#161C2D] leading-[48px]">
                  Schesti APIs: Streamlining Construction Workflows
                </h1>
              </div>
              <div className="w-full max-w-[613.51px] pt-4">
                <p className="font-normal font-Gilroy text-center text-[15px] md:text-[19px] tracking-[-0.2px] text-[#161C2D] leading-[32px]">
                  Schesti API suite streamlines construction processes—from
                  quantity takeoff to time scheduling—enhancing efficiency
                  across all trades
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-12 md:gap-0 px-4 lg:px-0 md:pt-[56px]">
            <div className="">
              <img
                src="/apis-imges/Imagepro.png"
                alt=""
                className="w-full h-auto max-w-full max-h-[500px] object-contain"
              />
            </div>
            <div className="w-full max-w-[490px]">
              <div className=" pt-3">
                <div className="flex gap-5 items-start  pb-[30px] ">
                  <div className="pt-1 md:pt-0">
                    <img className="w-auto" src="/apis-imges/g1.svg" alt="" />
                  </div>
                  <div className="w-full max-w-[490px]">
                    <div className=" pb-2">
                      <h1 className="font-Gilroy font-bold text-[21px] leading-[32px] text-[#161C2D]">
                        Takeoff API
                      </h1>
                    </div>
                    <div className="">
                      {' '}
                      <p className="font-normal font-Gilroy text-[12px] md:text-[17px] text-[#161C2D] leading-[29px]">
                        API for Quantity Takeoff: Streamline quantity takeoff
                        processes for all construction trades
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 items-start  pb-[30px] ">
                  <div className="pt-1 md:pt-0">
                    <img className="w-auto" src="/apis-imges/g2.svg" alt="" />
                  </div>
                  <div className="w-full max-w-[490px]">
                    <div className=" pb-2">
                      <h1 className="font-Gilroy font-bold text-[21px] leading-[32px] text-[#161C2D]">
                        Schedule API
                      </h1>
                    </div>
                    <div className="">
                      {' '}
                      <p className="font-normal font-Gilroy text-[12px] md:text-[17px] text-[#161C2D] leading-[29px]">
                        API for Time Schedule: Efficiently manage project
                        timelines across various sectors
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 items-start  pb-[30px] ">
                  <div className="pt-1 md:pt-0">
                    <img className="w-full" src="/apis-imges/g3.svg" alt="" />
                  </div>
                  <div className="w-full max-w-[490px]">
                    <div className=" pb-2">
                      <h1 className="font-Gilroy font-bold text-[21px] leading-[32px] text-[#161C2D]">
                        CRM API
                      </h1>
                    </div>
                    <div className="">
                      {' '}
                      <p className="font-normal font-Gilroy text-[12px] md:text-[17px] text-[#161C2D] leading-[29px]">
                        API for CRM Modules: Enhance customer relationship
                        management with specialized modules for
                        <br /> construction
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 md:gap-0 px-4 lg:px-0 md:pt-[40px]">
            <div className="w-full max-w-[490px]">
              <div className=" pt-3">
                <div className="flex gap-5 items-start  pb-[30px] ">
                  <div className="pt-1 md:pt-0">
                    <img className="w-auto" src="/apis-imges/g4.svg" alt="" />
                  </div>
                  <div className="w-full max-w-[490px]">
                    <div className=" pb-2">
                      <h1 className="font-Gilroy font-bold text-[21px] leading-[32px] text-[#161C2D]">
                        Contract Management API
                      </h1>
                    </div>
                    <div className="">
                      {' '}
                      <p className="font-normal font-Gilroy text-[12px] md:text-[17px] text-[#161C2D] leading-[29px]">
                        API for Electronic Contract Signature: Simplify contract
                        signing processes with our electronic signature API
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 items-start  pb-[30px] ">
                  <div className="pt-1 md:pt-0">
                    <img className="w-full" src="/apis-imges/g5.svg" alt="" />
                  </div>
                  <div className="w-full max-w-[539px]">
                    <div className=" pb-2">
                      <h1 className="font-Gilroy font-bold text-[21px] leading-[32px] text-[#161C2D]">
                        Invoicing API
                      </h1>
                    </div>
                    <div className="">
                      {' '}
                      <p className="font-normal font-Gilroy text-[12px] md:text-[17px] text-[#161C2D] leading-[29px]">
                        API for Invoicing: Automate invoicing tasks for smoother
                        financial transactions
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 items-start  pb-[30px] ">
                  <div className="pt-1 md:pt-0">
                    <img className="w-full" src="/apis-imges/g6.svg" alt="" />
                  </div>
                  <div className="w-full max-w-[539px]">
                    <div className=" pb-2">
                      <h1 className="font-Gilroy font-bold text-[21px] leading-[32px] text-[#161C2D]">
                        Estimates API
                      </h1>
                    </div>
                    <div className="">
                      {' '}
                      <p className="font-normal font-Gilroy text-[12px] md:text-[17px] text-[#161C2D] leading-[29px]">
                        API for Construction Estimates: Generate accurate
                        construction estimates with our dedicated API
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <img
                src="/apis-imges/Imagepro.png"
                alt=""
                className="w-full h-auto max-w-full max-h-[500px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      {/* third */}
      <div className="bg-[#F5F6FA]">
        <div className="container">
          <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-12 py-3 md:py-[100px] md:gap-0 px-4 lg:px-0">
            <div className="w-full max-w-[511px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[26px] lg:text-[48px]  text-[#161C2D] md:leading-[64px]">
                  Schesti: The Ultimate API Solution for Construction Software
                  Developers
                </h1>
              </div>
              <div className=" pt-[32px]">
                <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#161C2D] leading-8">
                  Partner with Schesti and revolutionize your construction
                  software development experience. Contact us today to learn
                  more about our pricing options and unleash the full potential
                  of our APIs for your projects
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-5 pt-6">
                <Link
                  href="/login"
                  className="bg-[#007AB6] text-white font-medium text-[18px] font-Poppins leading-[27px] rounded-[39px] px-6 py-3 md:py-[15px]"
                >
                  Get Started Now!
                </Link>
                <Link
                  href="/contact-us"
                  className=" border-[2px] font-Poppins  text-[#007AB6] font-medium text-[18px] leading-[27px] rounded-[39px] px-6 py-[14px]"
                >
                  Contact us
                </Link>
              </div>
            </div>
            <div className="w-full max-w-[475px]">
              <img
                src="/timesedule-imges/take-controls.png"
                alt=""
                className="w-full h-auto max-w-full max-h-[500px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default APIS;
