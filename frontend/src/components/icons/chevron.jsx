import React from "react";

export default function Chevron({ showProperties }) {
  return (
    <svg
      style={{
        transform: `rotate(${showProperties ? 180 : 0}deg)`,
        transition: "transform 0.25s",
      }}
      width="12px"
      height="12px"
      viewBox="0 -4.5 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="#ffffff"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g id="SVGRepo_iconCarrier">
        <title>chevron-up</title> <desc>Created with Sketch Beta.</desc>
        <defs> </defs>
        <g
          id="Page-1"
          stroke="none"
          strokeWidth={1}
          fill="none"
          fillRule="evenodd"
          sketch:type="MSPage"
        >
          <g
            id="Icon-Set-Filled"
            sketch:type="MSLayerGroup"
            transform="translate(-521.000000, -1202.000000)"
            fill="#ffffff"
          >
            <path
              d="M544.345,1213.39 L534.615,1202.6 C534.167,1202.15 533.57,1201.95 532.984,1201.99 C532.398,1201.95 531.802,1202.15 531.354,1202.6 L521.624,1213.39 C520.797,1214.22 520.797,1215.57 521.624,1216.4 C522.452,1217.23 523.793,1217.23 524.621,1216.4 L532.984,1207.13 L541.349,1216.4 C542.176,1217.23 543.518,1217.23 544.345,1216.4 C545.172,1215.57 545.172,1214.22 544.345,1213.39"
              id="chevron-up"
              sketch:type="MSShapeGroup"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
}
