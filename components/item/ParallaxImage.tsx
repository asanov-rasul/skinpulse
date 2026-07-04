"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { RARITY_COLOR, type Rarity } from "@/lib/utils/rarity";

export function ParallaxImage({
  src,
  alt,
  rarity,
  layoutId,
}: {
  src: string;
  alt: string;
  rarity: Rarity;
  layoutId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const translateX = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), {
    stiffness: 150,
    damping: 20,
  });
  const translateY = useSpring(useTransform(y, [-0.5, 0.5], [-14, 14]), {
    stiffness: 150,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass relative h-72 overflow-hidden rounded-2xl sm:h-96"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${RARITY_COLOR[rarity]}26, transparent 70%)`,
        }}
      />
      <motion.div
        layoutId={layoutId}
        style={{ x: translateX, y: translateY }}
        className="relative h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-8 drop-shadow-2xl"
          sizes="(max-width: 640px) 100vw, 600px"
          unoptimized
          priority
        />
      </motion.div>
    </div>
  );
}
