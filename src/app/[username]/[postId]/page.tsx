import { type User, type Post } from "@prisma/client";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/dist/client/components/headers";
import Image from "next/image";
import Link from "next/link";
import PostView from "../../_components/PostView";
import { UserPageNotFound } from "../_components/UserPageNotFound";
import ReplyCreateForm from "./_components/ReplyCreateForm";
import Avatar from "~/app/_components/Avatar";
import ClientLink from "~/app/_components/ClientLink";
import PostCompactView from "~/app/_components/PostCompactView";
import PostCreateView from "~/app/_components/PostCreateView";
import PostLineView from "~/app/_components/PostLineView";
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
  const post = await prisma.post.findFirst({
    where: {
      id: Number(params.postId),
      OR: [
        { authorId: user?.id },
        ...(user
          ? [
              {
                permittedUsers: {
                  some: { userId: user.id, level: { gte: 1 } },
                },
              },
              // {
              //   follower: { gte: 1 },
              //   author: { follower: { some: { fromId: user.id } } },
              // },
            ]
          : []),
        { public: { gte: 1 } },
      ],
    },
    include: {
      author: true,
      replies: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          replies: {
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
              author: true,
              replies: {
                take: 10,
                orderBy: { createdAt: "desc" },
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
    return <UserPageNotFound />;
  }
  type PostWithReplies = Post & { author: User; replies: PostWithReplies[] };
  const flatReply = (array: PostWithReplies[]): PostWithReplies[] =>
    (array || []).flatMap((reply) => [
      reply,
      ...flatReply(reply.replies?.map((r) => ({ ...r, reply }))),
    ]);
  const replies = flatReply(post.replies);
  console.log("^_^ Log \n file: page.tsx:89 \n replies:", replies);
  return (
    <div className="min-h-screen bg-black">
      <PostWithReplyView postId={post.id} post={post} />
      <ReplyCreateForm post={post} />
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
    <div className="mx-auto max-w-xl">
      {post.reply && <PostWithReplyView post={post.reply} postId={postId} />}
      {postId === post.id ? (
        <>
          <div className="flex h-8 ">
            <div className="flex w-[10%] flex-col">
              <div className="flex grow">
                <div className="grow"></div>
                <div
                  className={post.replyId ? "grow border-l-4" : "grow"}
                ></div>
              </div>
            </div>
          </div>
          <PostView post={post} profile={post.author} />
        </>
      ) : (
        <ClientLink
          href={`/${post.author.username}/${post.id}`}
          // className="flex"
        >
          {/* <div className="flex w-[10%] flex-col ">
            <div className="flex grow">
              <div className="grow"></div>
              <div className={post.replyId ? "grow border-l-4" : "grow"}></div>
            </div>
            <div className="flex grow">
              <div className="grow "></div>
              <div
                className={
                  post.replyId
                    ? "grow border-l-4 border-t-4"
                    : "grow rounded-tl-xl border-l-4 border-t-4"
                }
              ></div>
            </div>
          </div> */}{" "}
          <div className="flex h-8 ">
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
    <div className="mt-4">
      {replies.map((rPost) => (
        <div key={rPost.id} className="mx-auto my-8 max-w-xl">
          {rPost.replyId !== post.id && rPost.reply && (
            <>
              <PostLineView post={rPost.reply} profile={rPost.author} />
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
            <PostView post={rPost} profile={rPost.author} />
          </ClientLink>
        </div>
      ))}
    </div>
  );
};
const SnsPost = ({ post, user }: { post: Post; user: User }) => {
  return (
    <div className="mx-auto max-w-md rounded-lg bg-gray-800 p-4 text-white">
      <div className="mb-4 flex items-center">
        <Avatar user={user} className="mr-4 h-10 w-10 rounded-full" />
        <div>
          <span className="font-bold">{user.name}</span>
          <p className="text-xs">@{user.username}</p>
        </div>
      </div>
      <div className="mb-2">
        <p>{post.text}</p>
      </div>
      <div className="text-xs text-gray-400">{formatDate(post.createdAt)}</div>
    </div>
  );
};
