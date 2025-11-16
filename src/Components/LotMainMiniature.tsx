import { Link } from "react-router-dom";

interface LotMainMiniatureProps {
  lot: {
    id: number;
    title: string;
    reservePrice: number;
    category: { name: string };
  };
}

function LotMainMiniature({ lot }: LotMainMiniatureProps) {
  return (
    <Link to={`/lot/${lot.id}`}>
      <div className="flex flex-row bg-gray-200 flex-1 p-2 hover:opacity-80 transition">
        <div className="flex-col">
          <img
            src="https://www.raspberrypi.com/app/uploads/2022/09/Screenshot-2022-09-08-at-09.53.03.png"
            alt={lot.title}
            className="object-cover border-1 border-gray-400 aspect-square"
          />
          <h6 className="noto text-xl font-bold mt-1">{lot.title}</h6>
          <h6 className="noto italic">{lot.category.name}</h6>
          <h6 className="lora text-2xl mt-1">${lot.reservePrice}</h6>
        </div>
      </div>
    </Link>
  );
}

export default LotMainMiniature;
