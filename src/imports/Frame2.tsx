import imgImage1 from "figma:asset/18cf32dc4edc4f7ccc61c9bea27f743107dbf224.png";

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute left-0 size-[232px] top-0" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
    </div>
  );
}