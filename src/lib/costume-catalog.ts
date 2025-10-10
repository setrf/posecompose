/**
 * Costume catalog utilities and helper functions
 * Simple API for managing costume data and interactions
 */

import type { CostumePreset } from '@/types/costume'
import { HALLOWEEN_COSTUMES } from '@/data/costumes'

/**
 * Get all costumes
 */
export const getAllCostumes = (): CostumePreset[] => {
  return HALLOWEEN_COSTUMES
}

/**
 * Get costume by ID
 */
export const getCostumeById = (id: string): CostumePreset | undefined => {
  return HALLOWEEN_COSTUMES.find(costume => costume.id === id)
}

/**
 * Get costumes by category
 */
export const getCostumesByCategory = (category: string): CostumePreset[] => {
  return HALLOWEEN_COSTUMES.filter(costume => costume.category === category)
}

/**
 * Get featured costumes
 */
export const getFeaturedCostumes = (): CostumePreset[] => {
  return HALLOWEEN_COSTUMES.filter(costume => costume.isFeatured)
}

/**
 * Get new costumes
 */
export const getNewCostumes = (): CostumePreset[] => {
  return HALLOWEEN_COSTUMES.filter(costume => costume.isNew)
}

/**
 * Search costumes by query
 */
export const searchCostumes = (query: string): CostumePreset[] => {
  const lowercaseQuery = query.toLowerCase()
  return HALLOWEEN_COSTUMES.filter(costume => 
    costume.name.toLowerCase().includes(lowercaseQuery) ||
    costume.description.toLowerCase().includes(lowercaseQuery) ||
    costume.metadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

/**
 * Sort costumes by specified criteria
 */
export const sortCostumes = (costumes: CostumePreset[], sortBy: string): CostumePreset[] => {
  const sorted = [...costumes]
  
  if (sortBy === 'popularity') {
    return sorted.sort((a, b) => (b.metadata.popularityScore || 0) - (a.metadata.popularityScore || 0))
  }
  
  if (sortBy === 'newest') {
    return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  
  if (sortBy === 'name-asc') {
    return sorted.sort((a, b) => a.name.localeCompare(b.name))
  }
  
  if (sortBy === 'name-desc') {
    return sorted.sort((a, b) => b.name.localeCompare(a.name))
  }
  
  if (sortBy === 'difficulty-asc') {
    const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
    return sorted.sort((a, b) => difficultyOrder[a.metadata.difficulty] - difficultyOrder[b.metadata.difficulty])
  }
  
  if (sortBy === 'difficulty-desc') {
    const difficultyOrderDesc = { hard: 1, medium: 2, easy: 3 }
    return sorted.sort((a, b) => difficultyOrderDesc[a.metadata.difficulty] - difficultyOrderDesc[b.metadata.difficulty])
  }
  
  return sorted
}
