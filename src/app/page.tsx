import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
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

  return (
    <>
      <main className="">
        <div className="flex flex-wrap gap-4">
          {[...mockImages, ...mockImages, ...mockImages].map((image) => (
            <div key={image.id} className="w-48">
              <img src={image.url} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
