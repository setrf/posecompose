export interface CostumeAsset {
  id: string;
  url: string;
  type: 'main' | 'detail' | 'background' | 'example';
  description?: string;
}

export interface CostumeColor {
  primary: string;
  secondary: string;
  accent: string;
  palette: string[];
}

export interface CostumeMetadata {
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  compatibleModels: string[];
  estimatedProcessingTime: number; // in seconds
  season?: string;
  popularityScore?: number; // 1-10
}

export interface CostumeMarketing {
  displayName: string;
  shortDescription: string;
  socialPreview: string;
  callToAction: string;
  landingPageText?: string;
}

export interface TransformationPrompt {
  base: string;
  variations: {
    style: string;
    prompt: string;
  }[];
  negativePrompts?: string[];
  qualityModifiers: string[];
  detailEnhancements: string[];
}

export interface CostumeAffiliateLink {
  id: string;
  label: string;
  url: string;
  source: 'Amazon' | 'AliExpress' | 'Etsy' | 'SpiritHalloween' | 'Other';
  price?: string;
  availability?: 'in-stock' | 'out-of-stock' | 'pre-order';
  description?: string;
}

export interface CostumePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  
  // Visual assets
  assets: CostumeAsset[];
  
  // Styling
  colors: CostumeColor;
  
  // AI generation
  transformation: TransformationPrompt;
  
  // Metadata
  metadata: CostumeMetadata;
  
  // Marketing
  marketing: CostumeMarketing;
  
  // Affiliate links
  affiliateLinks: CostumeAffiliateLink[];
  
  // Status & availability
  isActive: boolean;
  isPremium: boolean;
  isNew: boolean;
  isFeatured: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Additional data
  notes?: string;
  inspiration?: string;
}

export interface CostumeCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

// Collections for organizing costumes
export interface CostumeCollection {
  id: string;
  name: string;
  description: string;
  costumeIds: string[];
  isActive: boolean;
  sortOrder: number;
}

// User interaction tracking
export interface CostumeInteraction {
  costumeId: string;
  userId?: string;
  sessionId: string;
  type: 'view' | 'select' | 'generate' | 'share' | 'favorite';
  timestamp: string;
  metadata?: Record<string, unknown>;
}
