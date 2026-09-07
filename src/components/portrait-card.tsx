import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type CardVisual = {
  name: string;
  image?: string;
  tagline?: string;
  featured?: boolean;
  className?: string;
};

function Face({ name, image, tagline, featured, className }: CardVisual) {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(image) && !broken;
  return (
    <div className={cn("group relative block overflow-hidden rounded-xl bg-elevated", className)}>
      <div className={cn("overflow-hidden", featured ? "banner" : "portrait")}>
        {showImage ? (
          <img
            src={image}
            alt=""
            className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="flex size-full items-center justify-center font-display text-4xl text-muted">
            {name.slice(0, 1)}
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <p className={cn("font-display leading-tight text-fg", featured ? "text-2xl sm:text-3xl" : "text-lg")}>
          {name}
        </p>
        {tagline ? (
          <p className={cn("mt-1 text-muted", featured ? "line-clamp-2 text-sm" : "line-clamp-2 text-xs")}>
            {tagline}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function PortraitCard({
  name,
  image,
  tagline,
  featured,
  to,
  params,
  onClick,
}: CardVisual & {
  to?: "/character/$id" | "/play/$id" | "/story/$id" | "/world/$id";
  params?: { id: string };
  onClick?: () => void;
}) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={featured ? "col-span-2 text-left" : "text-left"}>
        <Face name={name} image={image} tagline={tagline} featured={featured} />
      </button>
    );
  }
  if (!to || !params) return <Face name={name} image={image} tagline={tagline} featured={featured} />;
  return (
    <Link to={to} params={params} className={featured ? "col-span-2" : undefined}>
      <Face name={name} image={image} tagline={tagline} featured={featured} />
    </Link>
  );
}
