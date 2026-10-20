/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Phone, 
  Instagram, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Minus, 
  X, 
  Flame, 
  Coffee, 
  Utensils, 
  ChevronRight, 
  Star,
  Check
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: 'buns' | 'siders' | 'refreshers' | 'cheela' | 'parantha' | 'rolls' | 'beverages' | 'desserts';
  subCategory?: string;
  description: string;
  price: number;
  mustTry?: boolean;
  image?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
  selectedAddOns: {
    amulButter: boolean;
    cheese: boolean;
  };
  itemTotal: number;
}

const MENU_ITEMS: MenuItem[] = [
  // Buns Special
  { id: 'bun-1', name: 'Bun Chutney', category: 'buns', description: 'Soft bun with desi chutney tadka.', price: 30 },
  { id: 'bun-2', name: 'Bun Makhan', category: 'buns', description: 'Soft bun with creamy butter.', price: 39 },
  { id: 'bun-3', name: 'Bun Jam', category: 'buns', description: 'Soft bun with sweet fruit jam.', price: 50 },
  { id: 'bun-4', name: 'Bun Maska', category: 'buns', description: 'Soft bun with creamy whipped maska.', price: 50, mustTry: true },
  { id: 'bun-5', name: 'Bun Stuffed Veggies', category: 'buns', description: 'Soft bun stuffed with desi mix veggies.', price: 50 },
  { id: 'bun-6', name: 'The Doon\'s Famous Bun Tikki', category: 'buns', description: 'Crispy aaloo tikki served in a soft bun with desi flavors of tangy & spicy chutney.', price: 59, mustTry: true },
  { id: 'bun-7', name: 'Bun Choco Peanut Butter', category: 'buns', description: 'Soft bun loaded with rich Chocolate Peanut Butter.', price: 70 },
  { id: 'bun-8', name: 'Bun Nutella Chocolate', category: 'buns', description: 'Soft bun loaded with rich Nutella chocolate.', price: 70 },
  { id: 'bun-9', name: 'Cheesy Pizza Bun', category: 'buns', description: 'Soft baked bun loaded with mozzarella, pizza sauce & herbs.', price: 79, mustTry: true },

  // Siders
  { id: 'side-1', name: 'Fryums', category: 'siders', description: 'Crispy seasoned fryums snack.', price: 25 },
  { id: 'side-2', name: 'Fries Plain', category: 'siders', description: 'Classic salted crispy French fries.', price: 50 },
  { id: 'side-3', name: 'Masala Fries', category: 'siders', description: 'Tossed in signature tangy spice mix.', price: 60 },
  { id: 'side-4', name: 'Crispy Aloo Wedges', category: 'siders', description: 'Golden potato wedges with herbs.', price: 70 },
  { id: 'side-5', name: 'Veggies Fingers', category: 'siders', description: 'Crispy crumb-coated vegetable fingers.', price: 90 },
  { id: 'side-6', name: 'Jalapeno Cheese Pockets', category: 'siders', description: 'Crispy pockets oozing with melted cheese and jalapenos.', price: 99 },
  { id: 'side-7', name: 'Pizza Pockets', category: 'siders', description: 'Stuffed with pizza sauce, corn and cheese.', price: 99 },
  { id: 'side-8', name: 'Veg Lollipop', category: 'siders', description: 'Spicy veg lollipops with schezwan dip.', price: 100 },
  { id: 'side-9', name: 'Hara Bhara Kebab', category: 'siders', description: 'Spinach and green pea patties pan-seared.', price: 110 },
  { id: 'side-10', name: 'Falafel Kebab', category: 'siders', description: 'Middle eastern chickpea patties with tahini hint.', price: 110 },
  { id: 'side-11', name: 'Veg Cutlet', category: 'siders', description: 'Crispy potato & vegetable cutlet.', price: 60 },
  { id: 'side-12', name: 'Dahi Kebab', category: 'siders', description: 'Melt-in-mouth hung curd kebabs.', price: 60 },
  { id: 'side-13', name: 'Sabudana Wada', category: 'siders', description: 'Crispy sabudana patties with peanuts.', price: 60 },
  { id: 'side-14', name: 'Cocktail Samosa', category: 'siders', description: 'Mini crispy samosas with spicy filling.', price: 60 },
  { id: 'side-15', name: 'Veg Seek Kebab', category: 'siders', description: 'Skewered spiced vegetable kebabs.', price: 70 },
  { id: 'side-16', name: 'Cheese Nuggets / Cheese Balls', category: 'siders', description: 'Crispy golden balls bursting with gooey cheese.', price: 70 },

  // Mood Refreshers (Lime & Soda)
  { id: 'ref-1', name: 'Lemonade (Sweet / Salt)', category: 'refreshers', subCategory: 'Lime', description: 'Classic refreshing lime drink.', price: 40 },
  { id: 'ref-2', name: 'Masala Shikanji', category: 'refreshers', subCategory: 'Lime', description: 'Traditional spiced Indian lemonade.', price: 50 },
  { id: 'ref-3', name: 'Virgin Mint', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Crisp lime and garden fresh mint with soda.', price: 50 },
  { id: 'ref-4', name: 'Green Mint Blossom', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Refreshing herbal mint soda blend.', price: 60 },
  { id: 'ref-5', name: 'Pudhina Punch', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Spiced mint cooler.', price: 60 },
  { id: 'ref-6', name: 'Blue Sea Lagoon', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Vibrant blue curacao citrus refresher.', price: 60 },
  { id: 'ref-7', name: 'Pineapple Colada', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Tropical pineapple soda splash.', price: 60 },
  { id: 'ref-8', name: 'Litchi Desire', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Sweet litchi infused sparkling drink.', price: 60 },
  { id: 'ref-9', name: 'Watermelon Delight', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Cool watermelon summer refresher.', price: 60 },
  { id: 'ref-10', name: 'Fizzy Apple', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Crisp green apple fizz.', price: 60 },
  { id: 'ref-11', name: 'Orange Blush', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Citrus punch soda.', price: 60 },
  { id: 'ref-12', name: 'Red Rose Fire', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Rose scented sparkling cooler.', price: 60 },
  { id: 'ref-13', name: 'Blackcurrant Berry Blast', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Rich tart blackcurrant soda.', price: 70 },
  { id: 'ref-14', name: 'Guava Chilli Moker', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Guava juice with a hint of red chilli spice.', price: 70 },
  { id: 'ref-15', name: 'Mango Chilli Smash', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Alphonso mango with spicy chilli twist.', price: 70 },
  { id: 'ref-16', name: 'Tropical Sunrise Fizz', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Multi-fruit tropical soda.', price: 70 },
  { id: 'ref-17', name: 'Blueberry Lemon Cooler', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Sweet blueberries with zesty lemon soda.', price: 70 },
  { id: 'ref-18', name: 'Kiwi Mint Sparkle', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Kiwi fruit puree with mint soda.', price: 70 },
  { id: 'ref-19', name: 'Lychee Rose Cooler', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Exotic lychee and delicate rose fusion.', price: 70 },
  { id: 'ref-20', name: 'Green Apple Cooler', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Tart green apple soda.', price: 70 },
  { id: 'ref-21', name: 'Slawberry Soda', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Fresh strawberry crushed in soda.', price: 70 },
  { id: 'ref-22', name: 'Cranberry Soda', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Refreshing tart cranberry sparkling drink.', price: 70 },
  { id: 'ref-23', name: 'Passion Fruit Mojito', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Exotic passion fruit mojito.', price: 70 },
  { id: 'ref-24', name: 'Bubblegum Mojito', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Nostalgic bubblegum flavored soda.', price: 70 },
  { id: 'ref-25', name: 'Lemon Soda', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Sparkling zesty lemon soda.', price: 70 },
  { id: 'ref-26', name: 'Desi Twist Kala Khatta', category: 'refreshers', subCategory: 'Soda & Lime', description: 'Tangy and spiced kala khatta refresher.', price: 70 },

  // Cheela
  { id: 'cheela-1', name: 'Plain Besan Cheela', category: 'cheela', subCategory: 'Besan Cheela', description: 'Classic gram flour savory pancake.', price: 50 },
  { id: 'cheela-2', name: 'Veggies Stuffed Besan Cheela', category: 'cheela', subCategory: 'Besan Cheela', description: 'Loaded with seasoned crunchy vegetables.', price: 60 },
  { id: 'cheela-3', name: 'Paneer Stuffed Besan Cheela', category: 'cheela', subCategory: 'Besan Cheela', description: 'Stuffed with spiced grated paneer.', price: 70, mustTry: true },
  { id: 'cheela-4', name: 'Cheese Stuffed Besan Cheela', category: 'cheela', subCategory: 'Besan Cheela', description: 'Melted cheese loaded besan cheela.', price: 90 },
  { id: 'cheela-5', name: 'Plain Moong Cheela', category: 'cheela', subCategory: 'Moong Cheela', description: 'Healthy yellow moong dal cheela.', price: 60 },
  { id: 'cheela-6', name: 'Veggies Stuffed Moong Cheela', category: 'cheela', subCategory: 'Moong Cheela', description: 'Moong cheela with mixed veggies.', price: 70 },
  { id: 'cheela-7', name: 'Paneer Stuffed Moong Cheela', category: 'cheela', subCategory: 'Moong Cheela', description: 'Rich paneer stuffing inside moong cheela.', price: 80 },
  { id: 'cheela-8', name: 'Cheese Stuffed Moong Cheela', category: 'cheela', subCategory: 'Moong Cheela', description: 'Cheesy moong dal delicacy.', price: 100 },

  // Parantha
  { id: 'par-1', name: 'Aloo Parantha', category: 'parantha', description: 'Classic spiced potato stuffed whole wheat parantha with butter.', price: 50 },
  { id: 'par-2', name: 'Aloo Pyaaz Parantha', category: 'parantha', description: 'Potato and onion stuffed parantha with desi tadka.', price: 60, mustTry: true },
  { id: 'par-3', name: 'Pyaaz Parantha', category: 'parantha', description: 'Crispy onion parantha.', price: 60 },
  { id: 'par-4', name: 'Paneer Parantha', category: 'parantha', description: 'Loaded with spiced cottage cheese.', price: 90 },
  { id: 'par-5', name: 'Sattu Parantha', category: 'parantha', description: 'Traditional roasted gram flour stuffed parantha.', price: 60 },
  { id: 'par-6', name: 'Sev Parantha', category: 'parantha', description: 'Spiced crispy sev stuffed parantha.', price: 60 },
  { id: 'par-7', name: 'Sweetcorn Parantha', category: 'parantha', description: 'Sweet corn kernels with herbs and spices.', price: 70 },
  { id: 'par-8', name: 'Matar Parantha', category: 'parantha', description: 'Green pea stuffed wholesome parantha.', price: 70 },
  { id: 'par-9', name: 'Mix Veg Parantha', category: 'parantha', description: 'Assorted seasonal vegetables stuffed parantha.', price: 80 },
  { id: 'par-10', name: 'Puran Poli (2 Piece)', category: 'parantha', description: 'Sweet traditional Maharashtrian flatbread with jaggery and lentils.', price: 120, mustTry: true },

  // Kathi Rolls
  { id: 'roll-1', name: 'Potato Roll', category: 'rolls', subCategory: 'Veg Rolls', description: 'Spiced potato filling wrapped in soft rumali roti.', price: 50 },
  { id: 'roll-2', name: 'Aloo Tikki Roll', category: 'rolls', subCategory: 'Veg Rolls', description: 'Crispy tikki with onions and mint chutney in a roll.', price: 50 },
  { id: 'roll-3', name: 'Mixed Veg Roll', category: 'rolls', subCategory: 'Veg Rolls', description: 'Assorted spiced veggies in a wrap.', price: 70, mustTry: true },
  { id: 'roll-4', name: 'Mixed Veg Cheese Roll', category: 'rolls', subCategory: 'Veg Rolls', description: 'Veggies and melted cheese roll.', price: 80 },
  { id: 'roll-5', name: 'Paneer Roll', category: 'rolls', subCategory: 'Paneer Rolls', description: 'Juicy paneer chunks with capsicum and onions.', price: 90 },
  { id: 'roll-6', name: 'Paneer Sweet Corn Roll', category: 'rolls', subCategory: 'Paneer Rolls', description: 'Paneer and sweet corn with creamy sauce.', price: 100, mustTry: true },
  { id: 'roll-7', name: 'Paneer Bhurji Cheese Blended', category: 'rolls', subCategory: 'Paneer Rolls', description: 'Scrambled paneer loaded with melted cheese.', price: 110 },
  { id: 'roll-8', name: 'Soya Kathi Roll', category: 'rolls', subCategory: 'Soya Rolls', description: 'High-protein soya chunks in kathi spices.', price: 80 },
  { id: 'roll-9', name: 'Soya Masala Roll', category: 'rolls', subCategory: 'Soya Rolls', description: 'Spicy masala soya wrap.', price: 90, mustTry: true },
  { id: 'roll-10', name: 'Soya Malai Roll', category: 'rolls', subCategory: 'Soya Rolls', description: 'Creamy malai flavored soya wrap.', price: 100 },
  { id: 'roll-11', name: 'Soya Kebab Roll', category: 'rolls', subCategory: 'Soya Rolls', description: 'Smoky soya kebab wrap.', price: 110 },
  { id: 'roll-12', name: 'Mushroom Roll', category: 'rolls', subCategory: 'Mushroom Rolls', description: 'Sautéed mushrooms with garlic and herbs.', price: 90, mustTry: true },
  { id: 'roll-13', name: 'Paneer Soya Roll', category: 'rolls', subCategory: 'Fusion Rolls', description: 'Combination of paneer and soya chunks.', price: 99 },
  { id: 'roll-14', name: 'Paneer Mushroom Roll', category: 'rolls', subCategory: 'Fusion Rolls', description: 'Paneer and mushrooms tossed together.', price: 99 },

  // Other Beverages (Cool Tea & Coffee)
  { id: 'bev-1', name: 'Lemon Iced Tea', category: 'beverages', subCategory: 'Cool Tea Creations', description: 'Refreshing chilled lemon tea.', price: 50 },
  { id: 'bev-2', name: 'Peach Iced Tea', category: 'beverages', subCategory: 'Cool Tea Creations', description: 'Sweet peach flavored iced tea.', price: 70 },
  { id: 'bev-3', name: 'Cold Coffee', category: 'beverages', subCategory: 'Coffee', description: 'Classic creamy blended cold coffee.', price: 60 },
  { id: 'bev-4', name: 'Cold Coffee (with Ice Cream)', category: 'beverages', subCategory: 'Coffee', description: 'Rich cold coffee topped with vanilla ice cream scoop.', price: 70 },

  // Desserts
  { id: 'des-1', name: 'Chocolate Fudge', category: 'desserts', description: 'Rich and decadent chocolate fudge brownie.', price: 50 },
  { id: 'des-2', name: 'Choco Lava Cake', category: 'desserts', description: 'Warm cake with gooey molten chocolate center.', price: 70 }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mustTryOnly, setMustTryOnly] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // Customization modal state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [addAmulButter, setAddAmulButter] = useState<boolean>(false);
  const [addCheese, setAddCheese] = useState<boolean>(false);
  const [itemQty, setItemQty] = useState<number>(1);

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');

  // Filter items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMustTry = !mustTryOnly || item.mustTry;
      return matchesCat && matchesSearch && matchesMustTry;
    });
  }, [activeCategory, searchQuery, mustTryOnly]);

  const openCustomizeModal = (item: MenuItem) => {
    setCustomizingItem(item);
    setAddAmulButter(false);
    setAddCheese(false);
    setItemQty(1);
  };

  const handleAddToCartWithCustomization = () => {
    if (!customizingItem) return;
    let unitPrice = customizingItem.price;
    if (addAmulButter) unitPrice += 15;
    if (addCheese) unitPrice += 20;

    const newItem: CartItem = {
      ...customizingItem,
      quantity: itemQty,
      selectedAddOns: {
        amulButter: addAmulButter,
        cheese: addCheese
      },
      itemTotal: unitPrice * itemQty
    };

    // Check if exact same item with same add-ons exists
    const existingIndex = cart.findIndex(c => 
      c.id === newItem.id && 
      c.selectedAddOns.amulButter === newItem.selectedAddOns.amulButter &&
      c.selectedAddOns.cheese === newItem.selectedAddOns.cheese
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += itemQty;
      updated[existingIndex].itemTotal += newItem.itemTotal;
      setCart(updated);
    } else {
      setCart([...cart, newItem]);
    }

    setCustomizingItem(null);
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      const unitPrice = (updated[index].itemTotal / updated[index].quantity);
      updated[index].quantity = newQty;
      updated[index].itemTotal = unitPrice * newQty;
    }
    setCart(updated);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.itemTotal, 0);
  const deliveryFee = orderType === 'delivery' && subtotal > 0 ? 30 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || (orderType === 'delivery' && !customerAddress)) {
      alert('Please fill in all required contact details.');
      return;
    }
    const randId = 'BB-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randId);
    setOrderSuccess(true);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-800 font-sans selection:bg-amber-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand */}
          <a href="#" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-amber-800 text-amber-50 flex items-center justify-center font-bold text-lg shadow-sm">
              BB
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-stone-900 block leading-none">
                THE BUN BASKET
              </span>
              <span className="text-xs text-amber-700 font-medium tracking-wide">
                By Two Brothers · 100% Pure Veg
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <a href="#menu" className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0">Menu</a>
            <a href="#specials" className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0">Must Try</a>
            <a href="#story" className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0">Our Story</a>
            <a href="#reviews" className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0">Reviews</a>
            <a href="#contact" className="hover:text-amber-800 transition-colors whitespace-nowrap shrink-0">Contact</a>
          </nav>

          {/* Zone 3: Primary Action & Cart */}
          <div className="flex items-center gap-3 shrink-0">
            <a 
              href="tel:+916268374195" 
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-amber-800" />
              <span>+91 62683 74195</span>
            </a>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-stone-900 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img 
            src="/src/assets/images/cafe_hero_banner_1792495668861.jpg" 
            alt="The Bun Basket Cafe Interior" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Pure Vegetarian Cafe</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
              Freshly Baked Buns & Artisanal Delights
            </h1>
            <p className="text-lg text-stone-300 mb-8 leading-relaxed">
              Welcome to The Bun Basket by Two Brothers. Experience legendary Bun Tikkies, cheesy pizza buns, crispy siders, refreshing sodas, and wholesome paranthas crafted with love.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="#menu" 
                className="px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
              >
                <span>Explore Full Menu</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <a 
                href="tel:+916268374195" 
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all inline-flex items-center gap-2 border border-white/20"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call to Order</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <div className="bg-amber-900 text-amber-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold mb-1">100% Pure Veg</span>
            <span className="text-xs text-amber-200">Prepared in pristine hygiene</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold mb-1">Freshly Baked</span>
            <span className="text-xs text-amber-200">Daily baked soft buns</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold mb-1">Doon's Favorite</span>
            <span className="text-xs text-amber-200">Legendary Bun Tikkies</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold mb-1">Quick Delivery</span>
            <span className="text-xs text-amber-200">Hot & delicious doorstep service</span>
          </div>
        </div>
      </div>

      {/* Main Menu Section */}
      <main id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-2">Our Culinary Offerings</h2>
            <h3 className="text-3xl font-extrabold text-stone-900 tracking-tight">Explore The Menu</h3>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search buns, rolls, drinks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 w-64 shadow-sm"
              />
            </div>

            <button 
              onClick={() => setMustTryOnly(!mustTryOnly)}
              className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 shadow-sm ${
                mustTryOnly 
                  ? 'bg-amber-800 text-white' 
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Must Try Specials</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'buns', label: 'Buns Special' },
            { id: 'siders', label: 'Siders' },
            { id: 'refreshers', label: 'Mood Refreshers' },
            { id: 'cheela', label: 'Cheela' },
            { id: 'parantha', label: 'Parantha' },
            { id: 'rolls', label: 'Kathi Rolls' },
            { id: 'beverages', label: 'Cool Tea & Coffee' },
            { id: 'desserts', label: 'Desserts' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                activeCategory === cat.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
            <Utensils className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-stone-800 mb-1">No items found</h4>
            <p className="text-sm text-stone-500">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      {item.subCategory && (
                        <span className="text-[11px] font-medium text-amber-700 uppercase tracking-wider block mb-1">
                          {item.subCategory}
                        </span>
                      )}
                      <h4 className="text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                        {item.name}
                      </h4>
                    </div>
                    {item.mustTry && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-200 shrink-0">
                        <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                        <span>Must Try</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-600 mb-6 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <span className="text-lg font-bold text-stone-900 tabular-nums">
                    ₹{item.price}
                  </span>
                  <button
                    onClick={() => openCustomizeModal(item)}
                    className="px-4 py-2 bg-stone-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add-On & Customization Modal */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold text-stone-900">{customizingItem.name}</h3>
                <p className="text-xs text-stone-500">Customize your order</p>
              </div>
              <button 
                onClick={() => setCustomizingItem(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-stone-600 mb-6">{customizingItem.description}</p>

            <div className="space-y-4 mb-6">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">Add-ons</span>
              
              <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={addAmulButter} 
                    onChange={(e) => setAddAmulButter(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-800 focus:ring-amber-800 border-stone-300"
                  />
                  <span className="text-sm font-medium text-stone-800">Extra Amul Butter</span>
                </div>
                <span className="text-sm font-bold text-stone-700">+₹15</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={addCheese} 
                    onChange={(e) => setAddCheese(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-800 focus:ring-amber-800 border-stone-300"
                  />
                  <span className="text-sm font-medium text-stone-800">Extra Cheese</span>
                </div>
                <span className="text-sm font-bold text-stone-700">+₹20</span>
              </label>
            </div>

            <div className="flex items-center justify-between mb-6 pt-4 border-t border-stone-100">
              <span className="text-sm font-semibold text-stone-700">Quantity</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setItemQty(Math.max(1, itemQty - 1))}
                  className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-200"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-stone-900 w-6 text-center tabular-nums">{itemQty}</span>
                <button 
                  onClick={() => setItemQty(itemQty + 1)}
                  className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCartWithCustomization}
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Add to Cart · ₹{(customizingItem.price + (addAmulButter ? 15 : 0) + (addCheese ? 20 : 0)) * itemQty}</span>
            </button>
          </div>
        </div>
      )}

      {/* Cart Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-800" />
                  <h3 className="text-lg font-bold text-stone-900">Your Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-600 font-medium mb-1">Your cart is empty</p>
                    <p className="text-xs text-stone-400">Add delicious items from the menu to start your order.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                      <div className="flex-1">
                        <h4 className="font-bold text-stone-900 text-sm mb-1">{item.name}</h4>
                        <div className="text-xs text-stone-500 space-y-0.5 mb-2">
                          {item.selectedAddOns.amulButter && <div>+ Extra Amul Butter (₹15)</div>}
                          {item.selectedAddOns.cheese && <div>+ Extra Cheese (₹20)</div>}
                        </div>
                        <span className="font-bold text-stone-900 text-sm tabular-nums">₹{item.itemTotal}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(idx, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-stone-900 text-sm w-5 text-center tabular-nums">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(idx, 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal</span>
                      <span className="font-semibold tabular-nums">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Delivery Fee</span>
                      <span className="font-semibold tabular-nums">{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                    </div>
                    <div className="flex justify-between text-stone-900 font-bold text-base pt-2 border-t border-stone-200">
                      <span>Total Amount</span>
                      <span className="tabular-nums">₹{grandTotal}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100">
              <h3 className="text-xl font-bold text-stone-900">Complete Your Order</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-stone-900 mb-2">Order Placed Successfully!</h4>
                <p className="text-stone-600 text-sm mb-4">
                  Thank you for ordering with The Bun Basket, <span className="font-semibold">{customerName}</span>! Your order ID is <span className="font-bold text-amber-800">{orderId}</span>.
                </p>
                <p className="text-xs text-stone-500 mb-8">
                  We are preparing your fresh order right now. For any queries, call us at +91 6268374195.
                </p>
                <button
                  onClick={() => {
                    setOrderSuccess(false);
                    setIsCheckoutOpen(false);
                  }}
                  className="px-6 py-3 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-800"
                >
                  Back to Menu
                </button>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">Order Type</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`py-3 rounded-xl text-sm font-semibold border transition-all ${
                        orderType === 'delivery'
                          ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      Home Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`py-3 rounded-xl text-sm font-semibold border transition-all ${
                        orderType === 'pickup'
                          ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      Café Pickup / Dine-In
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Rahul Sharma" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +91 98765 43210" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                    />
                  </div>

                  {orderType === 'delivery' && (
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Delivery Address *</label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="House / Flat No., Street, Landmark, Area" 
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 resize-none"
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Items Total</span>
                    <span className="font-semibold tabular-nums">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold tabular-nums">{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-stone-900 font-bold text-base pt-2 border-t border-stone-200">
                    <span>Amount to Pay (Cash / Online on Delivery)</span>
                    <span className="tabular-nums">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-xl shadow-md transition-colors"
                >
                  Place Order (Pay on Delivery)
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Our Story Section */}
      <section id="story" className="py-20 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-2 block">Our Craft & Heritage</span>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-6">
              Crafted with Passion by Two Brothers
            </h2>
            <p className="text-stone-600 mb-6 leading-relaxed">
              Founded by two brothers with a deep love for wholesome street food and artisanal baking, <span className="font-semibold text-stone-900">The Bun Basket</span> is committed to 100% pure vegetarian excellence. From our signature soft buns baked fresh every morning to tangy desi chutneys and spicy Bun Tikkies, every bite tells a story of authentic flavor and uncompromised hygiene.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-100">
              <div>
                <span className="text-3xl font-extrabold text-amber-800 block mb-1">100%</span>
                <span className="text-xs text-stone-600 font-medium">Pure Vegetarian Ingredients</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-amber-800 block mb-1">50+</span>
                <span className="text-xs text-stone-600 font-medium">Delightful Buns, Rolls & Drinks</span>
              </div>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video lg:aspect-square">
            <img 
              src="/src/assets/images/buns_special_item_1792495668789.jpg" 
              alt="Bun Basket Special" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section id="reviews" className="py-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-2 block">Foodie Love</span>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-stone-700 text-sm mb-6 leading-relaxed">
                  "The Doon's Famous Bun Tikki is absolute perfection! Crispy tikki, soft fresh bun, and tangy chutney take you straight to heaven. Highly recommend!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-full bg-amber-800 text-white font-bold flex items-center justify-center text-sm">
                  AS
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Aman Sharma</h4>
                  <span className="text-xs text-stone-500">Regular Foodie</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-stone-700 text-sm mb-6 leading-relaxed">
                  "Their Cheesy Pizza Bun and Guava Chilli Moker refresher are my absolute go-to evening snack. Super hygienic and incredibly tasty!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-full bg-amber-800 text-white font-bold flex items-center justify-center text-sm">
                  PP
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Priya Patel</h4>
                  <span className="text-xs text-stone-500">Local Guide</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-stone-700 text-sm mb-6 leading-relaxed">
                  "Amazing variety of paranthas and rolls. The Puran Poli is just like homemade magic. Love what the Two Brothers have built here!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-full bg-amber-800 text-white font-bold flex items-center justify-center text-sm">
                  RK
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Rohit Kumar</h4>
                  <span className="text-xs text-stone-500">Cafe Enthusiast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-stone-950 text-stone-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-lg">
                BB
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">THE BUN BASKET</span>
            </div>
            <p className="text-sm text-stone-400 mb-6 leading-relaxed">
              100% Pure Veg Cafe by Two Brothers. Serving freshly baked buns, refreshing mood coolers, and delicious artisanal snacks.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://instagram.com/the_bunbasket" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-900 hover:bg-amber-800 text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="tel:+916268374195" 
                className="w-10 h-10 rounded-full bg-stone-900 hover:bg-amber-800 text-white flex items-center justify-center transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-base mb-4">Contact & Hours</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                <div>
                  <div>+91 62683 74195</div>
                  <div>+91 70172 44263</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="w-4 h-4 text-amber-500 shrink-0" />
                <span>@the_bunbasket</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Open Daily: 10:00 AM – 10:00 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#menu" className="hover:text-white transition-colors">Full Menu</a></li>
              <li><a href="#specials" className="hover:text-white transition-colors">Must Try Specials</a></li>
              <li><a href="#story" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Customer Reviews</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} The Bun Basket (By Two Brothers). All rights reserved. 100% Pure Veg.</p>
        </div>
      </footer>
    </div>
  );
}
