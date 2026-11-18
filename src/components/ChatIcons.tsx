import React from 'react';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

/**
 * Robot Head Avatar Vector (for Chatbot messages)
 */
export const BotAvatarVector: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    {/* Antenna */}
    <Circle cx="18" cy="4" r="2.5" fill="#3B82F6" />
    <Path d="M 18 6 L 18 10" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

    {/* Ears */}
    <Rect x="2" y="15" width="4" height="8" rx="2" fill="#64748B" />
    <Rect x="30" y="15" width="4" height="8" rx="2" fill="#64748B" />

    {/* Head Frame */}
    <Rect
      x="5"
      y="9"
      width="26"
      height="20"
      rx="6"
      fill="#E2E8F0"
      stroke="#64748B"
      strokeWidth="1.5"
    />

    {/* Visor Screen */}
    <Rect x="8" y="12" width="20" height="10" rx="3.5" fill="#1E293B" />

    {/* Glowing Blue Eyes */}
    <Circle cx="13" cy="17" r="2.2" fill="#38BDF8" />
    <Circle cx="23" cy="17" r="2.2" fill="#38BDF8" />

    {/* Mouth Grill */}
    <Path d="M 14 25 L 22 25" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

/**
 * Camera Icon (for Chat Input bar)
 */
export const CameraIcon: React.FC<IconProps> = ({ size = 20, color = '#2D6A4F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" />
  </Svg>
);

/**
 * Location Pin Icon (for Chat Input bar)
 */
export const LocationPinIcon: React.FC<IconProps> = ({ size = 20, color = '#2D6A4F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

/**
 * Send Arrow Icon (Paper airplane send for Chat Input bar)
 */
export const SendIcon: React.FC<IconProps> = ({ size = 20, color = '#2D6A4F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 2L11 13"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polygon
      points="22 2 15 22 11 13 2 9 22 2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
    />
  </Svg>
);

/**
 * Mail Icon (for Account screen)
 */
export const MailIcon: React.FC<IconProps> = ({ size = 20, color = '#000000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="2"
      y="4"
      width="20"
      height="16"
      rx="3"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M22 7L13.03 12.7a2 2 0 0 1-2.06 0L2 7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Chevron Down Icon (for Language dropdown)
 */
export const ChevronDownIcon: React.FC<IconProps> = ({ size = 20, color = '#000000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9l6 6 6-6"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Logout Exit Icon
 */
export const LogOutIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 17l5-5-5-5"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 12H9"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Plus in circle icon (for "+ Add Account")
 */
export const PlusCircleIcon: React.FC<IconProps> = ({ size = 22, color = '#1E513A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.2" />
    <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </Svg>
);
