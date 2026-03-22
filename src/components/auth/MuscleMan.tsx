"use client";
// ============================================
// MuscleMan — Animated SVG bodybuilder that grows
// with form input progress
// ============================================
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface MuscleManProps {
  progress: number; // 0 to 1
}

export default function MuscleMan({ progress }: MuscleManProps) {
  const leftBicepRef = useRef<SVGGElement>(null);
  const rightBicepRef = useRef<SVGGElement>(null);
  const chestRef = useRef<SVGGElement>(null);
  const sparksRef = useRef<SVGGElement>(null);
  const containerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Scale muscles based on progress
    const muscleScale = 1 + progress * 0.35; // 1.0 → 1.35
    const chestScale = 1 + progress * 0.2;   // 1.0 → 1.2

    if (leftBicepRef.current) {
      gsap.to(leftBicepRef.current, {
        scaleX: muscleScale,
        scaleY: muscleScale,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    }

    if (rightBicepRef.current) {
      gsap.to(rightBicepRef.current, {
        scaleX: muscleScale,
        scaleY: muscleScale,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    }

    if (chestRef.current) {
      gsap.to(chestRef.current, {
        scaleX: chestScale,
        scaleY: chestScale,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    // Show sparks when progress > 0.4
    if (sparksRef.current) {
      gsap.to(sparksRef.current, {
        opacity: progress > 0.4 ? 1 : 0,
        duration: 0.3,
      });
    }
  }, [progress]);

  // Subtle idle bounce
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        y: -5,
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Gym background elements */}
      <svg
        ref={containerRef}
        viewBox="0 0 400 450"
        className="w-[320px] md:w-[380px] h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* === GYM BACKGROUND === */}
        {/* Punching bag */}
        <g opacity="0.3">
          <line x1="60" y1="0" x2="60" y2="80" stroke="#666" strokeWidth="3" />
          <rect x="42" y="80" width="36" height="70" rx="12" fill="#dc2626" opacity="0.6" />
          <rect x="42" y="80" width="36" height="8" rx="4" fill="#991b1b" opacity="0.7" />
        </g>

        {/* Dumbbell on floor */}
        <g opacity="0.25" transform="translate(40, 370)">
          <circle cx="0" cy="10" r="14" fill="#555" />
          <circle cx="0" cy="10" r="10" fill="#444" />
          <rect x="0" y="6" width="60" height="8" rx="3" fill="#666" />
          <circle cx="60" cy="10" r="14" fill="#555" />
          <circle cx="60" cy="10" r="10" fill="#444" />
        </g>

        {/* Mirror on right */}
        <g opacity="0.2">
          <rect x="310" y="60" width="55" height="90" rx="4" fill="#333" stroke="#555" strokeWidth="1.5" />
          <rect x="315" y="65" width="45" height="80" rx="2" fill="#1a1a1a" />
          <line x1="325" y1="70" x2="325" y2="140" stroke="#444" strokeWidth="0.5" />
        </g>

        {/* Barbell rack hint */}
        <g opacity="0.15">
          <line x1="330" y1="180" x2="330" y2="250" stroke="#555" strokeWidth="3" />
          <line x1="370" y1="180" x2="370" y2="250" stroke="#555" strokeWidth="3" />
          <rect x="310" y="195" width="80" height="6" rx="3" fill="#666" />
        </g>

        {/* === CHARACTER === */}
        <g transform="translate(200, 220)">
          {/* Shadow under feet */}
          <ellipse cx="0" cy="175" rx="60" ry="10" fill="#111" opacity="0.4" />

          {/* Legs — Jeans */}
          <g>
            {/* Left leg */}
            <path d="M-15,95 L-25,170 L-10,170 L-5,95 Z" fill="#1e3a5f" />
            {/* Right leg */}
            <path d="M5,95 L10,170 L25,170 L15,95 Z" fill="#1e3a5f" />
            {/* Left shoe */}
            <path d="M-28,167 L-28,175 L-5,175 L-5,170 L-25,170 Z" fill="#111" />
            {/* Right shoe */}
            <path d="M8,170 L8,175 L32,175 L32,167 L25,170 Z" fill="#111" />
          </g>

          {/* Torso / Chest — Red tank top */}
          <g ref={chestRef} style={{ transformOrigin: "0px 50px" }}>
            <path
              d="M-30,10 C-35,30 -35,70 -20,95 L20,95 C35,70 35,30 30,10 Z"
              fill="#dc2626"
            />
            {/* Tank top straps */}
            <path d="M-15,-15 L-25,10 L-18,10 L-10,-12 Z" fill="#dc2626" />
            <path d="M15,-15 L25,10 L18,10 L10,-12 Z" fill="#dc2626" />
            {/* Chest definition lines */}
            <path d="M0,15 L0,60" stroke="#b91c1c" strokeWidth="1" opacity="0.4" />
            <path d="M-12,25 Q0,35 12,25" stroke="#b91c1c" strokeWidth="1" fill="none" opacity="0.3" />
          </g>

          {/* Head */}
          <g>
            {/* Neck */}
            <rect x="-8" y="-25" width="16" height="15" rx="4" fill="#d4a574" />
            {/* Head shape */}
            <ellipse cx="0" cy="-45" rx="22" ry="24" fill="#d4a574" />
            {/* Hair */}
            <path d="M-22,-55 Q-22,-72 0,-72 Q22,-72 22,-55 L22,-50 Q15,-58 0,-58 Q-15,-58 -22,-50 Z"
              fill="#1a1a1a" />
            {/* Eyes */}
            <ellipse cx="-8" cy="-48" rx="3" ry="3.5" fill="#1a1a1a" />
            <ellipse cx="8" cy="-48" rx="3" ry="3.5" fill="#1a1a1a" />
            <circle cx="-7" cy="-49" r="1" fill="#fff" />
            <circle cx="9" cy="-49" r="1" fill="#fff" />
            {/* Eyebrows — determined expression based on progress */}
            <line
              x1="-14" y1={-57 + progress * 2}
              x2="-4" y2={-56 - progress * 2}
              stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"
            />
            <line
              x1="4" y1={-56 - progress * 2}
              x2="14" y2={-57 + progress * 2}
              stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"
            />
            {/* Mouth — from neutral to grin */}
            {progress < 0.5 ? (
              <line x1="-5" y1="-37" x2="5" y2="-37" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M-6,-38 Q0,-32 6,-38" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
          </g>

          {/* === LEFT ARM (Flexed) === */}
          <g ref={leftBicepRef} style={{ transformOrigin: "-30px 10px" }}>
            {/* Upper arm */}
            <path d="M-30,10 L-55,-15 L-65,-10 L-38,18 Z" fill="#d4a574" />
            {/* Bicep bulge */}
            <ellipse cx="-48" cy="0" rx="14" ry="10"
              fill="#c4945a" transform="rotate(-50 -48 0)" />
            {/* Forearm */}
            <path d="M-55,-15 L-50,-50 L-40,-48 L-45,-12 Z" fill="#d4a574" />
            {/* Fist */}
            <circle cx="-45" cy="-52" r="9" fill="#d4a574" />
            <path d="M-52,-52 Q-45,-58 -38,-52" stroke="#c4945a" strokeWidth="1" fill="none" />
          </g>

          {/* === RIGHT ARM (Flexed) === */}
          <g ref={rightBicepRef} style={{ transformOrigin: "30px 10px" }}>
            {/* Upper arm */}
            <path d="M30,10 L55,-15 L65,-10 L38,18 Z" fill="#d4a574" />
            {/* Bicep bulge */}
            <ellipse cx="48" cy="0" rx="14" ry="10"
              fill="#c4945a" transform="rotate(50 48 0)" />
            {/* Forearm */}
            <path d="M55,-15 L50,-50 L40,-48 L45,-12 Z" fill="#d4a574" />
            {/* Fist */}
            <circle cx="45" cy="-52" r="9" fill="#d4a574" />
            <path d="M38,-52 Q45,-58 52,-52" stroke="#c4945a" strokeWidth="1" fill="none" />
          </g>

          {/* === SPARK / POWER EFFECTS === */}
          <g ref={sparksRef} opacity="0">
            {/* Left sparks */}
            <g className="muscle-spark-left">
              <line x1="-70" y1="-15" x2="-80" y2="-20" stroke="#ff4444" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="-68" y1="-25" x2="-78" y2="-32" stroke="#ff6666" strokeWidth="2" strokeLinecap="round" />
              <line x1="-72" y1="-5" x2="-82" y2="-5" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" />
            </g>
            {/* Right sparks */}
            <g className="muscle-spark-right">
              <line x1="70" y1="-15" x2="80" y2="-20" stroke="#ff4444" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="68" y1="-25" x2="78" y2="-32" stroke="#ff6666" strokeWidth="2" strokeLinecap="round" />
              <line x1="72" y1="-5" x2="82" y2="-5" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" />
            </g>
            {/* Top power burst */}
            {progress > 0.7 && (
              <g>
                <line x1="-15" y1="-80" x2="-20" y2="-95" stroke="#ff3333" strokeWidth="2" strokeLinecap="round" />
                <line x1="0" y1="-82" x2="0" y2="-98" stroke="#ff4444" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="15" y1="-80" x2="20" y2="-95" stroke="#ff3333" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
