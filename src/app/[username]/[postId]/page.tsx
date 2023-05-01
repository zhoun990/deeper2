import { Prisma, type Post, type User } from "@prisma/client";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/dist/client/components/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PostNotFound } from "../../_post_components/PostPageNotFound";
import PostView from "../../_post_components/PostView";
import ReplyCreateForm from "./_components/ReplyCreateForm";
import ClientLink from "~/app/_components/ClientLink";
import PostCompactView from "~/app/_post_components/PostCompactView";
import PostLineView from "~/app/_post_components/PostLineView";
import Avatar from "~/app/_styled_components/Avatar";
import { type Database } from "~/lib/database.types";
import { prisma } from "~/lib/prisma";
import formatDate from "~/utils/formatDate";
// export const revalidate = 0;
export default async function Home({
  params,
}: {
  params: { username: string; postId: string };
}) {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const user = await supabase.auth.getUser().then((res) => res.data.user);
  const profile =
    user && (await prisma.user.findUnique({ where: { id: user.id } }));
  const repliesArgs = Prisma.validator<Prisma.Post$repliesArgs>()({
    where: {
      OR: [
        { public: { gte: 1 } }, //公開の場合
        { publicReply: { gte: 1 } }, //公開の場合
        { reply: { authorId: user?.id } }, //自分の投稿に対する返信の場合
        { authorId: user?.id }, //自分の投稿の場合
      ],
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });
  if (
    typeof Number(params.postId) !== "number" ||
    Number.isNaN(Number(params.postId))
  ) {
    return <PostNotFound />;
  }
  //FIX:自分のリプライにリプライすると自分しか見れなくなる
  const post = await prisma.post.findFirst({
    where: {
      AND: [
        { id: Number(params.postId) },
        {
          OR: [
            {
              OR: [
                //公開設定が1以上かつ返信ではない場合
                { AND: [{ public: { gte: 1 } }, { replyId: null }] },
              ],
            },
            {
              OR: user
                ? [
                    { authorId: user.id }, //自分の投稿の場合
                    {
                      permittedUsers: {
                        //宛先に自分が含まれている場合
                        some: {
                          AND: [{ userId: user.id }, { level: { gte: 1 } }],
                        },
                      },
                    },
                    //自分の投稿に対する返信の場合
                    { reply: { authorId: user.id } },
                    {
                      //公開&&返信である&&返信先の宛先に自分が含まれている場合
                      AND: [
                        { publicReply: { gte: 1 } }, //公開の場合
                        { replyId: { not: null } }, //返信の場合
                        // {
                        //   OR: [
                        //     { reply: { publicReply: { gte: 1 } } },
                        //     { reply: { publicReply: null } },
                        //   ],
                        // },
                        {
                          root: {
                            OR: [
                              {
                                permittedUsers: {
                                  //返信先の宛先に自分が含まれている場合
                                  some: {
                                    AND: [
                                      { userId: user?.id },
                                      { level: { gte: 1 } },
                                    ],
                                  },
                                },
                              },
                              { public: { gte: 1 } },
                            ],
                          },
                        },
                      ],
                    },
                  ]
                : undefined,
            },
          ],
        },
      ],
    },
    include: {
      //2
      author: true,
      replies: {
        ...repliesArgs,
        include: {
          //1
          author: true,
          replies: {
            ...repliesArgs,
            include: {
              //0
              author: true,
              replies: {
                ...repliesArgs,
                include: {
                  author: true,
                },
              },
            },
          },
        },
      },
      reply: {
        include: {
          author: true,
          reply: {
            include: {
              author: true,
              reply: { include: { author: true } },
            },
          },
        },
      },
    },
  });

  if (!post) {
    return <PostNotFound />;
  }
  if (post.author.username !== params.username) {
    redirect(`/${post.author.username}/${post.id}`);
  }
  // console.log("^_^ Log \n file: page.tsx:90 \n post:", post);

  type PostWithReplies = Post & { author: User; replies: PostWithReplies[] };
  const flatReply = (array: PostWithReplies[]): PostWithReplies[] =>
    (array || []).flatMap((reply) => [
      reply,
      ...flatReply(reply.replies?.map((r) => ({ ...r, reply }))),
    ]);
  const replies = flatReply(post.replies);
  // console.log("^_^ Log \n file: page.tsx:89 \n replies:", replies);
  return (
    <div className="mx-auto min-h-screen max-w-xl p-2 lg:p-0">
      <PostWithReplyView postId={post.id} post={post} />
      {profile ? (
        <ReplyCreateForm post={post} user={profile} />
      ) : (
        <>
          <div className="flex h-20">
            <div className="flex w-[10%] flex-col">
              <div className="flex grow">
                <div className="grow"></div>
                <div className="grow border-l-4"></div>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-gray-600 px-4 py-6 text-white">
            <h1 className="mb-2 text-lg font-bold">
              サインインして返信しよう！
            </h1>
            <p className="mb-4 text-sm">
              アカウントをお持ちでない場合は、登録してから返信してください。
            </p>
            <Link
              href="/register"
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              サインイン
            </Link>
          </div>
        </>
      )}
      <RepliesTimeline post={post} replies={replies} />
    </div>
  );
}
type PostWithReply = Post & { author: User; reply?: PostWithReply | null };
const PostWithReplyView = ({
  postId,
  post,
}: {
  postId: number;
  post: PostWithReply;
}) => {
  return (
    <div>
      {post.reply && <PostWithReplyView post={post.reply} postId={postId} />}
      {postId === post.id ? (
        <>
          {post.replyId ? (
            <div className="flex h-12">
              <div className="flex w-[10%] flex-col">
                <div className="flex grow">
                  <div className="grow"></div>
                  <div
                    className={post.replyId ? "grow border-l-4" : "grow"}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-8" />
          )}
          <PostView post={post} profile={post.author} />
        </>
      ) : (
        <ClientLink href={`/${post.author.username}/${post.id}`}>
          <div className="flex h-6">
            <div className="flex w-[10%] flex-col">
              <div className="flex grow">
                <div className="grow"></div>
                <div
                  className={post.replyId ? "grow border-l-4" : "grow"}
                ></div>
              </div>
            </div>
          </div>
          <PostCompactView
            post={post}
            profile={post.author}
            // className="mt-2 grow"
          />
        </ClientLink>
      )}
    </div>
  );
};
const RepliesTimeline = ({
  post,
  replies,
}: {
  post: PostWithReply;
  replies: (PostWithReply & { author: User })[];
}) => {
  return (
    <div className="mt-14">
      <label htmlFor="bio" className="mb-3 block text-xl font-bold text-white">
        最新の返信
      </label>
      {replies.map((rPost) => (
        <div key={rPost.id} className="mx-auto my-8 max-w-xl">
          {rPost.replyId !== post.id && rPost.reply && (
            <>
              <ClientLink
                href={`/${rPost.reply.author.username}/${rPost.reply.id}`}
              >
                <PostLineView
                  post={rPost.reply}
                  profile={rPost.author}
                  className="rounded-l-none border-l-[6px]"
                />
              </ClientLink>
              <div className="flex h-3 ">
                <div className="flex w-[10%] flex-col">
                  <div className="flex grow">
                    <div className="grow"></div>
                    <div
                      className={rPost.replyId ? "grow border-l-4" : "grow"}
                    ></div>
                  </div>
                </div>
              </div>
            </>
            // <Link href={`/*/${rPost.replyId}`}>返信先を表示{ rPost.reply?.text}</Link>
          )}
          <ClientLink href={`/${rPost.author.username}/${rPost.id}`}>
            <PostView
              post={rPost}
              profile={rPost.author}
              className="rounded-l-none border-l-[6px]"
            />
          </ClientLink>
        </div>
      ))}
    </div>
  );
};
// const include = (
//   depth: number,
//   others?: Prisma.PostInclude
// ): Prisma.PostInclude => {
//   return {
//     ...others,
//     author: true,
//     replies: {
//       where: {
//         OR: [
//           { public: { gte: 1 } }, //公開の場合
//           { reply: { authorId: user?.id } }, //自分の投稿に対する返信の場合
//           { authorId: user?.id }, //自分の投稿の場合
//         ],
//       },
//       take: 10,
//       orderBy: { createdAt: "desc" },
//       include:
//         depth <= 0
//           ? {
//               author: true,
//             }
//           : include(depth - 1),
//     },
//   };
// };
// include(2, {
//   reply: {
//     include: {
//       author: true,
//       reply: {
//         include: {
//           author: true,
//           reply: { include: { author: true } },
//         },
//       },
//     },
//   },
// });
