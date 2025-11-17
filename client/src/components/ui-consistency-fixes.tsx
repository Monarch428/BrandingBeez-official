import { cn } from "@/lib/utils";

// Consistent Button Styles
export const buttonStyles = {
  primary: "bg-gradient-to-r from-brand-coral to-pink-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg",
  secondary: "bg-white text-brand-coral border-2 border-brand-coral font-semibold px-6 py-3 rounded-lg",
  outline: "border-2 border-brand-coral text-brand-coral px-6 py-3 rounded-lg",
  ghost: "text-brand-coral bg-brand-coral/10 px-6 py-3 rounded-lg"
};

// Consistent Card Styles
export const cardStyles = {
  default: "bg-white rounded-xl shadow-lg border border-gray-100",
  gradient: "bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100",
  coral: "bg-gradient-to-br from-brand-coral/5 to-brand-coral/10 rounded-xl shadow-lg border border-brand-coral/20"
};

// Consistent Text Styles
export const textStyles = {
  h1: "text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight",
  h2: "text-3xl md:text-4xl font-bold text-gray-900 leading-tight",
  h3: "text-2xl md:text-3xl font-bold text-gray-900 leading-tight",
  h4: "text-xl md:text-2xl font-semibold text-gray-900",
  body: "text-lg text-gray-600 leading-relaxed",
  small: "text-base text-gray-600",
  caption: "text-sm text-gray-500"
};

// Consistent Section Styles
export const sectionStyles = {
  default: "py-16 md:py-20",
  large: "py-20 md:py-24",
  small: "py-12 md:py-16"
};

// Consistent Background Styles
export const backgroundStyles = {
  white: "bg-white",
  gray: "bg-gray-50",
  gradient: "bg-gradient-to-br from-brand-purple via-purple-700 to-brand-coral",
  coral: "bg-gradient-to-br from-brand-coral to-pink-500"
};

// Consistent Spacing
export const spacing = {
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-16 md:py-20",
  component: "mb-8 md:mb-12",
  element: "mb-4 md:mb-6"
};

// Badge styles for consistency
export const badgeStyles = {
  primary: "bg-brand-coral/10 text-brand-coral border border-brand-coral/20 px-3 py-1 rounded-full text-sm font-medium",
  secondary: "bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-3 py-1 rounded-full text-sm font-medium",
  success: "bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full text-sm font-medium",
  warning: "bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-full text-sm font-medium"
};

// Icon container styles
export const iconStyles = {
  default: "w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4",
  large: "w-16 h-16 bg-brand-coral/10 rounded-xl flex items-center justify-center mb-6",
  circle: "w-12 h-12 bg-brand-coral/10 rounded-full flex items-center justify-center mb-4"
};

// Stats display styles
export const statsStyles = {
  number: "text-4xl md:text-5xl font-bold text-brand-coral mb-2",
  label: "text-sm md:text-base text-gray-600 font-medium",
  container: "text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100"
};