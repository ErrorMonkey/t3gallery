import Image from "next/image";
import { db } from "~/server/db";

const mockUrl = [
  "https://picsum.photos/200?random=1",
  "https://picsum.photos/200?random=2",
  "https://picsum.photos/200?random=3",
  "https://picsum.photos/200?random=4",
];

const mockImages = mockUrl.map((url, index) => ({
  id: index + 1,
  url,
}));

export default async function HomePage() {
  const posts = await db.query.posts.findMany();
  console.log("posts", posts);

  return (
    <>
      <main className="">
        <div className="flex flex-wrap gap-4">
          {posts.map((post) => (
            <div key={post.id}>{post.name}</div>
          ))}
          {posts.map((post) => (
            <div key={post.id}></div>
          ))}
          {[...mockImages, ...mockImages, ...mockImages].map((image, index) => (
            <div key={image.id + "-" + index} className="w-48">
              <img alt="" src={image.url} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
