import svgPaths from "./svg-bjaxhhb966";
import imgImageWatchFreshness from "figma:asset/bb4678c6cac92df9f360bbc019d27acc25ccdbed.png";

function ImageWatchFreshness() {
  return (
    <div className="absolute h-[256.932px] left-0 top-0 w-[343.102px]" data-name="Image (Watch Freshness)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWatchFreshness} />
    </div>
  );
}

function Container() {
  return <div className="absolute bg-[#0f4c81] h-[208px] left-[0.23px] opacity-20 top-[48.99px] w-[343px]" data-name="Container" />;
}

function Container1() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.5)] h-[257px] left-[0.23px] opacity-60 to-[rgba(0,0,0,0)] top-[-0.01px] w-[343px]" data-name="Container" />;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[23.995px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9946 23.9946">
        <g id="Icon">
          <path d={svgPaths.p6660cf0} id="Vector" stroke="var(--stroke-0, #0F4C81)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99955" />
          <path d={svgPaths.p2da27f00} id="Vector_2" stroke="var(--stroke-0, #0F4C81)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99955" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[rgba(255,255,255,0.9)] relative rounded-[26037400px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[47.989px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-0 pr-[0.012px] py-0 relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[28.008px] relative shrink-0 w-[147.811px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[28px] left-0 not-italic text-[18px] text-white top-[0.1px] tracking-[0.0105px] whitespace-pre">Watch Freshness</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex gap-[15.992px] h-[47.989px] items-center left-[23.99px] top-[184.95px] w-[211.792px]" data-name="Container">
      <Container2 />
      <Text />
    </div>
  );
}

export default function Container4() {
  return (
    <div className="bg-white border-[0.776px] border-[rgba(15,76,129,0.05)] border-solid overflow-clip relative rounded-[24px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-full" data-name="Container">
      <ImageWatchFreshness />
      <Container />
      <Container1 />
      <Container3 />
    </div>
  );
}
