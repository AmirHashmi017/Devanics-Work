import Image from 'next/image';

const NoPost = () => {
  return (
    <div className="rounded-xl p-6 flex justify-center bg-white">
      <div className="max-w-[350px] flex flex-col items-center">
        <Image
          src="/search-01.svg"
          width={36}
          height={36}
          className="border-8 p-2 border-pattensBlue bg-paleBlueLily rounded-full"
          alt="search.svg"
        />
        <p className="font-semibold text-blackCow mt-4">No Feed Found</p>
        <p className="text-davyGrey text-sm mt-1 text-center"></p>
      </div>
    </div>
  );
};

export default NoPost;
