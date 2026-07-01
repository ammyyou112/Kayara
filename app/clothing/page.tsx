import { redirect } from "next/navigation";

// The home page is the main clothing storefront, so the standalone /clothing
// landing is redundant — send it home.
export default function ClothingPage() {
  redirect("/");
}
