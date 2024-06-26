import Image from "next/image";
import TestPage from "./TestPage";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getMyImages } from "~/server/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function Images() {
  const images = await getMyImages();

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {images.map((image, index) => (
        <div key={image.id + "-" + index} className="flex h-48 w-48 flex-col">
          <Link href={`/img/${image.id}`}>
            <Image
              src={image.url}
              style={{ objectFit: "contain" }}
              width={192}
              height={192}
              alt={image.name}
            />
          </Link>
          <div>{image.name}</div>
        </div>
      ))}
      {/* {[...images, ...images, ...images].map((image, index) => (
        <div key={image.id + "-" + index} className="flex w-48 flex-col">
          <img alt="" src={image.url} />
          <div>{image.name}</div>
        </div>
      ))} */}
    </div>
  );
}

export default async function HomePage() {
  return (
    <>
      <main className="">
        {/* <TestPage /> */}
        <SignedOut>
          <div className="h-full w-full text-center text-2xl">Pls Sign in</div>
        </SignedOut>
        <SignedIn>
          <Images />
        </SignedIn>
      </main>
    </>
  );
}
