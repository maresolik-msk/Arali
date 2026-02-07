const imgImageShopOwnerManagingInventory = "https://images.unsplash.com/photo-1765744893064-dce3184289ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9yZSUyMGludmVudG9yeXxlbnwxfHx8fDE3Njk5MzYyNzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";


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
