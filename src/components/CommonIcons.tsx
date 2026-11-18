import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

/**
 * Google Icon
 */
export const GoogleIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

/**
 * Facebook Icon
 */
export const FacebookIcon: React.FC<IconProps> = ({ size = 24, color = '#1877F2' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="11" fill={color} />
    <Path
      d="M15.5 12h-2.5v8h-3v-8h-2v-2.5h2v-1.8c0-2.2 1.3-3.4 3.3-3.4.9 0 1.8.1 2.2.2v2.5h-1.3c-1.1 0-1.4.5-1.4 1.3V9.5h2.8l-.4 2.5z"
      fill="#FFFFFF"
    />
  </Svg>
);

/**
 * Apple Icon
 */
export const AppleIcon: React.FC<IconProps> = ({ size = 24, color = '#000000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.47c.65-.79 1.1-1.9 0.98-3.01-.97.04-2.16.65-2.85 1.46-.61.71-1.14 1.85-.99 2.93 1.09.08 2.2-.59 2.86-1.38z" />
  </Svg>
);

/**
 * Bottom Nav: Home Icon
 */
export const NavHomeIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V14H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
      fill={color}
    />
  </Svg>
);

/**
 * Bottom Nav: Smart Bin / Robot Icon
 */
export const NavSmartBinIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Robot Head / Smart Bin */}
    <Rect x="4" y="8" width="16" height="12" rx="3" fill={color} />
    {/* Antenna */}
    <Circle cx="12" cy="4" r="2" fill={color} />
    <Path d="M12 6V8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Eyes */}
    <Circle cx="8.5" cy="12.5" r="1.5" fill="#1E3A2F" />
    <Circle cx="15.5" cy="12.5" r="1.5" fill="#1E3A2F" />
    {/* Mouth grid */}
    <Rect x="8" y="16" width="8" height="2" rx="1" fill="#1E3A2F" />
  </Svg>
);

/**
 * Bottom Nav / Top Right: Profile Avatar Icon
 */
export const NavProfileIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="11" stroke={color} strokeWidth="1.8" />
    {/* Head */}
    <Circle cx="12" cy="8.5" r="3.5" fill={color} />
    {/* Torso */}
    <Path
      d="M6.5 18C7.5 15 9.5 14 12 14C14.5 14 16.5 15 17.5 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Bottom Nav: Driver Route / Map Icon (Folded map with road waypoint)
 */
export const NavMapIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18L3 15V4L9 7L15 4L21 7V18L15 15L9 18Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 7V18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 4V15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Bottom Nav: Google Maps Multicolor Nav Icon (matching prototype)
 */
export const GoogleMapNavIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Folded Map Canvas */}
    <Path d="M3 5.5L9 3V18.5L3 21V5.5Z" fill="#4285F4" />
    <Path d="M9 3L15 5.5V21L9 18.5V3Z" fill="#34A853" />
    <Path d="M15 5.5L21 3V18.5L15 21V5.5Z" fill="#FBBC05" />
    {/* Pin on map */}
    <Path
      d="M12 5.5 C10.3 5.5 9 6.8 9 8.5 C9 11 12 14.5 12 14.5 C12 14.5 15 11 15 8.5 C15 6.8 13.7 5.5 12 5.5 Z"
      fill="#EA4335"
    />
    <Circle cx="12" cy="8.5" r="1.5" fill="#FFFFFF" />
  </Svg>
);
