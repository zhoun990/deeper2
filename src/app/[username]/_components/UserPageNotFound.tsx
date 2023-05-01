import Link from "next/link";

export const UserPageNotFound = ({ username }: { username: string }) => {
  return (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center">
      <div className="rounded-md bg-gray-800 p-8 text-center">
        <h1 className="text-3xl font-extrabold text-white">
          プロフィールが見つかりません
        </h1>
        <p className="my-4 text-lg text-gray-300">
          @{username}のプロフィールは見つかりませんでした。
          {/* <br />
          キーワードを変えて再度検索してみてください。 */}
        </p>
        <Link href="/" className="text-blue-500 hover:text-blue-300">
          トップに戻る
        </Link>
      </div>
    </div>
  );
};
