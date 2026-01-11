// Milk product image from Unsplash
const imgImage1 = "https://images.unsplash.com/photo-1635436338433-89747d0ca0ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxrJTIwYm90dGxlJTIwZGFpcnl8ZW58MXx8fHwxNzY4MDYyNzY2fDA&ixlib=rb-4.1.0&q=80&w=1080";

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute left-0 size-[232px] top-0" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
    </div>
  );
}