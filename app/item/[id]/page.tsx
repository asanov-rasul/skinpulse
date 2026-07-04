import { notFound } from "next/navigation";
import { getMockItemById, MOCK_ITEMS } from "@/lib/mock/items";
import { ItemDetailView } from "@/components/item/ItemDetailView";

export default function ItemPage({ params }: { params: { id: string } }) {
  const item = getMockItemById(params.id);
  if (!item) notFound();

  const similar = MOCK_ITEMS.filter(
    (i) => i.id !== item.id && i.weaponType !== item.weaponType
  ).slice(0, 6);

  return <ItemDetailView item={item} similar={similar} />;
}
