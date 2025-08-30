'use client';
import { useResponseHook } from '@/app/hooks/useResponsive.hook';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { MenuOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function LandingNavbar() {
  const responsive = useResponseHook();
  const pathname = usePathname();
  const router = useRouterHook();

  if (responsive.lg) {
    return (
      <header>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <nav aria-label="Main" className="flex items-center space-x-52">
            <Image
              src={'/logowhite.svg'}
              width={90}
              height={90}
              alt="Schesti"
              onClick={() => router.push('/')}
              className="cursor-pointer"
            />
            <div className="mt-1 space-x-8">
              <a
                className={`text-white cursor-pointer text-lg pb-1 font-medium ${
                  pathname === '/' ? ' border-b-2 border-[#ffc107]' : ''
                }`}
                onClick={() => router.push('/')}
              >
                Home
              </a>
              <a
                className={`text-white cursor-pointer text-lg pb-1 font-medium ${
                  pathname === '/pricing' ? ' border-b-2 border-[#ffc107]' : ''
                }`}
                onClick={() => router.push('/pricing')}
              >
                Pricing
              </a>
            </div>
          </nav>
          <div className="flex space-x-4">
            <button
              className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer hover:bg-primary/90 h-10 bg-transparent text-white font-semibold py-2 px-4 rounded-full border border-white hover:border-gray-300 hover:text-gray-300"
              onClick={() => router.push('/request-a-demo')}
            >
              Request a demo
            </button>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer h-10 bg-white text-[#6f42c1] font-semibold py-2 px-4 rounded-full hover:bg-gray-100"
              onClick={() => router.push('/login')}
            >
              Login
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header>
      <div className="max-w-5xl px-10 mx-auto flex items-center justify-between">
        <nav
          aria-label="Main"
          className="flex items-center justify-between flex-1"
        >
          <div>
            <Image
              src={'/logowhite.svg'}
              width={90}
              height={90}
              alt="Schesti"
            />
          </div>
          <Dropdown
            trigger={['click']}
            menu={{
              className: 'w-52',
              items: [
                {
                  key: 'home',
                  label: (
                    <p
                      className={`font-semibold py-2 px-4    hover:text-gray-600 ${
                        pathname === '/' ? ' border-b-2 border-[#ffc107]' : ''
                      }`}
                      onClick={() => router.push('/')}
                    >
                      Home
                    </p>
                  ),
                },
                {
                  key: 'pricing',
                  label: (
                    <p
                      className={`font-semibold py-2 px-4    hover:text-gray-600 ${
                        pathname === '/pricing'
                          ? ' border-b-2 border-[#ffc107]'
                          : ''
                      }`}
                      onClick={() => router.push('/pricing')}
                    >
                      Pricing
                    </p>
                  ),
                },
                {
                  key: 'contact',
                  label: (
                    <p
                      className={`font-semibold py-2 px-4   hover:text-gray-600 ${
                        pathname === '/request-a-demo'
                          ? ' border-b-2 border-[#ffc107]'
                          : ''
                      }`}
                      onClick={() => router.push('/request-a-demo')}
                    >
                      Request a demo
                    </p>
                  ),
                },
                {
                  key: 'login',
                  label: (
                    <p
                      className=" text-[#6f42c1] font-semibold py-2 px-4 rounded-full"
                      onClick={() => router.push('/login')}
                    >
                      Login
                    </p>
                  ),
                },
              ],
            }}
          >
            <MenuOutlined className="text-xl text-white cursor-pointer" />
          </Dropdown>
        </nav>
      </div>
    </header>
  );
}
