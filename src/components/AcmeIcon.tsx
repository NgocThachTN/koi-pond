import type {IconSvgProps} from "@/types";

import React from "react";

export const AcmeIcon: React.FC<IconSvgProps> = ({size = "100%", width, height, ...props}) => (
  <svg fill="none" height={size || height} width={size || width} viewBox="0 0 24 24" {...props}>
    <path
      clipRule="evenodd"
      d="M13.2361 7.59788L11.9089 5.26937L5.27234 16.9124H7.89585L13.2361 7.59788ZM14.9098 10.5343L13.5825 12.8987L14.5455 14.5883H12.6339L11.3293 16.9124H18.5454L14.9098 10.5343Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);