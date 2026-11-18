import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  G,
  Path,
  Rect,
  Circle,
  Polygon,
  Line,
  Defs,
  LinearGradient,
  Stop,
  Ellipse,
} from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * 2D Modern Vector Illustration:
 * Smart Waste Management Compactor Truck with Automated Lifting Arm servicing a Smart Bin.
 */
export const GarbageTruckIllustration: React.FC<Props> = ({
  width = Math.min(SCREEN_WIDTH * 0.85, 340),
  height = Math.min(SCREEN_WIDTH * 0.85, 340) * 0.75,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 380 260" fill="none">
        <Defs>
          {/* Subtle Ground Shadow Gradient */}
          <LinearGradient id="groundShadow" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#1E293B" stopOpacity="0.02" />
            <Stop offset="20%" stopColor="#1E293B" stopOpacity="0.12" />
            <Stop offset="80%" stopColor="#1E293B" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#1E293B" stopOpacity="0.02" />
          </LinearGradient>

          {/* Truck Body Gradient */}
          <LinearGradient id="truckBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#F8FAFC" />
            <Stop offset="100%" stopColor="#E2E8F0" />
          </LinearGradient>

          {/* Windshield Gradient */}
          <LinearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#BAE6FD" />
            <Stop offset="60%" stopColor="#7DD3FC" />
            <Stop offset="100%" stopColor="#38BDF8" />
          </LinearGradient>

          {/* Emerald Brand Accent */}
          <LinearGradient id="greenAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#15803D" />
            <Stop offset="100%" stopColor="#22C55E" />
          </LinearGradient>

          {/* Bin Gradient */}
          <LinearGradient id="binGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#475569" />
            <Stop offset="100%" stopColor="#334155" />
          </LinearGradient>

          {/* Mechanical Arm Gradient */}
          <LinearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#166534" />
            <Stop offset="100%" stopColor="#22C55E" />
          </LinearGradient>
        </Defs>

        {/* 1. Ground Ambient Shadow */}
        <Ellipse cx="190" cy="235" rx="170" ry="14" fill="url(#groundShadow)" />
        <Ellipse cx="80" cy="236" rx="55" ry="8" fill="#1E293B" fillOpacity="0.16" />
        <Ellipse cx="250" cy="237" rx="105" ry="10" fill="#1E293B" fillOpacity="0.18" />

        {/* 2. Background details: Subtle eco-circuit / modern decorative dots */}
        <Circle cx="350" cy="45" r="4" fill="#22C55E" fillOpacity="0.2" />
        <Circle cx="365" cy="65" r="2.5" fill="#22C55E" fillOpacity="0.3" />
        <Circle cx="30" cy="90" r="3" fill="#22C55E" fillOpacity="0.2" />
        <Circle cx="45" cy="110" r="2" fill="#22C55E" fillOpacity="0.35" />

        {/* ==============================================================
            3. SMART WASTE DUMPSTER BIN (Serviced on Left side)
           ============================================================== */}
        <G id="wasteBin">
          {/* Bin Caster Wheels */}
          <Circle cx="50" cy="233" r="5" fill="#1E293B" />
          <Circle cx="50" cy="233" r="2" fill="#94A3B8" />
          <Circle cx="100" cy="233" r="5" fill="#1E293B" />
          <Circle cx="100" cy="233" r="2" fill="#94A3B8" />

          {/* Bin Body */}
          <Path
            d="M 40 148 L 110 148 L 105 228 L 45 228 Z"
            fill="url(#binGrad)"
            stroke="#1E293B"
            strokeWidth="1.5"
          />

          {/* Bin Side Indentations / Panels */}
          <Rect x="48" y="156" width="54" height="18" rx="3" fill="#1E293B" fillOpacity="0.2" />
          <Rect x="49" y="180" width="52" height="18" rx="3" fill="#1E293B" fillOpacity="0.2" />
          <Rect x="50" y="204" width="50" height="16" rx="3" fill="#1E293B" fillOpacity="0.2" />

          {/* Smart Sensor / Matrix LED Status bar on the bin */}
          <Rect x="65" y="162" width="20" height="5" rx="2.5" fill="#22C55E" />
          <Circle cx="70" cy="164.5" r="1.5" fill="#DCFCE7" />

          {/* Bin Handles / Lift Brackets */}
          <Rect x="35" y="166" width="6" height="14" rx="2" fill="#64748B" />
          <Rect x="109" y="166" width="6" height="14" rx="2" fill="#64748B" />

          {/* Bin Curved Lid */}
          <Path
            d="M 36 148 C 36 140, 52 134, 75 134 C 98 134, 114 140, 114 148 Z"
            fill="#334155"
            stroke="#1E293B"
            strokeWidth="1.5"
          />
          {/* Lid Handle */}
          <Path
            d="M 68 135 C 68 131, 82 131, 82 135"
            stroke="#94A3B8"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </G>

        {/* ==============================================================
            4. ROBOTIC LIFTING HYDRAULIC ARM (Connecting truck to bin)
           ============================================================== */}
        <G id="roboticArm">
          {/* Arm Base Mounted on Truck Chassis */}
          <Circle cx="170" cy="195" r="9" fill="#1E293B" />
          <Circle cx="170" cy="195" r="5" fill="#475569" />

          {/* Hydraulic Cylinder */}
          <Path
            d="M 170 195 L 140 178 L 136 184 L 166 201 Z"
            fill="#475569"
            stroke="#1E293B"
            strokeWidth="1"
          />

          {/* Primary Arm Segment (Green Eco Beam) */}
          <Path
            d="M 168 193 L 115 174 L 111 182 L 164 201 Z"
            fill="url(#armGrad)"
            stroke="#14532D"
            strokeWidth="1.5"
          />

          {/* Arm Joint Elbow */}
          <Circle cx="113" cy="178" r="7" fill="#0F172A" />
          <Circle cx="113" cy="178" r="3.5" fill="#22C55E" />

          {/* Secondary Arm Gripper Clamping the Bin */}
          <Path
            d="M 112 178 L 98 178 L 98 188 L 110 184 Z"
            fill="#334155"
            stroke="#0F172A"
            strokeWidth="1"
          />
        </G>

        {/* ==============================================================
            5. WASTE COLLECTION TRUCK CABIN & COMPACTOR
           ============================================================== */}
        <G id="truck">
          {/* Truck Chassis Frame (Dark Bottom Beam) */}
          <Rect x="150" y="206" width="180" height="14" rx="3" fill="#1E293B" />
          <Rect x="165" y="209" width="30" height="8" rx="2" fill="#475569" />
          <Rect x="205" y="209" width="40" height="8" rx="2" fill="#334155" />

          {/* Main Rear Compactor Body */}
          <Path
            d="M 152 75 L 268 75 C 274 75, 278 79, 278 85 L 278 206 L 152 206 Z"
            fill="url(#truckBodyGrad)"
            stroke="#CBD5E1"
            strokeWidth="2"
          />

          {/* Rear Compactor Ribbed Reinforced Sections */}
          <G fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1">
            <Rect x="160" y="85" width="24" height="110" rx="3" />
            <Rect x="190" y="85" width="24" height="110" rx="3" />
            <Rect x="220" y="85" width="24" height="110" rx="3" />
            <Rect x="250" y="85" width="22" height="110" rx="3" />
          </G>

          {/* Emerald Green Eco Stripe across Compactor */}
          <Rect x="152" y="145" width="126" height="14" fill="url(#greenAccent)" />

          {/* Eco Leaf / Recycling Vector Badge on Compactor */}
          <Circle cx="202" cy="152" r="10" fill="#FFFFFF" />
          <Path
            d="M 202 146 C 206 146, 208 149, 208 152 C 208 155, 205 158, 202 158 C 199 158, 196 155, 196 152 C 196 149, 199 146, 202 146 Z"
            fill="#15803D"
          />
          <Path
            d="M 199 152 C 201 150, 204 150, 205 152"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Compactor Top Hopper Structure */}
          <Path
            d="M 160 55 L 260 55 L 268 75 L 152 75 Z"
            fill="#E2E8F0"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />
          {/* Hopper Ribs */}
          <Line x1="180" y1="57" x2="175" y2="73" stroke="#94A3B8" strokeWidth="2" />
          <Line x1="205" y1="57" x2="202" y2="73" stroke="#94A3B8" strokeWidth="2" />
          <Line x1="230" y1="57" x2="229" y2="73" stroke="#94A3B8" strokeWidth="2" />

          {/* Truck Front Cabin */}
          <Path
            d="M 276 100 L 315 100 C 322 100, 328 104, 331 110 L 344 140 C 347 146, 348 152, 348 160 L 348 206 L 276 206 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="2"
          />

          {/* Front Windshield Glass */}
          <Path
            d="M 285 106 L 314 106 C 319 106, 323 109, 325 114 L 336 138 C 337 141, 335 145, 331 145 L 285 145 Z"
            fill="url(#glassGrad)"
          />
          {/* Windshield Reflection */}
          <Polygon points="292,108 305,108 296,143 288,143" fill="#FFFFFF" fillOpacity="0.45" />

          {/* Cabin Side Window */}
          <Path
            d="M 280 110 L 283 110 L 283 145 L 280 145 Z"
            fill="url(#glassGrad)"
          />

          {/* Cabin Door Seam & Handle */}
          <Line x1="284" y1="147" x2="284" y2="198" stroke="#CBD5E1" strokeWidth="1.5" />
          <Rect x="288" y="160" width="8" height="3" rx="1.5" fill="#475569" />

          {/* Front Grille (Iconic Emerald Green Grille from mockup) */}
          <Path
            d="M 334 162 L 348 162 L 348 198 L 332 198 Z"
            fill="#15803D"
            stroke="#14532D"
            strokeWidth="1"
          />
          {/* Grille Horizontal Slats */}
          <Line x1="334" y1="168" x2="347" y2="168" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
          <Line x1="333" y1="174" x2="347" y2="174" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
          <Line x1="333" y1="180" x2="347" y2="180" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
          <Line x1="333" y1="186" x2="347" y2="186" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
          <Line x1="333" y1="192" x2="347" y2="192" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />

          {/* Front Bumper */}
          <Path
            d="M 330 198 L 352 198 C 354 198, 355 200, 355 202 L 353 216 L 328 216 Z"
            fill="#334155"
          />

          {/* Modern Headlight with Dual Projectors */}
          <Rect x="338" y="150" width="10" height="9" rx="2" fill="#F8FAFC" stroke="#64748B" strokeWidth="1" />
          <Circle cx="341" cy="154.5" r="2.2" fill="#38BDF8" />
          <Circle cx="345.5" cy="154.5" r="1.5" fill="#FEF08A" />

          {/* Amber Fog Light in Bumper */}
          <Rect x="338" y="204" width="8" height="4" rx="1" fill="#F59E0B" />

          {/* Side View Mirror */}
          <Rect x="325" y="118" width="5" height="16" rx="2" fill="#1E293B" />
          <Path d="M 322 124 L 325 124" stroke="#1E293B" strokeWidth="2" />
          <Path d="M 322 130 L 325 130" stroke="#1E293B" strokeWidth="2" />

          {/* Roof Amber Warning Beacons */}
          <Path d="M 295 96 L 305 96 L 303 91 L 297 91 Z" fill="#F59E0B" />
          <Circle cx="300" cy="91" r="2.5" fill="#FBBF24" />
          <Path d="M 315 96 L 325 96 L 323 91 L 317 91 Z" fill="#F59E0B" />
          <Circle cx="320" cy="91" r="2.5" fill="#FBBF24" />

          {/* ==============================================================
              WHEELS & TIRES (Realistic Modern 2D Vector Multi-axle)
             ============================================================== */}
          {/* Wheel 1 (Rear Left) */}
          <G id="rearWheel1">
            <Circle cx="178" cy="216" r="21" fill="#1E293B" />
            <Circle cx="178" cy="216" r="14" fill="#64748B" />
            <Circle cx="178" cy="216" r="7" fill="#334155" />
            <Circle cx="178" cy="216" r="2.5" fill="#94A3B8" />
          </G>

          {/* Wheel 2 (Rear Middle) */}
          <G id="rearWheel2">
            <Circle cx="225" cy="216" r="21" fill="#1E293B" />
            <Circle cx="225" cy="216" r="14" fill="#64748B" />
            <Circle cx="225" cy="216" r="7" fill="#334155" />
            <Circle cx="225" cy="216" r="2.5" fill="#94A3B8" />
          </G>

          {/* Wheel 3 (Front Steering Axle) */}
          <G id="frontWheel">
            <Circle cx="312" cy="216" r="21" fill="#1E293B" />
            <Circle cx="312" cy="216" r="14" fill="#64748B" />
            <Circle cx="312" cy="216" r="7" fill="#334155" />
            <Circle cx="312" cy="216" r="2.5" fill="#94A3B8" />
          </G>

          {/* Wheel Mudguards */}
          <Path
            d="M 152 216 C 152 200, 163 191, 178 191 C 193 191, 204 200, 204 216"
            stroke="#334155"
            strokeWidth="3.5"
            fill="none"
          />
          <Path
            d="M 200 216 C 200 200, 210 191, 225 191 C 240 191, 250 200, 250 216"
            stroke="#334155"
            strokeWidth="3.5"
            fill="none"
          />
          <Path
            d="M 288 216 C 288 200, 298 191, 312 191 C 326 191, 336 200, 336 216"
            stroke="#334155"
            strokeWidth="3.5"
            fill="none"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
