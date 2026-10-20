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

  const cleanName = product.name.replace(/&amp;/g, "&");
  const fullImageUrl = product.image.startsWith("http")
    ? product.image
    : `https://lollipopcakeshop.in${product.image}`;
  const description =
    product.description ||
    `Order fresh ${cleanName} online in Trichy from Lollipop Cake Shop. 100% fresh, handcrafted with premium ingredients, fast delivery.`;

  return {
    title: `${cleanName} in Trichy | Lollipop Cake Shop`,
    description,
    alternates: {
      canonical: `https://lollipopcakeshop.in/products/${slug}`,
    },
    openGraph: {
      title: `${cleanName} in Trichy | Lollipop Cake Shop`,
      description,
      url: `https://lollipopcakeshop.in/products/${slug}`,
      siteName: "Lollipop Cake Shop",
      type: "website",
      images: [
        {
          url: fullImageUrl,
          alt: `${cleanName} cake from Lollipop Cake Shop`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanName} in Trichy | Lollipop Cake Shop`,
      description,
      images: [fullImageUrl],
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
  const cleanName = product.name.replace(/&amp;/g, "&");
  const fullImageUrl = product.image.startsWith("http")
    ? product.image
    : `https://lollipopcakeshop.in${product.image}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://lollipopcakeshop.in/products/${slug}#product`,
        name: cleanName,
        description: product.description || `${cleanName} handcrafted fresh daily by Lollipop Cake Shop in Trichy.`,
        image: [fullImageUrl],
        brand: {
          "@type": "Brand",
          name: "Lollipop Cake Shop",
        },
        offers: {
          "@type": "Offer",
          url: `https://lollipopcakeshop.in/products/${slug}`,
          priceCurrency: "INR",
          price: getCardPrice(product),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Bakery",
            name: "Lollipop Cake Shop",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating || 5.0,
          reviewCount: product.reviewCount || 1,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://lollipopcakeshop.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Cakes",
            item: "https://lollipopcakeshop.in/cakes",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: cleanName,
            item: `https://lollipopcakeshop.in/products/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <ProductDetailClient product={product} similar={similar} />
    </>
  );
}
