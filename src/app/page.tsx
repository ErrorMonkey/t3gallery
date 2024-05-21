import Image from "next/image";
import { db } from "~/server/db";
import TestPage from "./TestPage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const images = await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });

  return (
    <>
      {/* <TestPage /> */}
      <main className="">
        <div className="flex flex-wrap gap-4">
          {images.map((post) => (
            <div key={post.id}></div>
          ))}
          {[...images, ...images, ...images].map((image, index) => (
            <div key={image.id + "-" + index} className="flex w-48 flex-col">
              <img alt="" src={image.url} />
              <div>{image.name}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
