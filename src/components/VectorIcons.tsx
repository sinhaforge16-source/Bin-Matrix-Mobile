import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const CheckIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 13l4 4L19 7"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12h14M13 5l7 7-7 7"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface RadioProps {
  selected?: boolean;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export const RadioButton: React.FC<RadioProps> = ({
  selected = false,
  size = 26,
  activeColor = '#2D6A4F',
  inactiveColor = '#94A3B8',
}) => {
  if (selected) {
    return (
      <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <Circle cx="14" cy="14" r="13" fill={activeColor} />
        <Path
          d="M8.5 14.5L12 18L19.5 10.5"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="12" stroke={inactiveColor} strokeWidth="2" fill="none" />
    </Svg>
  );
};
