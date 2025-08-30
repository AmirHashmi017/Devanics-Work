export function ToolButton({
  Icon,
  text,
  ...props
}: {
  text: string;
  Icon: React.ReactNode;
} & React.ComponentProps<'button'>) {
  return (
    <button
      className="flex items-center justify-center space-x-2 cursor-pointer rounded-md border font-medium w-full py-2.5 px-4 text-xs"
      {...props}
    >
      {Icon}
      <p>{text}</p>
    </button>
  );
}
