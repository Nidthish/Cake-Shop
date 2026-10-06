import { redirect } from "next/navigation";

export default async function SearchOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : typeof params.orderId === "string" ? params.orderId : "";
  if (q) {
    redirect(`/track-order?q=${encodeURIComponent(q)}`);
  }
  redirect("/track-order");
}
