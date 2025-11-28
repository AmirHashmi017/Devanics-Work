const NoPost = () => {
  return (
    <div className="rounded-xl mt-2 p-6 flex justify-center  bg-white">
      <div className="max-w-[350px] flex flex-col items-center">
        <img
          src="/assets/icons/search-01.svg"
          className="border-8 p-4 border-pattensBlue bg-paleBlueLily rounded-full"
          alt="search.svg"
        />
        <p className="font-semibold text-blackCow mt-4">No Feed Found</p>
        <p className="text-davyGrey text-sm mt-1 text-center"></p>
      </div>
    </div>
  );
};

export default NoPost;
