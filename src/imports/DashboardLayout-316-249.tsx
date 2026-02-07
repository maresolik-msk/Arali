import svgPaths from "./svg-f4cenm5auu";

function DuoIconsMenu() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="duo-icons:menu">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="duo-icons:menu">
          <path d={svgPaths.pb696400} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.pa561c00} fill="var(--fill-0, white)" id="Vector_2" opacity="0.3" />
          <path d={svgPaths.p1bb637a0} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.pa3b5180} fill="var(--fill-0, white)" id="Vector_4" opacity="0.3" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <DuoIconsMenu />
      <p className="font-['Mplus_1p:Medium',sans-serif] leading-[36px] not-italic relative shrink-0 text-[#ecf2f7] text-[22px] tracking-[-0.3545px]">Products and Stocks</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[8.33%_12.76%_0.77%_12.76%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.8765 21.814">
        <g id="Group">
          <g id="Vector" />
          <path d={svgPaths.p318ec280} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function MingcuteNotificationNewdotFill() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="mingcute:notification-newdot-fill">
      <Group />
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[11.991px] px-[11.991px] relative rounded-[26037400px] shrink-0 size-[43.976px]" data-name="Button">
      <MingcuteNotificationNewdotFill />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame />
      <Button />
    </div>
  );
}

function MynauiSearch() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mynaui:search">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mynaui:search">
          <path d={svgPaths.p32697080} id="Vector" stroke="var(--stroke-0, #3C464F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-white content-stretch flex gap-[12px] h-[40px] items-center p-[12px] relative rounded-[4px] shrink-0 w-[354px]">
      <MynauiSearch />
      <p className="font-['Mplus_1p:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#3a4759] text-[16px] tracking-[-0.3125px]">Search by product name or SKU</p>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <div className="bg-[#104f86] content-stretch flex flex-col gap-[16px] items-center justify-center p-[24px] relative rounded-bl-[16px] rounded-br-[16px] size-full" data-name="DashboardLayout">
      <div aria-hidden="true" className="absolute border-b-[0.776px] border-black border-solid inset-0 pointer-events-none rounded-bl-[16px] rounded-br-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <Frame1 />
      <Frame2 />
    </div>
  );
}