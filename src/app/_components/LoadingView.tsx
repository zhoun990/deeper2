import Spin from "../_styled_components/Spin";

export default function LoadingView() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Spin />
    </div>
  );
}
