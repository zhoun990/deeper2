import {
  type DetailedHTMLProps,
  type TextareaHTMLAttributes,
} from "react";

export default function StyledTextarea({
  className,
  onChange,
  onChangeText,
  ...props
}: DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  onChangeText?: (text: string) => void;
}) {
  return (
    <textarea
      rows={3}
      {...props}
      className={
        "block w-full resize-none rounded-lg border border-transparent bg-gray-600 px-5 py-2 text-base text-white transition duration-500 ease-in-out placeholder:text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 " +
        (className || "")
      }
      onChange={(e) => {
        onChange?.(e);
        onChangeText?.(e.target.value);
      }}
    />
  );
}
