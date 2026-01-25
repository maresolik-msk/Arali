import svgPaths from "./svg-mkjwe92tm9";

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
      <div aria-hidden="true" className="absolute border-[#f5f9fc] border-[3.88px] border-solid inset-0 pointer-events-none rounded-[26037400px] shadow-[0px_8px_10px_-6px_rgba(15,76,129,0.3)]" />
    </div>
  );
}

function IconamoonHomeLight() {
  return (
    <div className="absolute left-1/2 size-[24px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]" data-name="iconamoon:home-light">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="iconamoon:home-light">
          <path d={svgPaths.p5b53800} fill="var(--fill-0, black)" id="Vector" stroke="var(--stroke-0, black)" strokeWidth="1.225" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#f0f2f4] overflow-clip relative rounded-[42px] shrink-0 size-[42px]">
      <IconamoonHomeLight />
    </div>
  );
}

function ProiconsBox() {
  return (
    <div className="absolute left-[calc(50%+0.33px)] size-[24px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]" data-name="proicons:box">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="proicons:box">
          <path d={svgPaths.pdea4710} id="Vector" stroke="var(--stroke-0, black)" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="1.4" />
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

function TablerBulbFilled() {
  return (
    <div className="absolute left-[11.67px] size-[24px] top-[12.5px]" data-name="tabler:bulb-filled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tabler:bulb-filled">
          <path d={svgPaths.pf2ecf00} id="Vector" stroke="var(--stroke-0, black)" strokeOpacity="0.5" strokeWidth="1.4" />
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

function Group() {
  return (
    <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p2166df00} fill="var(--fill-0, black)" fillOpacity="0.5" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CuidaMenuOutline() {
  return (
    <div className="absolute left-1/2 overflow-clip rounded-[8px] size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="cuida:menu-outline">
      <Group />
    </div>
  );
}

function Frame4() {
  return (
    <div className="overflow-clip relative rounded-[42px] shrink-0 size-[48px]">
      <CuidaMenuOutline />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white content-stretch flex h-[56px] items-center justify-between p-[6px] relative rounded-[46px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.12)] shrink-0 w-[209px]">
      <Frame />
      <Frame1 />
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function IxAi() {
  return (
    <div className="absolute left-[16px] size-[24px] top-[16px]" data-name="ix:ai">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ix:ai">
          <path d={svgPaths.p1a0eb580} fill="var(--fill-0, #0F4C81)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white overflow-clip relative rounded-[100px] shadow-[0px_0px_44px_0px_rgba(0,0,0,0.16)] shrink-0 size-[56px]">
      <IxAi />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame2 />
      <Frame5 />
      <Frame6 />
    </div>
  );
}

export default function Frame8() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[24px] py-[12px] relative size-full">
      <Frame7 />
    </div>
  );
}