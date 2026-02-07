import svgPaths from "./svg-21t6tarvx8";

function Group() {
  return (
    <div className="absolute inset-[8.33%_8.38%_8.33%_8.28%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.6667 21.6664">
        <g id="Group">
          <path d={svgPaths.p21674600} fill="var(--fill-0, #0F4C81)" id="Vector" opacity="0.16" />
          <path d={svgPaths.p26828100} fill="var(--fill-0, #0F4C81)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function IconamoonHomeDuotone() {
  return (
    <div className="overflow-clip relative rounded-[7px] shrink-0 size-[26px]" data-name="iconamoon:home-duotone">
      <Group />
    </div>
  );
}

function DashboardLayout() {
  return (
    <div className="content-stretch flex flex-col h-[8px] items-center justify-center relative shrink-0" data-name="DashboardLayout">
      <p className="font-['Mplus_1p:Medium',sans-serif] leading-[15px] not-italic relative shrink-0 text-[#0f4c81] text-[10px] tracking-[0.1172px]">Home</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center overflow-clip p-[8px] relative rounded-[42px] shrink-0">
      <IconamoonHomeDuotone />
      <DashboardLayout />
    </div>
  );
}

function ProiconsBox() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[26px] top-1/2" data-name="proicons:box">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
        <g id="proicons:box">
          <path d={svgPaths.p11dc5840} id="Vector" stroke="var(--stroke-0, #546F86)" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="overflow-clip relative rounded-[42px] shrink-0 size-[48px]">
      <ProiconsBox />
    </div>
  );
}

function IcRoundPlus() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="ic:round-plus">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="ic:round-plus">
          <path d={svgPaths.pe998d00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#0f4c81] relative rounded-[26037400px] shrink-0 size-[56px]">
      <div className="content-stretch flex items-center justify-center overflow-clip pl-[3.88px] pr-[3.892px] py-[3.88px] relative rounded-[inherit] size-full">
        <IcRoundPlus />
      </div>
      <div aria-hidden="true" className="absolute border-[#eaedf0] border-[3.88px] border-solid inset-0 pointer-events-none rounded-[26037400px] shadow-[0px_8px_10px_-6px_rgba(15,76,129,0.3)]" />
    </div>
  );
}

function TablerBulbFilled() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[26px] top-1/2" data-name="tabler:bulb-filled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
        <g id="tabler:bulb-filled">
          <path d={svgPaths.p21243980} id="Vector" stroke="var(--stroke-0, #546F86)" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="overflow-clip relative rounded-[42px] shrink-0 size-[48px]">
      <TablerBulbFilled />
    </div>
  );
}

function IxAi() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[26px] top-1/2" data-name="ix:ai">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
        <g id="ix:ai">
          <path d={svgPaths.p34fb2b40} fill="var(--fill-0, #546F86)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="overflow-clip relative rounded-[100px] shadow-[0px_0px_44px_0px_rgba(0,0,0,0.16)] shrink-0 size-[56px]">
      <IxAi />
    </div>
  );
}

export default function Frame5() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between px-[24px] py-[12px] relative size-full">
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame4 />
    </div>
  );
}