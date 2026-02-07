import svgPaths from "./svg-j4bl0xfazj";

function Label() {
  return (
    <div className="absolute content-stretch flex h-[15.997px] items-start left-[16px] top-[16px] w-[336.616px]" data-name="Label">
      <p className="flex-[1_0_0] font-['Mplus_1p:Medium',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#3c464f] text-[12px] tracking-[0.6px] uppercase whitespace-pre-wrap">What is the customer buying?</p>
    </div>
  );
}

function TextArea() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex h-[86px] items-start left-[0.3px] overflow-clip pl-[12px] pr-[48px] py-[12px] rounded-[14px] top-[0.32px] w-[336px]" data-name="Text Area">
      <p className="font-['Mplus_1p:Regular',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#99a1af] text-[18px] tracking-[-0.4395px]">{`Type '2kg rice, 1 sugar'...`}</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[19.993px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_37.5%_37.5%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-7.69%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66437 12.4957">
            <path d={svgPaths.p35237b80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66609" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_20.83%_20.83%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-11.11%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3287 9.1635">
            <path d={svgPaths.p37195c0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66609" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-1/2 right-1/2 top-[79.17%]" data-name="Vector">
        <div className="absolute inset-[-33.33%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66609 4.16523">
            <path d="M0.833046 0.833046V3.33218" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66609" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-[279.39px] pt-[7.993px] px-[7.993px] rounded-[23448900px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] size-[35.979px] top-[38.54px]" data-name="Button">
      <Icon />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[86.513px] left-[16px] top-[43.99px] w-[336.616px]" data-name="Container">
      <TextArea />
      <Button />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[0.52%_0]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.0003 23.7508">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pd610340} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p14ff900} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p222f1a80} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function StreamlineFreehandEditPenWritePaper() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="streamline-freehand:edit-pen-write-paper">
      <Group />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#0f4c81] relative rounded-[23448900px] shrink-0 w-[98px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center justify-center px-[12px] py-[6px] relative w-full">
        <StreamlineFreehandEditPenWritePaper />
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[-0.1504px]">Note</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex h-[35.99px] items-start justify-end left-[16px] top-[142.51px] w-[336.616px]" data-name="Container">
      <Button1 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white border-[0.699px] border-[rgba(15,76,129,0.67)] border-solid relative rounded-[16px] size-full" data-name="Container">
      <Label />
      <Container1 />
      <Container2 />
    </div>
  );
}