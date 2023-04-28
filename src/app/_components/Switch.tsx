import { Switch as HSwitch } from "@headlessui/react";

export default function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange?(checked: boolean): void;
}) {
  return (
    <HSwitch
      checked={checked}
      onChange={onChange}
      className={`${
        checked ? "bg-blue-600" : "bg-gray-600"
      } relative inline-flex h-6 w-11 items-center rounded-full text-white`}
    >
      <span className="sr-only">Enable</span>
      <span
        className={`${
          checked ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 rounded-full bg-white transition`}
      />
    </HSwitch>
  );
}
