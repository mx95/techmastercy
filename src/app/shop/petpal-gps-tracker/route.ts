import { NextResponse } from "next/server";
import { petpal } from "@/content/petpal";

/** Hard redirect so crawlers and non-JS clients leave TechmasterCY checkout. */
export function GET() {
  return NextResponse.redirect(petpal.shopUrl, 308);
}
