# Costume Catalog Migration Path to Neon/Supabase

## Overview
This document outlines the migration path from the current static costume catalog to a dynamic, database-backed system using Neon (PostgreSQL) and Supabase for Phase 2.

## Current Architecture (Phase 1)

### Static Data Structure
```
src/
├── types/costume.ts           # TypeScript interfaces
├── data/costumes.tsx          # Static costume data
└── components/               # UI components consuming static data
```

### Current Limitations
- Manual updates required for new costumes
- No user-generated content support
- Limited analytics and tracking
- No real-time updates
- No admin interface for catalog management

## Target Architecture (Phase 2)

### Database Schema

#### Core Tables

```sql
-- Costume Presets
CREATE TABLE costumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id UUID REFERENCES costume_categories(id),
    description TEXT,
    version VARCHAR(50) DEFAULT '1.0.0',
    
    -- Metadata
    metadata JSONB NOT NULL DEFAULT '{}',
    colors JSONB NOT NULL DEFAULT '{}',
    transformation JSONB NOT NULL DEFAULT '{}',
    marketing JSONB NOT NULL DEFAULT '{}',
    
    -- Status flags
    is_active BOOLEAN DEFAULT true,
    is_premium BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Costume Categories
CREATE TABLE costume_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Costume Assets
CREATE TABLE costume_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    costume_id UUID REFERENCES costumes(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('main', 'detail', 'background', 'example')),
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Interactions
CREATE TABLE costume_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    costume_id UUID REFERENCES costumes(id),
    user_id UUID REFERENCES auth.users(id),
    session_id VARCHAR(255) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('view', 'select', 'generate', 'share', 'favorite')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collections
CREATE TABLE costume_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    costume_ids UUID[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Favorites
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    costume_id UUID REFERENCES costumes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, costume_id)
);
```

### Supabase Configuration

#### Auth Setup
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### Row Level Security (RLS) Policies
```sql
-- Enable RLS
ALTER TABLE costumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE costume_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Public read access for active costumes
CREATE POLICY "Public costumes are viewable by everyone"
ON costumes FOR SELECT USING (is_active = true);

-- Users can view their own interactions
CREATE POLICY "Users can view own interactions"
ON costume_interactions FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own interactions
CREATE POLICY "Users can create own interactions"
ON costume_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can manage their favorites
CREATE POLICY "Users can manage own favorites"
ON user_favorites FOR ALL USING (auth.uid() = user_id);
```

## Migration Strategy

### Phase 2.1: Backend Migration
1. **Set up Neon/Supabase Database**
   - Create Supabase project and Neon PostgreSQL database
   - Execute database schema migration
   - Set up authentication and RLS policies

2. **Data Import**
   - Create migration script to import existing static data
   - Map current costume structure to new schema
   - Validate data integrity

3. **API Layer**
   - Implement Supabase data access layer
   - Create TypeScript types matching database schema
   - Set up real-time subscriptions for updates

### Phase 2.2: Frontend Integration
1. **Data Service Layer**
   ```typescript
   // services/costumeService.ts
   export class CostumeService {
     async getCostumes(category?: string): Promise<Costume[]> {
       const query = supabase
         .from('costumes')
         .select(`
           *,
           category:costume_categories(name, slug),
           assets:costume_assets(url, type, description)
         `)
         .eq('is_active', true)
         .order('sort_order');
       
       if (category) {
         query.eq('category.slug', category);
       }
       
       const { data, error } = await query;
       return data || [];
     }
   }
   ```

2. **UI Component Updates**
   - Update components to consume data from Supabase
   - Add loading states and error handling
   - Implement real-time updates

3. **Admin Dashboard**
   - Create admin interface for costume management
   - Implement CRUD operations for costumes
   - Add analytics and reporting dashboard

### Phase 2.3: Advanced Features
1. **User Personalization**
   - User profiles and preferences
   - Personalized costume recommendations
   - Usage history and favorites

2. **Analytics & Insights**
   - Costume popularity tracking
   - User behavior analytics
   - Performance metrics and insights

3. **Dynamic Content**
   - User-generated costume submissions
   - Community features and ratings
   - Seasonal and event-based collections

## Implementation Timeline

### Week 1: Database Setup
- Set up Supabase project
- Execute schema migration
- Import existing data
- Configure RLS policies

### Week 2: API Development
- Implement data access layer
- Create service classes
- Add error handling
- Set up real-time subscriptions

### Week 3: Frontend Integration
- Update UI components
- Replace static data calls
- Add loading and error states
- Implement caching strategies

### Week 4: Admin Dashboard
- Build admin interface
- Implement costume management
- Add analytics views
- Test all functionality

## Benefits of Migration

### Technical Benefits
- **Scalability**: Handle larger catalogs and user base
- **Real-time Updates**: Live content updates without redeployment
- **Performance**: Optimized queries and caching
- **Security**: Row-level security and proper authentication

### Business Benefits
- **Content Management**: Easy costume updates through admin interface
- **Analytics**: Detailed usage insights and popular costume tracking
- **Personalization**: User preferences and recommendations
- **Community**: User-generated content and engagement features

## Risk Mitigation

### Technical Risks
- **Data Loss**: Implement proper backup strategies
- **Performance**: Use database indexing and query optimization
- **Downtime**: Plan for zero-downtime deployment

### Migration Strategy
- **Incremental Migration**: Phase-by-phase rollout
- **Feature Flags**: Toggle between static and dynamic data
- **Rollback Plan**: Quick rollback to static data if issues arise

## Success Metrics

### Technical Metrics
- Page load time < 2 seconds
- Database query optimization > 95%
- API response time < 500ms
- Zero data loss during migration

### Business Metrics
- 20% increase in user engagement
- 30% faster content updates
- 50% reduction in manual data management overhead
- Positive user feedback on new features
