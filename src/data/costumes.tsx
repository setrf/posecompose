import type { CostumePreset, CostumeCategory, CostumeAffiliateLink } from '@/types/costume';
    
// Helper function for creating affiliate links
const createAffiliateLink = (
  id: string,
  label: string,
  url: string,
  source: CostumeAffiliateLink['source'],
  options?: Partial<CostumeAffiliateLink>
): CostumeAffiliateLink => ({
  id,
  label,
  url,
  source,
  ...options
});

// Halloween Launch Collection
export const HALLOWEEN_COSTUMES: CostumePreset[] = [
  {
    id: 'gothic-lolita',
    name: 'Gothic Lolita',
    category: 'halloween',
    description: 'Elegant gothic lolita dress with intricate lace, ribbons, and Victorian-era styling',
    version: '1.0.0',
    
    assets: [
      {
        id: 'main',
        url: '/assets/costumes/gothic-lolita/main.jpg',
        type: 'main',
        description: 'Primary gothic lolita costume reference'
      },
      {
        id: 'detail-1',
        url: '/assets/costumes/gothic-lolita/detail-lace.jpg',
        type: 'detail',
        description: 'Close-up of lace and ribbon details'
      },
      {
        id: 'background',
        url: '/assets/costumes/gothic-lolita/setting.jpg',
        type: 'background',
        description: 'Victorian mansion interior setting'
      }
    ],
    
    colors: {
      primary: '#2C1810',
      secondary: '#8B7355',
      accent: '#FF69B4',
      palette: ['#2C1810', '#8B7355', '#FF69B4', '#E6E6FA', '#483D8B']
    },
    
    transformation: {
      base: 'Transform person into gothic lolita character wearing elegant Victorian-style black dress with lace trim, ribbons, and frilly details',
      variations: [
        {
          style: 'classic',
          prompt: 'Victorian gothic lolita outfit with black dress, white lace collar, ribbons, petticoat, elegant pose, melancholic expression'
        },
        {
          style: 'modern',
          prompt: 'Modern gothic lolita fashion, black dress with pink accents, lace details, platform boots, cute but dark aesthetic'
        },
        {
          style: 'elegant',
          prompt: 'High-end gothic lolita couture, intricate black lace dress, parasol, rose accessories, noble posture, detailed fabric textures'
        }
      ],
      negativePrompts: [
        'bright colors, casual clothing, modern fashion, simple dress, no lace',
        ' cartoon, anime style, low quality, blurry, distorted proportions'
      ],
      qualityModifiers: [
        'highly detailed, intricate fabric textures, professional photography, soft lighting, dramatic shadows'
      ],
      detailEnhancements: [
        'lace details, ribbon bows, frilly petticoat, Victorian patterns, porcelain skin, elegant makeup'
      ]
    },
    
    metadata: {
      difficulty: 'medium',
      tags: ['halloween', 'gothic', 'victorian', 'lolita', 'elegant', 'dark'],
      compatibleModels: ['stable-diffusion-xl', 'midjourney-v6', 'dall-e-3'],
      estimatedProcessingTime: 45,
      season: 'halloween',
      popularityScore: 9
    },
    
    marketing: {
      displayName: 'Gothic Lolita',
      shortDescription: 'Elegant Victorian darkness meets sweet lolita aesthetic',
      socialPreview: 'Transform into an elegant gothic lolita with intricate lace and Victorian styling',
      callToAction: 'Embrace the dark elegance'
    },
    
    affiliateLinks: [
      createAffiliateLink(
        'gothic-lolita-amazon',
        'Complete Gothic Lolita Dress Set',
        'https://www.amazon.com/Gothic-Lolita-Dress-Victorian-Costume/dp/B08XYZ1234',
        'Amazon',
        {
          price: '$89.99',
          availability: 'in-stock',
          description: 'Complete gothic lolita dress with lace trim and accessories'
        }
      ),
      createAffiliateLink(
        'gothic-lolita-aliexpress',
        'Japanese Gothic Lolita Cosplay',
        'https://www.aliexpress.com/item/100500123456789.html',
        'AliExpress',
        {
          price: '$45.99',
          availability: 'in-stock',
          description: 'Affordable gothic lolita cosplay costume with fast shipping'
        }
      )
    ],
    
    isActive: true,
    isPremium: false,
    isNew: true,
    isFeatured: true,
    
    createdAt: '2025-10-09T23:29:00Z',
    updatedAt: '2025-10-09T23:29:00Z',
    
    notes: 'Perfect for Halloween and alternative fashion events',
    inspiration: 'Victorian gothic fashion meets Japanese lolita subculture'
  },
  {
    id: 'cyberpunk-samurai',
    name: 'Cyberpunk Samurai',
    category: 'halloween',
    description: 'Futuristic samurai warrior with neon-lit armor, cybernetic enhancements, and traditional Japanese elements',
    version: '1.0.0',
    
    assets: [
      {
        id: 'main',
        url: '/assets/costumes/cyberpunk-samurai/main.jpg',
        type: 'main',
        description: 'Primary cyberpunk samurai costume reference'
      },
      {
        id: 'detail-1',
        url: '/assets/costumes/cyberpunk-samurai/detail-armor.jpg',
        type: 'detail',
        description: 'Close-up of cybernetic armor and neon lights'
      },
      {
        id: 'background',
        url: '/assets/costumes/cyberpunk-samurai/setting.jpg',
        type: 'background',
        description: 'Tokyo night street with holographic ads'
      }
    ],
    
    colors: {
      primary: '#0A0A0A',
      secondary: '#FF1493',
      accent: '#00FFFF',
      palette: ['#0A0A0A', '#FF1493', '#00FFFF', '#FFD700', '#8B0000']
    },
    
    transformation: {
      base: 'Transform person into cyberpunk samurai warrior with futuristic armor, neon lights, cybernetic enhancements, and traditional Japanese elements',
      variations: [
        {
          style: 'warrior',
          prompt: 'Cyberpunk samurai warrior in sleek black armor with pink neon highlights, cybernetic eye implant, katana with energy blade, Tokyo neon background'
        },
        {
          style: 'stealth',
          prompt: 'Shadow cyberpunk ninja assassin, dark tactical suit with neon trim, hidden blades, glowing visor, rooftop in rainy Tokyo'
        },
        {
          style: 'noble',
          prompt: 'Honored cyberpunk samurai lord, ornate armor with gold inlay, traditional kabuto helmet with holographic crest, ceremonial pose'
        }
      ],
      negativePrompts: [
        'historical samurai, traditional armor, no cybernetics, no neon lights, medieval setting'
      ],
      qualityModifiers: [
        'cyberpunk aesthetic, neon lighting, high-tech, sleek design, detailed armor, cinematic lighting'
      ],
      detailEnhancements: [
        'glowing neon circuits, holographic displays, carbon fiber textures, energy effects, weathering details'
      ]
    },
    
    metadata: {
      difficulty: 'hard',
      tags: ['halloween', 'cyberpunk', 'samurai', 'futuristic', 'neon', 'tech'],
      compatibleModels: ['stable-diffusion-xl', 'midjourney-v6', 'dall-e-3'],
      estimatedProcessingTime: 60,
      season: 'halloween',
      popularityScore: 10
    },
    
    marketing: {
      displayName: 'Cyberpunk Samurai',
      shortDescription: 'Future meets feudal in neon-lit warrior armor',
      socialPreview: 'Become a high-tech samurai warrior with cybernetic enhancements and neon armor',
      callToAction: 'Enter the neon battlefield'
    },
    
    affiliateLinks: [
      createAffiliateLink(
        'cyberpunk-samurai-spirithalloween',
        'Cyberpunk Samurai Armor Costume',
        'https://www.spirithalloween.com/cyberpunk-samurai-costume/192789.html',
        'SpiritHalloween',
        {
          price: '$149.99',
          availability: 'in-stock',
          description: 'LED cyberpunk samurai armor with glowing effects'
        }
      ),
      createAffiliateLink(
        'cyberpunk-samurai-aliexpress',
        'Future Samurai LED Cosplay',
        'https://www.aliexpress.com/item/100500987654321.html',
        'AliExpress',
        {
          price: '$78.99',
          availability: 'in-stock',
          description: 'Cyberpunk samurai armor with LED lights and katana'
        }
      )
    ],
    
    isActive: true,
    isPremium: false,
    isNew: true,
    isFeatured: true,
    
    createdAt: '2025-10-09T23:29:00Z',
    updatedAt: '2025-10-09T23:29:00Z',
    
    notes: 'High tech complexity, requires good reference for cybernetic details',
    inspiration: 'Ghost in the Shell meets Seven Samurai'
  },
  {
    id: 'magical-girl',
    name: 'Magical Girl',
    category: 'halloween',
    description: 'Sparkling magical transformation with flowing outfit, crystal accessories, and cosmic powers',
    version: '1.0.0',
    
    assets: [
      {
        id: 'main',
        url: '/assets/costumes/magical-girl/main.jpg',
        type: 'main',
        description: 'Primary magical girl costume reference'
      },
      {
        id: 'detail-1',
        url: '/assets/costumes/magical-girl/detail-crystal.jpg',
        type: 'detail',
        description: 'Close-up of crystal accessories and jewelry'
      },
      {
        id: 'background',
        url: '/assets/costumes/magical-girl/setting.jpg',
        type: 'background',
        description: 'Sparkling cosmic background with stars'
      }
    ],
    
    colors: {
      primary: '#FF69B4',
      secondary: '#87CEEB',
      accent: '#FFD700',
      palette: ['#FF69B4', '#87CEEB', '#FFD700', '#FFA500', '#9370DB']
    },
    
    transformation: {
      base: 'Transform person into magical girl with sparkling transformation outfit, crystal accessories, flowing ribbons, and cosmic powers',
      variations: [
        {
          style: 'sailor',
          prompt: 'Magical girl in sailor-style outfit with pastel colors, crystal tiara, magic wand transformation pose, glowing aura'
        },
        {
          style: 'princess',
          prompt: 'Fantasy magical princess dress with sparkles, flowing cape, jewel accessories, magical energy swirling around'
        },
        {
          style: 'warrior',
          prompt: 'Battle magical girl armor with glowing crystals, energy sword, determined expression, dynamic action pose'
        }
      ],
      negativePrompts: [
        'realistic clothing, casual outfit, no magic effects, mundane setting, dull colors'
      ],
      qualityModifiers: [
        'magical sparkle effects, glowing crystals, pastel colors, sparkles, lens flare, vibrant'
      ],
      detailEnhancements: [
        'crystal jewelry, flowing ribbons, magical aura transformation, sparkles, glowing effects, intricate details'
      ]
    },
    
    metadata: {
      difficulty: 'medium',
      tags: ['halloween', 'magical', 'anime', 'transformation', 'sparkles', 'fantasy'],
      compatibleModels: ['stable-diffusion-xl', 'midjourney-v6', 'dall-e-3'],
      estimatedProcessingTime: 50,
      season: 'halloween',
      popularityScore: 8
    },
    
    marketing: {
      displayName: 'Magical Girl',
      shortDescription: 'Sparkling transformation into anime-inspired magic',
      socialPreview: 'Transform into a magical girl with crystal powers and sparkling effects',
      callToAction: 'Unleash your magic powers'
    },
    
    affiliateLinks: [
      createAffiliateLink(
        'magical-girl-amazon',
        'Magical Girl Transformation Costume',
        'https://www.amazon.com/Magical-Girl-Transformation-Dress-Sailor/dp/B08LMN4567',
        'Amazon',
        {
          price: '$69.99',
          availability: 'in-stock',
          description: 'Complete magical girl dress accessories and wand'
        }
      ),
      createAffiliateLink(
        'magical-girl-etsy',
        'Handmade Magical Girl Cosplay',
        'https://www.etsy.com/listing/123456789/magical-girl-costume-custom-order',
        'Etsy',
        {
          price: '$120.00',
          availability: 'pre-order',
          description: 'Custom magical girl cosplay handmade to your measurements'
        }
      )
    ],
    
    isActive: true,
    isPremium: false,
    isNew: true,
    isFeatured: false,
    
    createdAt: '2025-10-09T23:29:00Z',
    updatedAt: '2025-10-09T23:29:00Z',
    
    notes: 'Classic anime magical girl trope, popular with cosplay community',
    inspiration: 'Sailor Moon and magical girl anime genre'
  },
  {
    id: 'vampire-noble',
    name: 'Vampire Noble',
    category: 'halloween',
    description: 'Elegant vampire aristocrat with gothic attire, cape, and immortal sophistication',
    version: '1.0.0',
    
    assets: [
      {
        id: 'main',
        url: '/assets/costumes/vampire-noble/main.jpg',
        type: 'main',
        description: 'Primary vampire noble costume reference'
      },
      {
        id: 'detail-1',
        url: '/assets/costumes/vampire-noble/detail-cape.jpg',
        type: 'detail',
        description: 'Close-up of cape and jewelry details'
      },
      {
        id: 'background',
        url: '/assets/costumes/vampire-noble/setting.jpg',
        type: 'background',
        description: 'Gothic castle interior at moonlight'
      }
    ],
    
    colors: {
      primary: '#2C1810',
      secondary: '#8B0000',
      accent: '#FFD700',
      palette: ['#2C1810', '#8B0000', '#FFD700', '#4B0082', '#FFFFFF']
    },
    
    transformation: {
      base: 'Transform person into elegant vampire noble with gothic attire, flowing cape, jewelry, and aristocratic demeanor',
      variations: [
        {
          style: 'classic',
          prompt: 'Classic vampire noble in black velvet suit, crimson silk cape with stand-up collar, ornate jewelry, pale skin, sharp features'
        },
        {
          style: 'lord',
          prompt: 'Vampire lord in formal evening wear, black coat with gold embroidery, flowing cape, medallion, commanding presence'
        },
        {
          style: 'lady',
          prompt: 'Vampire countess in elegant black gown with crimson accents, lace details, diamond jewelry, timeless beauty'
        }
      ],
      negativePrompts: [
        'modern clothing, casual wear, no vampire features, normal skin tone, bright daylight setting'
      ],
      qualityModifiers: [
        'gothic elegance, aristocratic, velvet textures, silk fabric, dramatic lighting, shadows'
      ],
      detailEnhancements: [
        'faint glow, pale skin, sharp features, red accents, jewelry details, cape movement, immortal presence'
      ]
    },
    
    metadata: {
      difficulty: 'easy',
      tags: ['halloween', 'vampire', 'gothic', 'noble', 'aristocratic', 'immortal'],
      compatibleModels: ['stable-diffusion-xl', 'midjourney-v6', 'dall-e-3'],
      estimatedProcessingTime: 35,
      season: 'halloween',
      popularityScore: 7
    },
    
    marketing: {
      displayName: 'Vampire Noble',
      shortDescription: 'Eternal elegance in gothic aristocracy',
      socialPreview: 'Transform into an elegant vampire noble with timeless sophistication',
      callToAction: 'Embrace eternal elegance'
    },
    
    affiliateLinks: [
      createAffiliateLink(
        'vampire-noble-amazon',
        'Victorian Vampire Costume Set',
        'https://www.amazon.com/Victorian-Vampire-Costume-Cape-Medallion/dp/B08ABC8901',
        'Amazon',
        {
          price: '$59.99',
          availability: 'in-stock',
          description: 'Complete vampire noble costume with cape and jewelry'
        }
      ),
      createAffiliateLink(
        'vampire-noble-spirithalloween',
        'Deluxe Vampire Lord Costume',
        'https://www.spirithalloween.com/deluxe-vampire-lord-costume/165432.html',
        'SpiritHalloween',
        {
          price: '$89.99',
          availability: 'in-stock',
          description: 'Premium vampire lord costume with accessories'
        }
      )
    ],
    
    isActive: true,
    isPremium: false,
    isNew: true,
    isFeatured: false,
    
    createdAt: '2025-10-09T23:29:00Z',
    updatedAt: '2025-10-09T23:29:00Z',
    
    notes: 'Classic Halloween costume, relatively easy transformation',
    inspiration: 'Dracula, Interview with the Vampire, gothic romance'
  },
  {
    id: 'kawaii-ghost',
    name: 'Kawaii Ghost',
    category: 'halloween',
    description: 'Cute pastel ghost costume with adorable features, Japanese kawaii aesthetic, and friendly ghostly appearance',
    version: '1.0.0',
    
    assets: [
      {
        id: 'main',
        url: '/assets/costumes/kawaii-ghost/main.jpg',
        type: 'main',
        description: 'Primary kawaii ghost costume reference'
      },
      {
        id: 'detail-1',
        url: '/assets/costumes/kawaii-ghost/detail-cute.jpg',
        type: 'detail',
        description: 'Close-up of cute ghost features and accessories'
      },
      {
        id: 'background',
        url: '/assets/costumes/kawaii-ghost/setting.jpg',
        type: 'background',
        description: 'Enchanted forest with glowing mushrooms'
      }
    ],
    
    colors: {
      primary: '#E6E6FA',
      secondary: '#FFB6C1',
      accent: '#98FB98',
      palette: ['#E6E6FA', '#FFB6C1', '#98FB98', '#FFE4E1', '#F0E68C']
    },
    
    transformation: {
      base: 'Transform person into cute kawaii ghost with pastel colors, adorable features, floating ethereal appearance, and friendly ghostly aura',
      variations: [
        {
          style: 'classic-kawaii',
          prompt: 'Cute kawaii ghost with pastel lavender and pink colors, round friendly features, small ghost tail, sparkles around, innocent expression'
        },
        {
          style: 'forest-spirit',
          prompt: 'Friendly forest ghost in soft pastel colors, surrounded by glowing mushrooms, fairy lights, gentle ethereal glow, playful pose'
        },
        {
          style: 'dream-ghost',
          prompt: 'Dreamy kawaii ghost with pastel rainbow aura, sleeping expression, small floating cloud accessories, soft focus background'
        }
      ],
      negativePrompts: [
        'scary ghost, horror, dark colors, menacing appearance, traditional scary ghost design'
      ],
      qualityModifiers: [
        'kawaii aesthetic, pastel colors, soft lighting, gentle glow, cute and adorable, ethereal'
      ],
      detailEnhancements: [
        'sparkles, glow effects, soft edges, round features, pastel palette, friendly expression, floating appearance'
      ]
    },
    
    metadata: {
      difficulty: 'easy',
      tags: ['halloween', 'kawaii', 'cute', 'ghost', 'pastel', 'japanese', 'friendly'],
      compatibleModels: ['stable-diffusion-xl', 'midjourney-v6', 'dall-e-3'],
      estimatedProcessingTime: 30,
      season: 'halloween',
      popularityScore: 6
    },
    
    marketing: {
      displayName: 'Kawaii Ghost',
      shortDescription: 'Spooky-cute ethereal ghostly transformation',
      socialPreview: 'Transform into an adorable kawaii ghost with pastel colors and friendly charm',
      callToAction: 'Float into cute haunting'
    },
    
    affiliateLinks: [
      createAffiliateLink(
        'kawaii-ghost-amazon',
        'Cute Ghost Costume for Adults',
        'https://www.amazon.com/Kawaii-Ghost-Costume-Pastel-Halloween/dp/B08DEF2345',
        'Amazon',
        {
          price: '$39.99',
          availability: 'in-stock',
          description: 'Adorable pastel ghost costume with friendly design'
        }
      ),
      createAffiliateLink(
        'kawaii-ghost-aliexpress',
        'Japanese Kawaii Ghost Kimono',
        'https://www.aliexpress.com/item/100500555111222.html',
        'AliExpress',
        {
          price: '$28.99',
          availability: 'in-stock',
          description: 'Cute ghost style kimono costume with accessories'
        }
      )
    ],
    
    isActive: true,
    isPremium: false,
    isNew: true,
    isFeatured: false,
    
    createdAt: '2025-10-09T23:29:00Z',
    updatedAt: '2025-10-09T23:29:00Z',
    
    notes: 'Perfect for those who want cute rather than scary Halloween',
    inspiration: 'Japanese kawaii culture meets friendly ghost stories'
  },
  {
    id: 'dark-witch',
    name: 'Dark Witch',
    category: 'halloween',
    description: 'Modern witch aesthetic with dark crystals, mystical symbols, and contemporary magical styling',
    version: '1.0.0',
    
    assets: [
      {
        id: 'main',
        url: '/assets/costumes/dark-witch/main.jpg',
        type: 'main',
        description: 'Primary dark witch costume reference'
      },
      {
        id: 'detail-1',
        url: '/assets/costumes/dark-witch/detail-crystals.jpg',
        type: 'detail',
        description: 'Close-up of crystal accessories and magical items'
      },
      {
        id: 'background',
        url: '/assets/costumes/dark-witch/setting.jpg',
        type: 'background',
        description: 'Misty forest circle with magical energy'
      }
    ],
    
    colors: {
      primary: '#2F4F4F',
      secondary: '#483D8B',
      accent: '#9400D3',
      palette: ['#2F4F4F', '#483D8B', '#9400D3', '#191970', '#8A2BE2']
    },
    
    transformation: {
      base: 'Transform person into modern dark witch with mystical outfit, crystal accessories, magical aura, and contemporary witch aesthetic',
      variations: [
        {
          style: 'modern-witch',
          prompt: 'Modern dark witch in flowing dark robes with crystal jewelry, mystical symbols, glowing amulet, powerful magical presence'
        },
        {
          style: 'crystal-witch',
          prompt: 'Crystal witch adorned with mystical gems, dark purple and blue robes, energy crystals floating around, ethereal glow'
        },
        {
          style: 'forest-witch',
          prompt: 'Forest witch in earth-toned robes, natural crystals, wooden staff, surrounded by magical energy, misty forest setting'
        }
      ],
      negativePrompts: [
        'green-skinned witch, stereotypical witch, broomstick, pointed hat, cartoon witch'
      ],
      qualityModifiers: [
        'mystical atmosphere, dark magic aesthetic, crystal effects, energy auras, magical lighting'
      ],
      detailEnhancements: [
        'glowing crystals, mystical symbols, energy effects, magical aura, jewelry details, fabric textures'
      ]
    },
    
    metadata: {
      difficulty: 'medium',
      tags: ['halloween', 'witch', 'dark', 'crystals', 'mystical', 'modern', 'magic'],
      compatibleModels: ['stable-diffusion-xl', 'midjourney-v6', 'dall-e-3'],
      estimatedProcessingTime: 45,
      season: 'halloween',
      popularityScore: 8
    },
    
    marketing: {
      displayName: 'Dark Witch',
      shortDescription: 'Modern mystical witch with crystal power',
      socialPreview: 'Transform into a contemporary dark witch with crystal accessories and mystical energy',
      callToAction: 'Awaken your magical power'
    },
    
    affiliateLinks: [
      createAffiliateLink(
        'dark-witch-spirithalloween',
        'Modern Dark Witch Costume',
        'https://www.spirithalloween.com/modern-dark-witch-costume/987654.html',
        'SpiritHalloween',
        {
          price: '$79.99',
          availability: 'in-stock',
          description: 'Contemporary witch costume with crystal accessories'
        }
      ),
      createAffiliateLink(
        'dark-witch-etsy',
        'Handmade Crystal Witch Costume',
        'https://www.etsy.com/listing/987654321/dark-witch-crystal-costume-custom',
        'Etsy',
        {
          price: '$135.00',
          availability: 'pre-order',
          description: 'Custom dark witch costume with real crystal accessories'
        }
      ),
      createAffiliateLink(
        'dark-witch-amazon',
        'Mystical Witch Costume Set',
        'https://www.amazon.com/Mystical-Witch-Costume-Crystal-Accessories/dp/B08GHI3456',
        'Amazon',
        {
          price: '$54.99',
          availability: 'in-stock',
          description: 'Complete dark witch costume with crystal props'
        }
      )
    ],
    
    isActive: true,
    isPremium: false,
    isNew: true,
    isFeatured: false,
    
    createdAt: '2025-10-09T23:29:00Z',
    updatedAt: '2025-10-09T23:29:00Z',
    
    notes: 'Modern witch aesthetic, appeals to contemporary mystical interests',
    inspiration: 'Modern witchcraft, crystal healing, dark fantasy manga'
  }
];

// Costume Categories
export const COSTUME_CATEGORIES: CostumeCategory[] = [
  {
    id: 'halloween',
    name: 'Halloween Collection',
    description: 'Spooky and fun costumes perfect for Halloween season',
    sortOrder: 1,
    isActive: true
  },
  {
    id: 'seasonal',
    name: 'Seasonal',
    description: 'Costumes for different seasons and holidays',
    sortOrder: 2,
    isActive: false
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Magical and mythical character transformations',
    sortOrder: 3,
    isActive: false
  }
];

// Helper functions
export const getCostumeById = (id: string): CostumePreset | undefined => {
  return HALLOWEEN_COSTUMES.find(costume => costume.id === id);
};

export const getCostumesByCategory = (category: string): CostumePreset[] => {
  return HALLOWEEN_COSTUMES.filter(costume => costume.category === category);
};

export const getFeaturedCostumes = (): CostumePreset[] => {
  return HALLOWEEN_COSTUMES.filter(costume => costume.isFeatured);
};

export const getNewCostumes = (): CostumePreset[] => {
  return HALLOWEEN_COSTUMES.filter(costume => costume.isNew);
};

export const searchCostumes = (query: string): CostumePreset[] => {
  const lowercaseQuery = query.toLowerCase();
  return HALLOWEEN_COSTUMES.filter(costume => 
    costume.name.toLowerCase().includes(lowercaseQuery) ||
    costume.description.toLowerCase().includes(lowercaseQuery) ||
    costume.metadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
