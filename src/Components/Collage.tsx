function Collage() {
  return (
    <div className="w-full">
      <img
        src="https://www.raspberrypi.com/app/uploads/2022/09/Screenshot-2022-09-08-at-09.53.03.png"
        alt="product"
        className="w-160 h-90 object-cover border-1 border-gray-400"
      />
      <div className="flex flex-1 h-30 gap-2 mt-2">
        <img
          src="https://www.raspberrypi.com/app/uploads/2022/09/Screenshot-2022-09-08-at-09.53.03.png"
          alt="product"
          className="w-full object-cover border-1 border-gray-400"
        />
        <img
          src="https://www.raspberrypi.com/app/uploads/2022/09/Screenshot-2022-09-08-at-09.53.03.png"
          alt="product"
          className="w-full object-cover border-1 border-gray-400"
        />
        <img
          src="https://www.raspberrypi.com/app/uploads/2022/09/Screenshot-2022-09-08-at-09.53.03.png"
          alt="product"
          className="w-full object-cover border-1 border-gray-400"
        />
      </div>
    </div>
  );
}

export default Collage;
