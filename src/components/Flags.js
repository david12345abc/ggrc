import React from 'react';

const S = { width: 20, height: 14, borderRadius: 2, display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 };

export const FlagEN = () => (
  <svg viewBox="0 0 60 30" style={S}>
    <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
    <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

export const FlagRU = () => (
  <svg viewBox="0 0 9 6" style={S}>
    <rect width="9" height="2" fill="#fff"/>
    <rect width="9" height="2" y="2" fill="#0039A6"/>
    <rect width="9" height="2" y="4" fill="#D52B1E"/>
  </svg>
);

export const FlagAM = () => (
  <svg viewBox="0 0 9 6" style={S}>
    <rect width="9" height="2" fill="#D90012"/>
    <rect width="9" height="2" y="2" fill="#0033A0"/>
    <rect width="9" height="2" y="4" fill="#F2A800"/>
  </svg>
);

const FLAGS = { en: FlagEN, ru: FlagRU, am: FlagAM };

export default function Flag({ code, ...props }) {
  const Comp = FLAGS[code];
  return Comp ? <Comp {...props} /> : null;
}
