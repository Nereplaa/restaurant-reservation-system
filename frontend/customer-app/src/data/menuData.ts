// Shared menu data storage using localStorage
// This allows admin changes to reflect on customer menu

export interface MenuItem {
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

const STORAGE_KEY = 'borcelle_menu_data';

// Default menu data
export const defaultMenuData: MenuItem[] = [
    // Başlangıçlar
    { id: 1, name: 'Zeytin & Kekikli Artizan Ekmek Trio', description: 'Sıcak taş fırın ekmekleri, zeytinyağı–balsamik dip sos ve deniz tuzu ile.', price: 220, calories: 220, image: '/images/menu/Başlangıçlar/Zeytin & Kekikli Artizan Ekmek Trio.png', category: 'starters', available: true },
    { id: 2, name: 'Izgara Halloumi & Nar Roka', description: 'Nar ekşili roka yatağında ızgara hellim, kavrulmuş fındık parçaları ile.', price: 260, calories: 310, image: '/images/menu/Başlangıçlar/Izgara Halloumi & Nar Roka.png', category: 'starters', available: true },
    { id: 3, name: 'Trüf Aromalı Mantarlı Bruschetta', description: 'Karamelize soğan, sote mantar ve hafif trüf yağı ile kızarmış ekmek üstü lezzet.', price: 240, calories: 270, image: '/images/menu/Başlangıçlar/Trüf Aromalı Mantarlı Bruschetta.png', category: 'starters', available: true },
    { id: 4, name: 'Somon Tartar Lime Breeze', description: 'Taze somon, avokado, lime sos ve susam ile rafine bir soğuk başlangıç.', price: 320, calories: 260, image: '/images/menu/Başlangıçlar/Somon Tartar Lime Breeze.png', category: 'starters', available: true },
    { id: 5, name: 'Kabak Çiçeği Dolması Serisi', description: 'Otlu pirinç iç harcı ile doldurulmuş hafif Ege klasiği. (4 adet)', price: 230, calories: 190, image: '/images/menu/Başlangıçlar/Kabak Çiçeği Dolması Serisi.png', category: 'starters', tags: ['Vejetaryen'], available: true },

    // Ana Yemekler
    { id: 6, name: 'Borcelle Signature Steak', description: '250 gr dry-aged dana antrikot, demi-glace sos, ızgara sebzeler ve patates püresi ile.', price: 780, calories: 720, image: '/images/menu/Ana Yemekler/Borcelle Signature Steak.png', category: 'mains', available: true },
    { id: 7, name: 'Kremalı Porçini Risotto', description: 'Parmesan ve tereyağı ile bağlanmış, yoğun aromalı porçini mantarlı risotto.', price: 520, calories: 580, image: '/images/menu/Ana Yemekler/Kremalı Porçini Risotto.png', category: 'mains', tags: ['Vejetaryen'], available: true },
    { id: 8, name: 'Deniz Mahsullü Linguine', description: 'Karides, midye ve kalamarla zenginleştirilmiş, beyaz şarap soslu ince makarna.', price: 560, calories: 650, image: '/images/menu/Ana Yemekler/Deniz Mahsullü Linguine.png', category: 'mains', available: true },
    { id: 9, name: 'Ballı Hardallı Fırın Somon', description: 'Kinoa yatağında narenciye dokunuşlu ballı hardal sos ile fırınlanmış somon.', price: 590, calories: 520, image: '/images/menu/Ana Yemekler/Ballı Hardallı Fırın Somon.png', category: 'mains', available: true },
    { id: 10, name: 'Osmanlı Usulü Kuzu İncik', description: '8 saat düşük ısıda pişirilmiş kuzu incik, patlıcan püresi ve kendi sosu ile.', price: 640, calories: 780, image: '/images/menu/Ana Yemekler/Osmanlı Usulü Kuzu İncik.png', category: 'mains', available: true },
    { id: 11, name: 'Vegan Izgara Köz Tabağı', description: 'Köz patlıcan, kabak, kapya biber ve humus ile dengeli bir bitkisel ana yemek.', price: 450, calories: 470, image: '/images/menu/Ana Yemekler/Vegan Izgara Köz Tabağı.png', category: 'mains', tags: ['Vegan'], available: true },

    // Gurme Pizzalar
    { id: 12, name: 'Truffle Mushroom Pizza', description: 'Mozzarella, mantar ve trüf yağı ile yoğun aromalı gurme pizza.', price: 430, calories: 690, image: '/images/menu/Gurme Pizzalar/Truffle Mushroom Pizza.png', category: 'pizzas', available: true },
    { id: 13, name: 'Napoli Margherita Deluxe', description: 'San Marzano domates sosu, buffalo mozzarella ve taze fesleğen.', price: 390, calories: 610, image: '/images/menu/Gurme Pizzalar/Napoli Margherita Deluxe.png', category: 'pizzas', tags: ['Vejetaryen'], available: true },
    { id: 14, name: 'Prosciutto & Roka', description: 'İnce dilim prosciutto, roka ve parmesan ile dengeli tuzlulukta.', price: 460, calories: 720, image: '/images/menu/Gurme Pizzalar/Prosciutto & Roka.png', category: 'pizzas', available: true },
    { id: 15, name: 'Quattro Formaggi', description: 'Gorgonzola, mozzarella, parmesan ve kaşar karışımı peynir şöleni.', price: 440, calories: 780, image: '/images/menu/Gurme Pizzalar/Quattro Formaggi.png', category: 'pizzas', available: true },

    // Şef Özel
    { id: 16, name: 'Karamelize Soğanlı T-Bone', description: '350 gr premium T-Bone, karamelize soğan ve rosmarinli patatesler ile.', price: 890, calories: 950, image: '/images/menu/Şef Özel/Karamelize Soğanlı T-Bone.png', category: 'chef', available: true },
    { id: 17, name: 'Borcelle Fileto Sufle', description: 'Şarap indirgemeli sos ile tereyağında mühürlenmiş dana fileto.', price: 840, calories: 860, image: '/images/menu/Şef Özel/Borcelle Fileto Sufle.png', category: 'chef', available: true },
    { id: 18, name: 'Kestane Püreli Ördek Göğsü', description: 'Portakal glaze ve kestane püresi ile dengelenmiş gurme ördek tabağı.', price: 820, calories: 740, image: '/images/menu/Şef Özel/Kestane Püreli Ördek Göğsü.png', category: 'chef', available: true },

    // Tatlılar
    { id: 19, name: 'Çikolatalı Volkan Sufle', description: 'Akışkan bitter çekirdek, yanında dondurma ile servis edilir.', price: 260, calories: 480, image: '/images/menu/Tatlılar/Çikolatalı Volkan Sufle.png', category: 'desserts', available: true },
    { id: 20, name: 'San Sebastian Cheesecake', description: 'Orta şekerli, kremamsı dokuda klasik yanık cheesecake.', price: 270, calories: 510, image: '/images/menu/Tatlılar/San Sebastian Cheesecake.png', category: 'desserts', available: true },
    { id: 21, name: 'Limonlu Mascarpone Cup', description: 'Limon kreması, mascarpone ve bisküvi katmanlı ferahlatıcı tatlı.', price: 240, calories: 390, image: '/images/menu/Tatlılar/Limonlu Mascarpone Cup.png', category: 'desserts', available: true },
    { id: 22, name: 'Fıstıklı Kadayıf Parfe', description: 'Antep fıstığı, kıtır kadayıf ve parfe katmanlarıyla modernleştirilmiş yerel tat.', price: 280, calories: 520, image: '/images/menu/Tatlılar/Fıstıklı Kadayıf Parfe.png', category: 'desserts', available: true },

    // İçecekler
    { id: 23, name: 'Taze Portakal Suyu', description: 'Sıkma günlük portakal suyu.', price: 120, calories: 120, image: '/images/menu/İçecekler/Taze Portakal Suyu.png', category: 'drinks', available: true },
    { id: 24, name: 'Ev Yapımı Limonata', description: 'Buzlu, naneli seçenekleriyle hafif ekşi-dengeli lezzet.', price: 110, calories: 140, image: '/images/menu/İçecekler/Ev Yapımı Limonata.png', category: 'drinks', available: true },
    { id: 25, name: 'Şeftalili Soğuk Çay', description: 'Demlenmiş çay bazlı, şeftali aromalı ferah içecek.', price: 105, calories: 110, image: '/images/menu/İçecekler/Şeftalili Soğuk Çay.png', category: 'drinks', available: true },
    { id: 26, name: 'Türk Kahvesi', description: 'Klasik, orta kavrum Türk kahvesi.', price: 80, calories: 5, image: '/images/menu/İçecekler/Türk Kahvesi.png', category: 'drinks', available: true },
    { id: 27, name: 'Cappuccino', description: 'Yoğun espresso ve süt köpüğü ile.', price: 95, calories: 80, image: '/images/menu/İçecekler/Cappuccino.png', category: 'drinks', available: true },
    { id: 28, name: 'Latte', description: 'Yumuşak içimli, süt oranı yüksek kahve.', price: 105, calories: 120, image: '/images/menu/İçecekler/Latte.png', category: 'drinks', available: true },
    { id: 29, name: 'Sade Soda', description: 'Gazlı mineral içecek.', price: 60, calories: 0, image: '/images/menu/İçecekler/Sade Soda.png', category: 'drinks', available: true },

    // Şaraplar
    { id: 30, name: 'Château Elegante Reserva', description: 'Yoğun tanenli, karadut ve siyah erik notalarına sahip gövdeli kırmızı.', price: 1700, calories: 125, image: '/images/menu/Şarap Koleksiyonu/Château Elegante Reserva.png', category: 'wines', tags: ['Kırmızı', 'Şişe'], available: true },
    { id: 31, name: 'Borcelle Cabernet Special', description: 'Meşe fıçıda dinlendirilmiş, baharat ve siyah meyve notaları taşıyan özel harman.', price: 950, calories: 130, image: '/images/menu/Şarap Koleksiyonu/Borcelle Cabernet Special.png', category: 'wines', tags: ['Kırmızı'], priceNote: 'Kadeh 210₺', available: true },
    { id: 32, name: 'Pinot Noir Rosé Serenade', description: 'Çilek ve narenciye profiline sahip, hafif gövdeli taze roze.', price: 850, calories: 115, image: '/images/menu/Şarap Koleksiyonu/Pinot Noir Rosé Serenade.png', category: 'wines', tags: ['Roze'], priceNote: 'Kadeh 190₺', available: true },
    { id: 33, name: 'Sauvignon Blanc Crystal', description: 'Tropik meyve ve bitkisel notalara sahip, yüksek asiditeli ferah beyaz şarap.', price: 900, calories: 105, image: '/images/menu/Şarap Koleksiyonu/Sauvignon Blanc Crystal.png', category: 'wines', tags: ['Beyaz'], priceNote: 'Kadeh 190₺', available: true },
    { id: 34, name: 'Chardonnay Gold Barrel', description: 'Vanilya ve tereyağı hissi barındıran, tam gövdeli fıçı Chardonnay.', price: 1100, calories: 120, image: '/images/menu/Şarap Koleksiyonu/Chardonnay Gold Barrel.png', category: 'wines', tags: ['Beyaz'], priceNote: 'Kadeh 230₺', available: true },
    { id: 35, name: 'Prosecco Stella', description: 'İnce kabarcıklı, hafif tatlı bitişli İtalyan prosecco.', price: 820, calories: 98, image: '/images/menu/Şarap Koleksiyonu/Prosecco Stella.png', category: 'wines', tags: ['Köpüklü'], priceNote: 'Kadeh 180₺', available: true },
    { id: 36, name: 'Champagne Maison Royale', description: 'Özel anlar için önerilen, dengeli asiditeye sahip prestijli Champagne.', price: 4800, calories: 95, image: '/images/menu/Şarap Koleksiyonu/Champagne Maison Royale.png', category: 'wines', tags: ['Köpüklü', 'Şişe'], available: true },
];

export const categoryList = [
    { key: 'starters', label: 'Başlangıçlar', emoji: '🥗' },
    { key: 'mains', label: 'Ana Yemekler', emoji: '🍛' },
    { key: 'pizzas', label: 'Gurme Pizzalar', emoji: '🍕' },
    { key: 'chef', label: 'Şef Özel', emoji: '👨‍🍳' },
    { key: 'desserts', label: 'Tatlılar', emoji: '🍰' },
    { key: 'drinks', label: 'İçecekler', emoji: '🥤' },
    { key: 'wines', label: 'Şaraplar', emoji: '🍷' },
];

// Get menu data from localStorage or return default
export function getMenuData(): MenuItem[] {
    if (typeof window === 'undefined') return defaultMenuData;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error reading menu data from localStorage:', e);
    }

    return defaultMenuData;
}

// Save menu data to localStorage
export function saveMenuData(items: MenuItem[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        // Dispatch custom event to notify other tabs/windows
        window.dispatchEvent(new CustomEvent('menuDataUpdated', { detail: items }));
    } catch (e) {
        console.error('Error saving menu data to localStorage:', e);
    }
}

// Reset menu data to default
export function resetMenuData(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('menuDataUpdated', { detail: defaultMenuData }));
    } catch (e) {
        console.error('Error resetting menu data:', e);
    }
}
