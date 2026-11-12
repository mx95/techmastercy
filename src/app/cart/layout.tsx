import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Cart",
  description: "Review items in your TechmasterCY cart before checkout.",
  path: "/cart",
  noIndex: true,
});

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
