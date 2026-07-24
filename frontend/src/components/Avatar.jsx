import { useState } from "react";

const sizeMap = {
  xs:   { container: "w-8 h-8",   text: "text-xs" },
  sm:   { container: "w-10 h-10", text: "text-sm" },
  md:   { container: "w-12 h-12", text: "text-base" },
  lg:   { container: "w-14 h-14", text: "text-lg" },
  xl:   { container: "w-16 h-16", text: "text-xl" },
  "2xl":{ container: "w-20 h-20", text: "text-2xl" },
  "3xl":{ container: "w-32 h-32", text: "text-4xl" },
};

const gradients = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-600",
  "from-orange-400 to-amber-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-blue-600",
  "from-fuchsia-500 to-pink-600",
  "from-sky-500 to-blue-500",
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function getGradient(name = "") {
  const idx = name ? name.charCodeAt(0) % gradients.length : 0;
  return gradients[idx];
}

// ─── Main Avatar Component ──────────────────────────────────────────
const Avatar = ({ src, alt = "User", size = "md", className = "" }) => {
  const [hasError, setHasError] = useState(false);

  const { container, text } = sizeMap[size] || sizeMap["md"];
  const showFallback = !src || hasError;

  return (
    <div
      className={`${container} ${className} rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center`}
    >
      {showFallback ? (
        <InitialsAvatar alt={alt} textSize={text} containerSize={container} />
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-full"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};

// ─── Initials Fallback ──────────────────────────────────────────────
const InitialsAvatar = ({ alt, textSize, containerSize }) => {
  const initials = getInitials(alt) || "?";
  const gradient = getGradient(alt);

  return (
    <div
      className={`${containerSize} rounded-full flex items-center justify-center bg-gradient-to-br ${gradient}`}
    >
      <span className={`${textSize} font-bold text-white select-none leading-none`}>
        {initials}
      </span>
    </div>
  );
};

export default Avatar;
