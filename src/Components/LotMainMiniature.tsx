import { Link } from "react-router-dom";

interface LotMainMiniatureProps {
  lot: {
    id: number;
    title: string;
    reservePrice: number;
    category: { name: string };
    images: { imageData: string }[];
  };
}

function LotMainMiniature({ lot }: LotMainMiniatureProps) {
  // Перевіряємо, чи є хоча б одне зображення
  const imageSrc =
    lot.images.length > 0
      ? `data:image/jpeg;base64,${lot.images[0].imageData}`
      : "/placeholder.jpg"; // можна замінити на своє заглушкове зображення

  return (
    <Link to={`/lot/${lot.id}`}>
      <div className="flex flex-col bg-gray-200 p-2 hover:opacity-80 transition">
        <img
          src={imageSrc}
          alt={lot.title}
          className="object-cover border border-gray-400 aspect-square"
        />
        <h6 className="noto text-xl font-bold mt-1">{lot.title}</h6>
        <h6 className="noto italic">{lot.category.name}</h6>
        <h6 className="lora text-2xl mt-1">${lot.reservePrice ?? 0}</h6>
      </div>
    </Link>
  );
}

export default LotMainMiniature;
