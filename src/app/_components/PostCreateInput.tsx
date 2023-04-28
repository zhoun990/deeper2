"use client";
import { type Dispatch, type SetStateAction } from "react";

export default function PostCreateInput({
  title,
  text,
  setText,
}: {
  title?: string;
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div>
      <label htmlFor="bio" className="block text-sm font-medium text-white">
        {title}
      </label>
      <div className="mt-1">
        <textarea
          value={text}
          rows={5}
          id="bio"
          name="bio"
          className="block w-full resize-none rounded-lg border border-transparent bg-gray-600 px-5 py-2 text-base text-white transition duration-500 ease-in-out placeholder:text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
