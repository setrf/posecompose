# Costume Catalog Database Migration Guide

## Overview

This document outlines the migration path from the current static TypeScript-based costume catalog to a database-backed system using Neon PostgreSQL and Supabase. This migration enables dynamic content management, user-generated content, and scalable operations.

## Phase 1: Current State (Static TypeScript)

### Current Implementation
- **Location**: `src/data/costumes.ts` and `src/types/costume.ts`
- **Storage**: In-memory TypeScript objects
- **Management**: Manual code updates
- **Deployment**: Code changes required for any costume updates

### Advantages
- Type safety (TypeScript interfaces)
- Version control friendly
- Simple deployment
- No external dependencies

### Limitations
- Requires code deployment for content updates
- Limited scalability
- No dynamic content
- No user contributions

## Phase 2: Database Schema Design

### Core Tables

```sql
-- Costume Categories
CREATE TABLE costume_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Costumes (main table)
CREATE TABLE costumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES costume_categories(id),
  transformation_type TEXT NOT NULL, -- 'full-costume', 'accessory-only', etc.
  seasonal_theme TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  estimated_time INTEGER NOT NULL CHECK (estimated_time > 0),
  popularity_score INTEGER DEFAULT 0 CHECK (popularity_score >= 0 AND popularity_score <= 100),
  is_new BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  compatible_models JSONB DEFAULT '[]',
  required_features JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Costume Images
CREATE TABLE costume_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  costume_id UUID REFERENCES costumes(id) ON DELETE CASCADE,
  image_type TEXT NOT NULL CHECK (image_type IN ('main', 'background', 'detail', 'example', 'thumbnail')),
  image_url TEXT NOT NULL,
  image_size TEXT NOT NULL CHECK (image_size IN ('small', 'medium', 'large')),
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(costume_id, image_type, image_size)
);

-- Color Palettes
CREATE TABLE costume_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  costume_id UUID REFERENCES costumes(id) ON DELETE CASCADE,
  color_type TEXT NOT NULL CHECK (color_type IN ('primary', 'secondary', 'accent', 'background', 'highlight')),
  color_value TEXT NOT NULL, -- hex color code
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(costume_id, color_type)
);

-- Costume Tags
CREATE TABLE costume_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE costume_tag_assignments (
  costume_id UUID REFERENCES costumes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES costume_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (costume_id, tag_id)
);

-- AI Prompts
CREATE TABLE ai_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  costume_id UUID REFERENCES costumes(id) ON DELETE CASCADE,
  prompt_type TEXT NOT NULL CHECK (prompt_type IN ('transformation', 'style_enhancement', 'color_correction', 'detail_enhancement', 'negative')),
  prompt_text TEXT NOT NULL,
  model_name TEXT, -- for model-specific variations
  strength NUMERIC CHECK (strength >= 0 AND strength <= 1),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(costume_id, prompt_type, COALESCE(model_name, ''))
);

-- Marketing Content
CREATE TABLE costume_marketing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  costume_id UUID REFERENCES costumes(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT,
  social_preview TEXT,
  call_to_action TEXT,
  features JSONB DEFAULT '[]',
  hashtags JSONB DEFAULT '[]',
  social_proof JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Interactions (for analytics)
CREATE TABLE costume_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  costume_id UUID REFERENCES costumes(id),
  user_id UUID, -- when user system is implemented
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'select', 'transform', 'share', 'favorite')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generation Jobs (for tracking user transformations)
CREATE TABLE transformation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  costume_id UUID REFERENCES costumes(id),
  user_id UUID, -- when user system is implemented
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  input_image_url TEXT,
  output_image_url TEXT,
  ai_model_used TEXT,
  generation_time_ms INTEGER,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Indices for performance
CREATE INDEX idx_costumes_category ON costumes(category_id, is_active, sort_order);
CREATE INDEX idx_costumes_popularity ON costumes(popularity_score DESC, is_active);
CREATE INDEX idx_costumes_difficulty ON costumes(difficulty, is_active);
CREATE INDEX idx_costume_images_costume ON costume_images(costume_id);
CREATE INDEX idx_costume_interactions_costume ON costume_interactions(costume_id, created_at);
CREATE INDEX idx_costume_tags_name ON costume_tags(name);
```

## Phase 3: Migration Strategy

### Step 1: Database Setup
```bash
# Create new Supabase project
supabase init waifu-material-db
supabase link --project-ref your-project-ref
supabase db push
```

### Step 2: Data Migration Script

```typescript
// scripts/migrate-costumes.ts
import { createClient } from '@supabase/supabase-js'
import { launchCostumes } from '../src/data/costumes'

interface SupabaseCostume {
  slug: string
  name: string
  description: string
  category: string
  transformation_type: string
  seasonal_theme: string | null
  difficulty: 'easy' | 'medium' | 'hard'
  estimated_time: number
  popularity_score: number
  is_new: boolean
  is_premium: boolean
  is_active: boolean
  sort_order: number
  compatible_models: string[]
  required_features: string[]
}

const migrateCostumes = async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  // Insert categories first
  const categories = [...new Set(launchCostumes.map(c => c.category))]
  for (const category of categories) {
    await supabase.from('costume_categories').upsert({
      name: category,
      display_name: category.charAt(0).toUpperCase() + category.slice(1),
      is_active: true
    })
  }

  // Insert costumes
  for (const costume of launchCostumes) {
    const { data: category } = await supabase
      .from('costume_categories')
      .select('id')
      .eq('name', costume.category)
      .single()

    if (!category) continue

    const { data: insertedCostume } = await supabase
      .from('costumes')
      .upsert({
        slug: costume.id,
        name: costume.name,
        description: costume.description,
        category_id: category.id,
        transformation_type: costume.metadata.transformationType,
        seasonal_theme: costume.metadata.seasonalTheme,
        difficulty: costume.metadata.difficulty,
        estimated_time: costume.metadata.estimatedTime,
        popularity_score: costume.metadata.popularityScore,
        is_new: costume.metadata.isNew,
        is_premium: costume.metadata.isPremium,
        is_active: true,
        sort_order: 0,
        compatible_models: costume.metadata.compatibleModels,
        required_features: costume.metadata.requiredFeatures
      })
      .select()
      .single()

    if (!insertedCostume) continue

    // Insert images
    await supabase.from('costume_images').upsert([
      { costume_id: insertedCostume.id, image_type: 'main', image_url: costume.images.main, image_size: 'large', is_primary: true },
      { costume_id: insertedCostume.id, image_type: 'background', image_url: costume.images.background, image_size: 'large' },
      { costume_id: insertedCostume.id, image_type: 'thumbnail', image_url: costume.images.thumbnails.small, image_size: 'small' },
      { costume_id: insertedCostume.id, image_type: 'thumbnail', image_url: costume.images.thumbnails.medium, image_size: 'medium' },
      { costume_id: insertedCostume.id, image_type: 'thumbnail', image_url: costume.images.thumbnails.large, image_size: 'large' },
      ...costume.images.details.map((url, index) => ({
        costume_id: insertedCostume.id,
        image_type: 'detail' as const,
        image_url: url,
        image_size: 'large' as const,
        sort_order: index
      })),
      ...costume.images.examples.map((url, index) => ({
        costume_id: insertedCostume.id,
        image_type: 'example' as const,
        image_url: url,
        image_size: 'large' as const,
        sort_order: index
      }))
    ])

    // Insert colors
    await supabase.from('costume_colors').upsert([
      { costume_id: insertedCostume.id, color_type: 'primary', color_value: costume.colors.primary },
      { costume_id: insertedCostume.id, color_type: 'secondary', color_value: costume.colors.secondary },
      { costume_id: insertedCostume.id, color_type: 'accent', color_value: costume.colors.accent },
      { costume_id: insertedCostume.id, color_type: 'background', color_value: costume.colors.background },
      ...costume.colors.highlights.map((color, index) => ({
        costume_id: insertedCostume.id,
        color_type: 'highlight' as const,
        color_value: color,
        sort_order: index
      }))
    ])

    // Insert tags
    for (const tagName of costume.metadata.tags) {
      await supabase.from('costume_tags').upsert({ name: tagName })
      await supabase.from('costume_tag_assignments').upsert({
        costume_id: insertedCostume.id,
        tag_id: tagName
      })
    }

    // Insert AI prompts
    await supabase.from('ai_prompts').upsert([
      { costume_id: insertedCostume.id, prompt_type: 'transformation', prompt_text: costume.aiPrompts.transformation },
      { costume_id: insertedCostume.id, prompt_type: 'style_enhancement', prompt_text: costume.aiPrompts.styleEnhancement },
      { costume_id: insertedCostume.id, prompt_type: 'color_correction', prompt_text: costume.aiPrompts.colorCorrection },
      { costume_id: insertedCostume.id, prompt_type: 'detail_enhancement', prompt_text: costume.aiPrompts.detailEnhancement },
      ...costume.aiPrompts.negativePrompts.map((prompt, index) => ({
        costume_id: insertedCostume.id,
        prompt_type: 'negative' as const,
        prompt_text: prompt,
        sort_order: index
      }))
    ])

    // Insert model variations
    for (const [modelName, variation] of Object.entries(costume.aiPrompts.modelVariations)) {
      await supabase.from('ai_prompts').upsert({
        costume_id: insertedCostume.id,
        prompt_type: 'transformation',
        prompt_text: variation.prompt,
        model_name: modelName,
        strength: variation.strength
      })
    }

    // Insert marketing content
    await supabase.from('costume_marketing').upsert({
      costume_id: insertedCostume.id,
      display_name: costume.marketing.displayName,
      short_description: costume.marketing.shortDescription,
      long_description: costume.marketing.longDescription,
      social_preview: costume.marketing.socialPreview,
      call_to_action: costume.marketing.callToAction,
      features: costume.marketing.features,
      hashtags: costume.marketing.hashtags,
      social_proof: costume.marketing.socialProof
    })
  }

  console.log('Migration completed successfully!')
}
```

## Phase 4: Frontend Integration

### Supabase Client Configuration

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Database Service Layer

```typescript
// src/services/costume-service.ts
import { supabase } from '@/lib/supabase'
import type { CostumeAsset } from '@/types/costume'

export class CostumeService {
  async getAllCostumes(): Promise<CostumeAsset[]> {
    const { data, error } = await supabase
      .from('costumes')
      .select(`
        *,
        category:costume_categories(*),
        images:costume_images(*),
        colors:costume_colors(*),
        tags:costume_tag_assignments(tag:costume_tags(*)),
        ai_prompts:ai_prompts(*),
        marketing:costume_marketing(*)
      `)
      .eq('is_active', true)
      .order('sort_order')

    if (error) throw error
    return this.transformDatabaseResults(data)
  }

  async getCostumeById(id: string): Promise<CostumeAsset | null> {
    const { data, error } = await supabase
      .from('costumes')
      .select(`
        *,
        category:costume_categories(*),
        images:costume_images(*),
        colors:costume_colors(*),
        tags:costume_tag_assignments(tag:costume_tags(*)),
        ai_prompts:ai_prompts(*),
        marketing:costume_marketing(*)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data ? this.transformDatabaseResult(data) : null
  }

  async logInteraction(costumeId: string, interactionType: string, metadata = {}) {
    await supabase.from('costume_interactions').insert({
      costume_id: costumeId,
      interaction_type: interactionType,
      metadata
    })
  }

  private transformDatabaseResults(data: any[]): CostumeAsset[] {
    return data.map(item => this.transformDatabaseResult(item))
  }

  private transformDatabaseResult(item: any): CostumeAsset {
    // Transform database result to match TypeScript interface
    return {
      id: item.slug,
      name: item.name,
      description: item.description,
      category: item.category.name,
      // ... transform all nested relationships
      // This needs to be implemented based on your data structure
    }
  }
}
```

## Phase 5: Migration Timeline

### Week 1: Setup
- [ ] Create Supabase project
- [ ] Design and create database schema
- [ ] Set up environment variables
- [ ] Create migration scripts

### Week 2: Data Migration
- [ ] Run migration scripts
- [ ] Verify data integrity
- [ ] Set up database backup procedures
- [ ] Create database monitoring

### Week 3: Frontend Integration
- [ ] Implement Supabase client
- [ ] Create service layer
- [ ] Update UI components to use database
- [ ] Implement error handling

### Week 4: Testing & Deployment
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Production deployment

### Week 5: Transition Cleanup
- [ ] Remove static TypeScript data
- [ ] Update documentation
- [ ] Train content management team
- [ ] Monitor performance metrics

## Phase 6: Content Management Features

### Admin Dashboard Features
- **Costume Editor**: Web interface for adding/editing costumes
- **Image Upload**: Direct image management with auto-sizing
- **Version Control**: Costume version history and rollback
- **Analytics**: Real-time usage statistics and popular trends
- **A/B Testing**: Test different prompts and variations
- **Bulk Operations**: Import/export costume collections
- **Scheduled Publishing**: Time-based costume releases

### User-Generated Content
- **Custom Costumes**: User-created costume submissions
- **Community Ratings**: User feedback and ratings
- **Favorite Collections**: User's favorite costumes
- **Sharing Features**: Social media integration
- **Showcase Gallery**: User transformation results

## Benefits of Migration

### Immediate Benefits
- **Dynamic Updates**: Update costumes without code deployment
- **Scalability**: Handle thousands of costumes efficiently
- **Performance**: Database indexing and caching
- **Analytics**: Real-time usage data and insights

### Long-term Benefits
- **User Content**: Community contributions and creativity
- **Personalization**: AI-driven costume recommendations
- **Monetization**: Premium costumes and subscription features
- **Global Scale**: Multi-region deployment and CDN integration

## Backup and Recovery

### Database Backup Strategy
```sql
-- Create automated backups
CREATE OR REPLACE FUNCTION backup_costumes()
RETURNS void AS $$
BEGIN
  -- Export to JSON for backup
  COPY (
    SELECT json_agg(c) FROM costumes c JOIN costume_categories cat ON c.category_id = cat.id
  ) TO '/tmp/costume_backup.json';
END;
$$ LANGUAGE plpgsql;
```

### Disaster Recovery
- **Point-in-time Recovery**: Supabase automatic snapshots
- **Geographic Redundancy**: Multi-region backups
- **Export Capability**: Regular JSON exports to S3
- **Rollback Procedures**: Quick rollback to stable states

## Monitoring and Maintenance

### Key Metrics to Monitor
- Query performance and index usage
- API response times
- Data growth and storage costs
- User engagement statistics
- Error rates and uptime

### Maintenance Tasks
- **Weekly**: Performance optimization and index updates
- **Monthly**: Data cleanup and archival
- **Quarterly**: Security audits and updates
- **Annually**: Database schema review and optimization

This migration provides a robust foundation for scaling the costume catalog system while maintaining the type safety and developer experience of the current TypeScript implementation.
