import Header from "../Components/Header.tsx";
import LotCard from "../Components/LotCard.tsx";
import Collage from "../Components/Collage.tsx";

function LotDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="my-20 relative flex-1 flex justify-center items-start">
        <div className="absolute inset-x-0 top-12 h-110 bg-gray-200" />
        <div className="relative flex min-w-full px-24 justify-center items-stretch z-1 -mt-12 -mb-12 gap-24">
          <div>
            <h1 className="yeseva text-3xl">Intel Pentium</h1>
            <h3 className="noto italic text-xl mb-2">Electronics</h3>
            <Collage />
            <h2 className="yeseva text-xl mt-12">
              Description from the seller
            </h2>
            <p className="noto text-lg text-justify my-4 w-160">
              The Intel Pentium processor has long stood as a symbol of
              accessible computing power, blending efficiency and performance in
              a balanced way. Originally introduced in the mid-1990s, it became
              the cornerstone of personal computing for both households and
              offices, powering countless desktops and laptops. Known for its
              stability, affordability, and compatibility, the Pentium line
              served as an entry point into the world of digital productivity.
              Over the years, the brand evolved through multiple generations,
              adapting to new technologies, architectures, and user needs, while
              retaining its role as a reliable workhorse. For students,
              professionals, and casual users alike, Intel Pentium represented
              more than just silicon — it was the gateway to the modern PC era.
            </p>
          </div>
          <div className="sticky top-20 self-start">
            <LotCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LotDetailsPage;
