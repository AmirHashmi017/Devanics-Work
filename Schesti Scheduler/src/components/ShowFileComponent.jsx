export function ShowFileComponent({ file, onDelete, shouldFit = true }) {
  return (
    <div className={`border my-2 rounded ${shouldFit ? 'w-fit' : ''}`}>
      <div className="bg-schestiLightPrimary flex items-center justify-between px-2 py-1 ">
        <div className="flex items-center space-x-3">
          <img src={'/file-05.svg'} width={16} height={16} alt="file" />
          <p className="text-[#667085] text-[14px] leading-6">
            {file.name.slice(0, 15)}.{file.name.split('.').pop()}
          </p>
        </div>
        <img
          src={'/trash.svg'}
          width={16}
          height={16}
          alt="close"
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
        />
      </div>
      <div className="p-2 mx-auto w-auto h-[190px] xl:w-[230px] relative">
        {file.type.includes('image') ? (
          <img alt="image" src={file.url} fill />
        ) : (
          <div className="relative mt-10 w-[100px] h-[100px] mx-auto">
            <img alt="pdf" src={'/pdf.svg'} layout="fill" objectFit="cover" />
          </div>
        )}
      </div>
    </div>
  );
}
