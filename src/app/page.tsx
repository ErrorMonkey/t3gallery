import Image from "next/image";
import { db } from "~/server/db";
import TestPage from "./TestPage";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

async function Images() {
  const images = await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });
  return (
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
  );
}

export default async function HomePage() {
  return (
    <>
      <main className="">
        <TestPage />
        <SignedOut>Pls Sign in</SignedOut>
        <SignedIn>
          <Images />
        </SignedIn>
      </main>
    </>
  );
}
