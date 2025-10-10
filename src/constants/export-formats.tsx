import { Instagram, Facebook, Twitter, Smartphone, Monitor } from "lucide-react";
import type { ReactNode } from "react";

export interface ExportFormat {
  id: string;
  name: string;
  dimensions: { width: number; height: number };
  description: string;
  aspectRatio: string;
  icon: ReactNode;
  color: string;
}

export const exportFormats: ExportFormat[] = [
  {
    id: "instagram-square",
    name: "Instagram Post",
    dimensions: { width: 1080, height: 1080 },
    description: "Perfect square for Instagram feed",
    aspectRatio: "1:1",
    icon: <Instagram className="w-4 h-4" />,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    dimensions: { width: 1080, height: 1920 },
    description: "Vertical format for stories",
    aspectRatio: "9:16",
    icon: <Smartphone className="w-4 h-4" />,
    color: "bg-gradient-to-r from-orange-400 to-pink-500",
  },
  {
    id: "facebook-post",
    name: "Facebook Post",
    dimensions: { width: 1200, height: 630 },
    description: "Optimized for Facebook timeline",
    aspectRatio: "1.91:1",
    icon: <Facebook className="w-4 h-4" />,
    color: "bg-[#4267B2]",
  },
  {
    id: "twitter-post",
    name: "Twitter Post",
    dimensions: { width: 1200, height: 675 },
    description: "Perfect for Twitter sharing",
    aspectRatio: "16:9",
    icon: <Twitter className="w-4 h-4" />,
    color: "bg-[#1DA1F2]",
  },
  {
    id: "desktop-wallpaper",
    name: "Desktop Wallpaper",
    dimensions: { width: 1920, height: 1080 },
    description: "Full HD desktop background",
    aspectRatio: "16:9",
    icon: <Monitor className="w-4 h-4" />,
    color: "bg-gradient-to-r from-blue-500 to-purple-600",
  },
  {
    id: "mobile-wallpaper",
    name: "Mobile Wallpaper",
    dimensions: { width: 1080, height: 2340 },
    description: "Modern smartphone wallpaper",
    aspectRatio: "9:19.5",
    icon: <Smartphone className="w-4 h-4" />,
    color: "bg-gradient-to-r from-green-500 to-blue-500",
  },
];
