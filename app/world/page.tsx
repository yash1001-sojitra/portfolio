import type { Metadata } from "next";
import { WorldLoader } from "@/components/world";

export const metadata: Metadata = {
  title: "Yash World — 3D Portfolio",
  description:
    "Explore Yashkumar Rank's portfolio as a small walkable 3D town: projects, games, skills, career, certificates and contact, built with three.js.",
};

export default function WorldPage() {
  return <WorldLoader />;
}
