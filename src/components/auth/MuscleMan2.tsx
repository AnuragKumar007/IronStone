"use client";
// ============================================
// MuscleMan2 — Flat-design gym character that
// grows muscles as form fields are filled
// ============================================
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface MuscleMan2Props {
  progress: number; // 0 to 1
}

export default function MuscleMan2({ progress }: MuscleMan2Props) {
  const containerRef = useRef<SVGSVGElement>(null);
  const leftArmRef = useRef<SVGGElement>(null);
  const rightArmRef = useRef<SVGGElement>(null);
  const chestRef = useRef<SVGGElement>(null);
  const sparksRef = useRef<SVGGElement>(null);

  // Muscle scaling
  useEffect(() => {
    const armScale = 1 + progress * 1.2; // 1.0 → 2.2
    const chestScaleX = 1 + progress * 0.45; // 1.0 → 1.45
    const chestScaleY = 1 + progress * 0.25;

    if (leftArmRef.current) {
      gsap.to(leftArmRef.current, {
        scaleX: armScale,
        scaleY: armScale,
        duration: 0.5,
        ease: "elastic.out(1, 0.6)",
      });
    }
    if (rightArmRef.current) {
      gsap.to(rightArmRef.current, {
        scaleX: armScale,
        scaleY: armScale,
        duration: 0.5,
        ease: "elastic.out(1, 0.6)",
      });
    }
    if (chestRef.current) {
      gsap.to(chestRef.current, {
        scaleX: chestScaleX,
        scaleY: chestScaleY,
        duration: 0.4,
        ease: "power2.out",
      });
    }
    if (sparksRef.current) {
      gsap.to(sparksRef.current, {
        opacity: progress > 0.35 ? Math.min(1, (progress - 0.35) * 2.5) : 0,
        duration: 0.3,
      });
    }
  }, [progress]);

  // Idle breathing
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        y: -4,
        duration: 1.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  // Dynamic values
  const p = progress;
  const skinColor = "#E8A87C";
  const skinShadow = "#D4956A";
  const tankColor = "#E84C4C";
  const tankShadow = "#D13E3E";
  const jeansColor = "#4A6FA5";
  const jeansShadow = "#3D5C8A";
  const hairColor = "#1A1A1A";
  const shoeColor = "#222";

  // Eyebrow anger
  const browAngle = p * 6;

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <svg
        ref={containerRef}
        viewBox="0 0 400 500"
        className="w-[300px] md:w-[360px] h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ====== GYM BACKGROUND ====== */}

        {/* Punching bag — left */}
        <g opacity="0.35">
          {/* Chain */}
          <line x1="68" y1="0" x2="68" y2="85" stroke="#555" strokeWidth="2.5" />
          <circle cx="68" cy="85" r="4" fill="#666" />
          {/* Bag body */}
          <path
            d="M50,90 Q48,92 48,100 L48,160 Q48,175 68,175 Q88,175 88,160 L88,100 Q88,92 86,90 Z"
            fill="#dc2626"
            opacity="0.7"
          />
          {/* Bag top band */}
          <rect x="50" y="88" width="36" height="10" rx="3" fill="#b91c1c" opacity="0.8" />
          {/* Bag highlight */}
          <path d="M56,100 L56,155" stroke="#ef4444" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
        </g>

        {/* Dumbbell on floor — left */}
        <g opacity="0.3" transform="translate(55, 408)">
          {/* Left plate */}
          <rect x="-4" y="-8" width="12" height="24" rx="3" fill="#555" />
          <rect x="0" y="-5" width="6" height="18" rx="2" fill="#444" />
          {/* Bar */}
          <rect x="8" y="2" width="40" height="6" rx="3" fill="#666" />
          {/* Right plate */}
          <rect x="48" y="-8" width="12" height="24" rx="3" fill="#555" />
          <rect x="50" y="-5" width="6" height="18" rx="2" fill="#444" />
        </g>

        {/* Mirror — right */}
        <g opacity="0.25">
          <rect x="315" y="80" width="50" height="90" rx="5" fill="#444" />
          <rect x="319" y="84" width="42" height="82" rx="3" fill="#333" />
          {/* Reflection line */}
          <line x1="328" y1="90" x2="328" y2="158" stroke="#555" strokeWidth="1" opacity="0.4" />
          <line x1="335" y1="90" x2="335" y2="158" stroke="#555" strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* Floor line */}
        <line x1="20" y1="440" x2="380" y2="440" stroke="#333" strokeWidth="1.5" opacity="0.3" />

        {/* ====== CHARACTER ====== */}
        <g transform="translate(200, 250)">

          {/* Shadow under feet */}
          <ellipse cx="0" cy="188" rx={55 + p * 15} ry="8" fill="#111" opacity="0.3" />

          {/* ====== LEGS ====== */}
          {/* Left leg */}
          <path
            d="M-12,105 L-22,175 L-8,175 L-2,105 Z"
            fill={jeansColor}
          />
          {/* Left leg shadow */}
          <path
            d="M-12,105 L-18,150 L-10,150 L-2,105 Z"
            fill={jeansShadow}
            opacity="0.3"
          />
          {/* Right leg */}
          <path
            d="M2,105 L8,175 L22,175 L12,105 Z"
            fill={jeansColor}
          />

          {/* Left shoe */}
          <path
            d="M-25,172 L-25,182 Q-25,188 -15,188 L-2,188 L-2,175 L-8,175 Z"
            fill={shoeColor}
          />
          {/* Right shoe */}
          <path
            d="M5,175 L5,188 L18,188 Q28,188 28,182 L28,172 L22,175 Z"
            fill={shoeColor}
          />

          {/* ====== TORSO / CHEST ====== */}
          <g ref={chestRef} style={{ transformOrigin: "0px 55px" }}>
            {/* Tank top body */}
            <path
              d="M-32,8 Q-38,35 -35,65 Q-32,95 -18,108 L18,108 Q32,95 35,65 Q38,35 32,8 Z"
              fill={tankColor}
            />
            {/* Tank straps */}
            <path d="M-15,-12 L-28,8 L-20,8 L-9,-8 Z" fill={tankColor} />
            <path d="M15,-12 L28,8 L20,8 L9,-8 Z" fill={tankColor} />

            {/* Chest shadow / definition */}
            <path
              d="M0,18 L0,65"
              stroke={tankShadow}
              strokeWidth="1.5"
              opacity={0.2 + p * 0.4}
            />
            {/* Pec lines */}
            <path
              d="M-14,28 Q0,38 14,28"
              stroke={tankShadow}
              strokeWidth="1.5"
              fill="none"
              opacity={0.15 + p * 0.4}
            />
            <path
              d="M-12,32 Q0,40 12,32"
              stroke={tankShadow}
              strokeWidth="1"
              fill="none"
              opacity={0.1 + p * 0.3}
            />

            {/* Side shadows on torso */}
            <path
              d="M-32,8 Q-38,35 -35,65 Q-32,85 -25,95 L-20,95 Q-28,85 -30,65 Q-32,35 -28,12 Z"
              fill={tankShadow}
              opacity="0.25"
            />

            {/* Neck (part of torso group so it scales) */}
            <rect x="-10" y="-22" width="20" height="16" rx="5" fill={skinColor} />
            {/* Neck shadow */}
            <rect x="-10" y="-10" width="20" height="6" rx="3" fill={skinShadow} opacity="0.25" />

            {/* Shoulder caps — visible bumps */}
            <ellipse cx="-30" cy="10" rx={10 + p * 5} ry={8 + p * 4} fill={skinColor} />
            <ellipse cx="30" cy="10" rx={10 + p * 5} ry={8 + p * 4} fill={skinColor} />
            {/* Shoulder shadow */}
            <ellipse cx="-30" cy="13" rx={8 + p * 4} ry={4 + p * 2} fill={skinShadow} opacity="0.2" />
            <ellipse cx="30" cy="13" rx={8 + p * 4} ry={4 + p * 2} fill={skinShadow} opacity="0.2" />
          </g>

          {/* ====== HEAD ====== */}
          <g>
            {/* Head shape */}
            <ellipse cx="0" cy="-50" rx="24" ry="26" fill={skinColor} />

            {/* Ears */}
            <ellipse cx="-23" cy="-48" rx="4" ry="6" fill={skinColor} />
            <ellipse cx="23" cy="-48" rx="4" ry="6" fill={skinColor} />
            <ellipse cx="-23" cy="-48" rx="2.5" ry="4" fill={skinShadow} opacity="0.3" />
            <ellipse cx="23" cy="-48" rx="2.5" ry="4" fill={skinShadow} opacity="0.3" />

            {/* Hair */}
            <path
              d="M-22,-60 Q-24,-78 0,-80 Q24,-78 22,-60 L22,-55 Q16,-65 0,-67 Q-16,-65 -22,-55 Z"
              fill={hairColor}
            />
            {/* Hair top spikes */}
            <path
              d="M-8,-78 Q-4,-84 0,-80 Q4,-84 8,-78"
              fill={hairColor}
            />

            {/* Eyes */}
            <ellipse cx="-8" cy="-52" rx="3" ry="3.5" fill={hairColor} />
            <ellipse cx="8" cy="-52" rx="3" ry="3.5" fill={hairColor} />
            {/* Eye highlights */}
            <circle cx="-7" cy="-53" r="1.2" fill="#fff" />
            <circle cx="9" cy="-53" r="1.2" fill="#fff" />

            {/* Eyebrows — get angrier with progress */}
            <line
              x1="-14" y1={-60 + browAngle * 0.3}
              x2="-4" y2={-60 - browAngle * 0.3}
              stroke={hairColor}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <line
              x1="4" y1={-60 - browAngle * 0.3}
              x2="14" y2={-60 + browAngle * 0.3}
              stroke={hairColor}
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            {/* Nose — subtle */}
            <path
              d="M0,-48 L-2,-42 L2,-42 Z"
              fill={skinShadow}
              opacity="0.3"
            />

            {/* Mouth — evolves from neutral to grin to fierce */}
            {p < 0.3 ? (
              /* Neutral line */
              <line
                x1="-5" y1="-38"
                x2="5" y2="-38"
                stroke={hairColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : p < 0.7 ? (
              /* Slight smirk */
              <path
                d="M-5,-39 Q0,-34 5,-39"
                stroke={hairColor}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            ) : (
              /* Fierce grin */
              <g>
                <path
                  d="M-7,-39 Q0,-32 7,-39"
                  stroke={hairColor}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Teeth hint */}
                <line x1="-3" y1="-38" x2="-3" y2="-36" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
                <line x1="0" y1="-37.5" x2="0" y2="-35.5" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
                <line x1="3" y1="-38" x2="3" y2="-36" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
              </g>
            )}

            {/* Jaw shadow */}
            <path
              d="M-18,-35 Q0,-28 18,-35"
              fill={skinShadow}
              opacity="0.15"
            />
          </g>

          {/* ====== LEFT ARM (Flexed up) ====== */}
          <g ref={leftArmRef} style={{ transformOrigin: "-30px 10px" }}>
            {/* Upper arm */}
            <path
              d="M-30,12 L-52,-12 L-60,-5 L-38,18 Z"
              fill={skinColor}
            />
            {/* Bicep bulge */}
            <ellipse
              cx="-48" cy="-2"
              rx="13" ry="9"
              fill={skinColor}
              transform="rotate(-50 -48 -2)"
            />
            {/* Bicep shadow */}
            <ellipse
              cx="-48" cy="2"
              rx="10" ry="6"
              fill={skinShadow}
              opacity="0.3"
              transform="rotate(-50 -48 2)"
            />
            {/* Forearm */}
            <path
              d="M-52,-12 L-48,-48 L-38,-45 L-42,-8 Z"
              fill={skinColor}
            />
            {/* Forearm shadow */}
            <path
              d="M-50,-15 L-48,-35 L-42,-33 L-44,-12 Z"
              fill={skinShadow}
              opacity="0.15"
            />
            {/* Fist */}
            <rect x="-54" y="-60" width="16" height="16" rx="5" fill={skinColor} />
            {/* Fist knuckle line */}
            <line x1="-51" y1="-52" x2="-41" y2="-52" stroke={skinShadow} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          </g>

          {/* ====== RIGHT ARM (Flexed up) ====== */}
          <g ref={rightArmRef} style={{ transformOrigin: "30px 10px" }}>
            {/* Upper arm */}
            <path
              d="M30,12 L52,-12 L60,-5 L38,18 Z"
              fill={skinColor}
            />
            {/* Bicep bulge */}
            <ellipse
              cx="48" cy="-2"
              rx="13" ry="9"
              fill={skinColor}
              transform="rotate(50 48 -2)"
            />
            {/* Bicep shadow */}
            <ellipse
              cx="48" cy="2"
              rx="10" ry="6"
              fill={skinShadow}
              opacity="0.3"
              transform="rotate(50 48 2)"
            />
            {/* Forearm */}
            <path
              d="M52,-12 L48,-48 L38,-45 L42,-8 Z"
              fill={skinColor}
            />
            {/* Forearm shadow */}
            <path
              d="M50,-15 L48,-35 L42,-33 L44,-12 Z"
              fill={skinShadow}
              opacity="0.15"
            />
            {/* Fist */}
            <rect x="38" y="-60" width="16" height="16" rx="5" fill={skinColor} />
            {/* Fist knuckle line */}
            <line x1="41" y1="-52" x2="51" y2="-52" stroke={skinShadow} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          </g>

          {/* ====== SPARK / POWER EFFECTS ====== */}
          <g ref={sparksRef} opacity="0">
            {/* Left arm sparks */}
            <line x1="-68" y1="-20" x2="-78" y2="-26" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-65" y1="-32" x2="-75" y2="-40" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
            <line x1="-70" y1="-8" x2="-80" y2="-6" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />

            {/* Right arm sparks */}
            <line x1="68" y1="-20" x2="78" y2="-26" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="65" y1="-32" x2="75" y2="-40" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
            <line x1="70" y1="-8" x2="80" y2="-6" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />

            {/* Body power sparks */}
            {p > 0.5 && (
              <>
                <line x1="-22" y1="70" x2="-30" y2="75" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                <line x1="22" y1="70" x2="30" y2="75" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                <line x1="-18" y1="80" x2="-26" y2="88" stroke="#FFC107" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="18" y1="80" x2="26" y2="88" stroke="#FFC107" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}

            {/* Top head power burst — max power */}
            {p > 0.75 && (
              <>
                <line x1="-12" y1="-85" x2="-16" y2="-100" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                <line x1="0" y1="-87" x2="0" y2="-104" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="12" y1="-85" x2="16" y2="-100" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
