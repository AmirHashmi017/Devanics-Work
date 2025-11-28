type Props = {
  label?: string;
  postFix?: React.ReactNode;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
export function InlineInput({ label, postFix, error, ...props }: Props) {
  return (
    <div className="space-y-1">
      <div
        className={`flex w-full items-center border ${
          error ? 'border-red-400' : 'border-schestiLightGray'
        } rounded-md`}
      >
        <div
          className={`px-3 font-medium  py-2 bg-schestiLightPrimary  rounded-l-md border-r ${
            error ? 'border-red-400' : 'border-schestiLightGray'
          }`}
        >
          <span className="text-gray-500">{label}</span>
        </div>
        <input
          type="text"
          placeholder="Type an email"
          {...props}
          className="flex-1 px-3 py-2 border-none outline-none"
        />
        {postFix}
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
