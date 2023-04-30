
export const PostNotFound = () => {
  return (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center">
      <div className="rounded-md bg-gray-800 p-8 text-center">
        <h1 className="text-3xl font-extrabold text-white">
          投稿が見つかりません
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          投稿が削除されたか、URLが間違っている可能性があります。
          {/* <br />
            キーワードを変えて再度検索してみてください。 */}
        </p>
      </div>
    </div>
  );
};
