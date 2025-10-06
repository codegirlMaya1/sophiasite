// src/components/Logo.tsx
type Props = {
  size?: number;          // rendered size in px (the PNG is 512x512 so it scales cleanly)
  title?: string;         // accessible label
  className?: string;     // optional styling hook
};

export default function Logo({
  size = 34,
  title = "Sophia — Software Solutions",
  className
}: Props) {
  const px = Math.round(size);
  return (
    <img
      src="/logo-cloud-s.png"     // served from /public
      alt={title}
      width={px}
      height={px}
      className={className}
      style={{ display: "block", width: px, height: px }}
      decoding="async"
      loading="eager"
      fetchPriority="high"
    />
  );
}
