import imgImageShopOwnerManagingInventory from "figma:asset/3c6d6ca1ffe84cca39990042ae11c324407334e1.png";

function ImageShopOwnerManagingInventory() {
  return (
    <div className="absolute inset-0 size-full" data-name="Image (Shop owner managing inventory)">
      <img alt="" className="absolute inset-0 object-cover pointer-events-none size-full" src={imgImageShopOwnerManagingInventory} />
    </div>
  );
}

function Container() {
  return <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,76,129,0.2)] opacity-60 to-[rgba(0,0,0,0)]" data-name="Container" />;
}

export default function Container1() {
  return (
    <div className="overflow-clip relative rounded-[48px] size-full" data-name="Container">
      <ImageShopOwnerManagingInventory />
      <Container />
    </div>
  );
}
