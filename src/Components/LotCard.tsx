import Input from "./Input.tsx";
import Button from "./Button.tsx";

interface LotCardProps {
  reservePrice: number;
  pickupPlace: string;
}

function LotCard({ reservePrice, pickupPlace }: LotCardProps) {
  return (
    <div className="flex flex-col justify-start h-full mt-8">
      <h2 className="noto ml-2 mb-2 text-xl">Closes in (date)</h2>
      <div className="flex flex-col bg-white p-6 shadow-md border-1 border-gray-300 rounded-xs w-100 min-h-full gap-2">
        <h3 className="noto italic text-lg">Current bid</h3>
        <h2 className="lora text-5xl mb-2">$ 100</h2>
        <h3 className="noto italic text-lg mb-4">{`Reserve price ${reservePrice ? "$ " : ""} ${reservePrice ?? "not met"}`}</h3>
        <div className="flex gap-2 mb-2">
          <Button variant="rounded">$ 110</Button>
          <Button variant="rounded">$ 120</Button>
          <Button variant="rounded">$ 175</Button>
        </div>
        <Input
          type="number"
          placeholder="$ 110 or up"
          font="arimo"
          customClasses="bg-gray-200"
        />
        <div className="flex gap-2">
          <Button variant="secondary">Place bid</Button>
          <Button>Set max bid</Button>
        </div>
        <h3 className="noto italic text-lg mt-2 mb-13">
          Pickup in {pickupPlace}
        </h3>
      </div>
    </div>
  );
}

export default LotCard;
