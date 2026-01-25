import svgPaths from "./svg-ga16o7ulxf";

function MdiLightEmail() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mdi-light:email">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mdi-light:email">
          <path d={svgPaths.p22cfae00} fill="var(--fill-0, #062844)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0.6px] border-[rgba(0,0,0,0.5)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center p-[12px] relative w-full">
          <MdiLightEmail />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.5)] whitespace-pre">Enter Email</p>
        </div>
      </div>
    </div>
  );
}

function MaterialSymbolsLightLock() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="material-symbols-light:lock">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="material-symbols-light:lock">
          <path d={svgPaths.p5970600} fill="var(--fill-0, #082B48)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[281px]">
      <MaterialSymbolsLightLock />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.5)] whitespace-pre">Password</p>
    </div>
  );
}

function BasilEyeSolid() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="basil:eye-solid">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="basil:eye-solid">
          <path d={svgPaths.p86e1070} fill="var(--fill-0, #766F71)" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p3fb81550} fill="var(--fill-0, #766F71)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[0.6px] border-[rgba(0,0,0,0.5)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[12px] relative w-full">
          <Frame2 />
          <BasilEyeSolid />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center justify-between leading-[1.5] not-italic relative shrink-0 text-[#104f86] text-[12px] text-right w-full whitespace-pre">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0">At least 6 characters</p>
      <p className="[text-underline-position:from-font] decoration-solid font-['Inter:Medium',sans-serif] font-medium relative shrink-0 underline">Forgot Password?</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-end justify-center relative shrink-0 w-full">
      <Frame3 />
      <Frame10 />
    </div>
  );
}

function LsiconRightOutline() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="lsicon:right-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="lsicon:right-outline">
          <path d="M9 6.75L14.25 12L9 17.25" id="Vector" stroke="var(--stroke-0, white)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#0f4c81] h-[54px] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[10px] items-center justify-center pl-[8px] pr-[16px] py-[10px] relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[1.5] not-italic relative shrink-0 text-[16px] text-white whitespace-pre">Sign in</p>
          <LsiconRightOutline />
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center justify-center leading-[1.5] not-italic relative shrink-0 w-[155px] whitespace-pre-wrap">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[14px] text-black w-full">Don’t have an account?</p>
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[#0b355a] text-[16px] text-center underline w-full">Register</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center justify-center relative shrink-0 w-full">
      <Frame5 />
      <Frame9 />
      <Frame4 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.8)] content-stretch flex flex-col gap-[18px] items-start justify-center left-[calc(50%+0.5px)] px-[12px] py-[24px] rounded-[12px] top-[235px] translate-x-[-50%] w-[360px]">
      <p className="font-['Telegraf:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[#0b2a45] text-[24px] whitespace-pre">Welcome back</p>
      <Frame6 />
    </div>
  );
}

function Group() {
  return (
    <div className="h-[53.963px] relative shrink-0 w-[62.21px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 62.2099 53.9629">
        <g id="Group 42">
          <path d={svgPaths.p270b3880} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p19496a80} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-full">
      <Group />
      <p className="font-['Telegraf:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[54px] text-center text-white whitespace-pre">Arali</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-1/2 top-[101px] translate-x-[-50%] w-[197px]">
      <Frame8 />
      <p className="font-['Telegraf:Regular',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.56)] tracking-[2.1px] w-full whitespace-pre-wrap">{`  Save little, Save more`}</p>
    </div>
  );
}

export default function Login() {
  return (
    <div className="relative size-full" data-name="Login 1" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 393 852\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(1.5 97 -28.933 0.44742 197 189)\\\'><stop stop-color=\\\'rgba(16,76,129,1)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(10,46,78,1)\\\' offset=\\\'0.5\\\'/><stop stop-color=\\\'rgba(7,31,53,1)\\\' offset=\\\'0.75\\\'/><stop stop-color=\\\'rgba(3,16,27,1)\\\' offset=\\\'1\\\'/></radialGradient></defs></svg>')" }}>
      <div className="absolute h-[490.04px] left-[-116px] top-[385px] w-[463px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Vector"></g>
        </svg>
      </div>
      <Frame7 />
      <Frame11 />
    </div>
  );
}