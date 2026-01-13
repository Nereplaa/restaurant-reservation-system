// Menu and Settings API services
// This replaces localStorage-based menuData with API calls

import api from './api';

export interface MenuItem {
    id: string;
    name: string;
    nameTr?: string;
    description: string;
    price: number;
    calories: number;
    imageUrl?: string;
    category: string;
    dietaryTags?: string[];
    preparationTime?: number;
    available: boolean;
}

export interface Category {
    id: string;
    key: string;
    label: string;
    labelTr?: string;
    emoji?: string;
    sortOrder: number;
    isActive: boolean;
}

export interface RestaurantSettings {
    id: string;
    name: string;
    slogan?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    openingHours?: Record<string, unknown>;
    openingTime: string;
    closingTime: string;
    totalTables?: string;
    totalCapacity?: string;
    services: string[];
    socialMedia?: Record<string, string>;
    heroVideoUrl?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    galleryImages: string[];
    mission?: string;
    vision?: string;
    experience?: string;
    philosophy?: string;
    features: Array<{ icon: string; title: string; description: string }>;
    heroBadges: string[];
}

// Transform API response to frontend format
function transformMenuItem(item: Record<string, unknown>): MenuItem {
    return {
        id: item.id as string,
        name: item.name as string,
        nameTr: item.name_tr as string | undefined,
        description: item.description as string || '',
        price: Number(item.price),
        calories: item.calories as number || 0,
        imageUrl: item.image_url as string | undefined,
        category: item.category as string,
        dietaryTags: item.dietary_tags as string[] | undefined,
        preparationTime: item.preparation_time as number | undefined,
        available: item.available as boolean,
    };
}

function transformCategory(cat: Record<string, unknown>): Category {
    return {
        id: cat.id as string,
        key: cat.key as string,
        label: cat.label as string,
        labelTr: cat.label_tr as string | undefined,
        emoji: cat.emoji as string | undefined,
        sortOrder: cat.sort_order as number,
        isActive: cat.is_active as boolean,
    };
}

function transformSettings(settings: Record<string, unknown>): RestaurantSettings {
    return {
        id: settings.id as string,
        name: settings.name as string,
        slogan: settings.slogan as string | undefined,
        description: settings.description as string | undefined,
        address: settings.address as string | undefined,
        phone: settings.phone as string | undefined,
        email: settings.email as string | undefined,
        openingHours: settings.opening_hours as Record<string, unknown> | undefined,
        openingTime: settings.opening_time as string || '11:00',
        closingTime: settings.closing_time as string || '23:00',
        totalTables: settings.total_tables as string | undefined,
        totalCapacity: settings.total_capacity as string | undefined,
        services: settings.services as string[] || [],
        socialMedia: settings.social_media as Record<string, string> | undefined,
        heroVideoUrl: settings.hero_video_url as string | undefined,
        heroTitle: settings.hero_title as string | undefined,
        heroSubtitle: settings.hero_subtitle as string | undefined,
        galleryImages: settings.gallery_images as string[] || [],
        mission: settings.mission as string | undefined,
        vision: settings.vision as string | undefined,
        experience: settings.experience as string | undefined,
        philosophy: settings.philosophy as string | undefined,
        features: settings.features as Array<{ icon: string; title: string; description: string }> || [],
        heroBadges: settings.hero_badges as string[] || [],
    };
}

// API calls
export async function fetchMenuItems(): Promise<MenuItem[]> {
    try {
        const response = await api.get('/menu');
        return (response.data || []).map(transformMenuItem);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return [];
    }
}

export async function fetchCategories(): Promise<Category[]> {
    try {
        const response = await api.get('/categories');
        return (response.data || []).map(transformCategory);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function fetchSettings(): Promise<RestaurantSettings | null> {
    try {
        const response = await api.get('/settings');
        return transformSettings(response.data);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

// Legacy support: Convert API MenuItem to old format used by components
export interface LegacyMenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    calories: number;
    image: string;
    category: string;
    tags?: string[];
    priceNote?: string;
    available: boolean;
}

export function toLegacyFormat(items: MenuItem[]): LegacyMenuItem[] {
    return items.map((item, index) => ({
        id: index + 1,
        name: item.name,
        description: item.description,
        price: item.price,
        calories: item.calories,
        image: item.imageUrl || `/images/menu/${getCategoryFolder(item.category)}/${item.name}.png`,
        category: item.category,
        tags: item.dietaryTags?.map(t => t.charAt(0).toUpperCase() + t.slice(1)),
        available: item.available,
    }));
}

function getCategoryFolder(category: string): string {
    const folders: Record<string, string> = {
        starters: 'Başlangıçlar',
        appetizers: 'Başlangıçlar',
        mains: 'Ana Yemekler',
        pizzas: 'Gurme Pizzalar',
        chef: 'Şef Özel',
        specials: 'Şef Özel',
        desserts: 'Tatlılar',
        drinks: 'İçecekler',
        wines: 'Şarap Koleksiyonu',
    };
    return folders[category] || category;
}

export interface LegacyCategory {
    key: string;
    label: string;
    emoji: string;
}

export function toLegacyCategoryFormat(categories: Category[]): LegacyCategory[] {
    return categories.map(cat => ({
        key: cat.key,
        label: cat.label,
        emoji: cat.emoji || '🍽️',
    }));
}
