import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDbProducts, getProductById, getSimilarProducts, getCardPrice } from "@/lib/products";
import ProductDetailClient from "@/components/products/ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const allProducts = await getDbProducts();
  const product = getProductById(slug, allProducts);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allProducts = await getDbProducts();
  const product = getProductById(slug, allProducts);
  if (!product) notFound();

  const similar = getSimilarProducts(product.id, 4, allProducts);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.image,
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: getCardPrice(product),
              availability: "https://schema.org/InStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            },
          }),
        }}
      />
      <ProductDetailClient product={product} similar={similar} />
    </>
  );
}
