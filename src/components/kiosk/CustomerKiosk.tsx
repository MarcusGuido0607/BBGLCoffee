import React, { useState } from 'react';
import { 
  Product, 
  CartItem, 
  CartCustomization, 
  ProductCategory, 
  DrinkSize, 
  Temperature, 
  SugarLevel, 
  Order, 
  ProductAddon 
} from '../../types';
import { MENU_PRODUCTS } from '../../data/mockData';
import { BbglLogo } from '../brand/BbglLogo';
import { ProductArt } from '../brand/ProductArt';
import { 
  Coffee, 
  UtensilsCrossed, 
  Sparkles, 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ArrowLeft,
  Mail,
  Award,
  Flame,
  Info
} from 'lucide-react';

interface CustomerKioskProps {
  onOrderCreated: (order: Order) => void;
  onExitToAttract?: () => void;
}

type KioskScreen = 'attract' | 'menu' | 'completed_cash' | 'completed_gcash';

export const CustomerKiosk: React.FC<CustomerKioskProps> = ({ onOrderCreated }) => {
  const [currentScreen, setCurrentScreen] = useState<KioskScreen>('attract');
  const [activeCategory, setActiveCategory] = useState<'all' | ProductCategory>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Customization Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customSize, setCustomSize] = useState<DrinkSize>('tall');
  const [customTemp, setCustomTemp] = useState<Temperature>('iced');
  const [customSugar, setCustomSugar] = useState<SugarLevel>('75%');
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [receiptEmail, setReceiptEmail] = useState('');
  const [saveContact, setSaveContact] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'gcash' | null>(null);

  // GCash Input in Checkout / Post
  const [gcashRefInput, setGcashRefInput] = useState('');
  const [gcashError, setGcashError] = useState('');

  // Post-Completion Display State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Student Loyalty Modal State
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [studentContact, setStudentContact] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [studentVerified, setStudentVerified] = useState(false);

  // Calculate live item price in modal
  const sizeDelta = customSize === 'grande' ? 20 : customSize === 'venti' ? 40 : 0;
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const modalUnitPrice = (selectedProduct ? selectedProduct.basePrice : 0) + sizeDelta + addonsTotal;

  // Cart Subtotal
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const cartTotalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Open customization modal
  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setCustomSize(product.defaultSize || 'tall');
    setCustomTemp(product.allowTemperature ? 'iced' : 'hot');
    setCustomSugar(product.allowSugar ? '75%' : '100%');
    setSelectedAddons([]);
    setSpecialInstructions('');
  };

  const handleToggleAddon = (addon: ProductAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const customization: CartCustomization = {
      size: customSize,
      sizePriceDelta: sizeDelta,
      temperature: customTemp,
      sugarLevel: customSugar,
      selectedAddons,
      specialInstructions: specialInstructions.trim().slice(0, 200),
    };

    const newItem: CartItem = {
      cartItemId: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      product: selectedProduct,
      customization,
      quantity: 1,
      unitPrice: modalUnitPrice,
      totalPrice: modalUnitPrice,
    };

    setCart((prev) => [...prev, newItem]);
    setSelectedProduct(null);
    setIsCartDrawerOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Submit Cash Kiosk Order
  const handleProceedCash = () => {
    const ticketSeq = Math.floor(Math.random() * 80) + 20;
    const ticketNumber = `C-0${ticketSeq}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      ticketNumber,
      orderType: 'kiosk_cash',
      status: 'pending_cash',
      items: [...cart],
      subtotal: cartSubtotal,
      discountAmount: studentVerified ? Math.round(cartSubtotal * 0.1) : 0, // 10% student kiosk perk
      discountType: studentVerified ? 'student' : null,
      netTotal: studentVerified ? Math.round(cartSubtotal * 0.9) : cartSubtotal,
      paymentMethod: 'cash',
      customerEmail: receiptEmail.trim() || undefined,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      placedVia: 'Kiosk',
    };

    onOrderCreated(newOrder);
    setCompletedOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
    setCurrentScreen('completed_cash');
  };

  // Prepare GCash flow
  const handleOpenGcashFlow = () => {
    setSelectedPaymentMethod('gcash');
  };

  // Confirm GCash with 13-digit Reference Number
  const handleSubmitGcashRef = () => {
    const cleaned = gcashRefInput.trim();
    if (!/^\d{13}$/.test(cleaned)) {
      setGcashError('Please enter a valid 13-digit numeric GCash reference number (e.g. 1002938475819)');
      return;
    }

    setGcashError('');
    const ticketSeq = Math.floor(Math.random() * 90) + 105;
    const ticketNumber = `B-${ticketSeq}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      ticketNumber,
      orderType: 'kiosk_gcash',
      status: 'gcash_verification',
      items: [...cart],
      subtotal: cartSubtotal,
      discountAmount: studentVerified ? Math.round(cartSubtotal * 0.1) : 0,
      discountType: studentVerified ? 'student' : null,
      netTotal: studentVerified ? Math.round(cartSubtotal * 0.9) : cartSubtotal,
      paymentMethod: 'gcash',
      gcashRefNumber: cleaned,
      customerEmail: receiptEmail.trim() || undefined,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      placedVia: 'Kiosk',
    };

    onOrderCreated(newOrder);
    setCompletedOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
    setSelectedPaymentMethod(null);
    setCurrentScreen('completed_gcash');
  };

  const handleResetKiosk = () => {
    setCurrentScreen('attract');
    setCart([]);
    setCompletedOrder(null);
    setSelectedProduct(null);
    setIsCartDrawerOpen(false);
    setIsCheckoutOpen(false);
    setSelectedPaymentMethod(null);
    setGcashRefInput('');
    setGcashError('');
  };

  const filteredProducts = MENU_PRODUCTS.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="relative w-full h-full min-h-[820px] bg-[#FDFBF7] text-[#3E2723] flex flex-col font-sans select-none overflow-hidden">
      {/* ========================================================
          SCREEN A1: IDLE / ATTRACT SCREEN
         ======================================================== */}
      {currentScreen === 'attract' && (
        <div className="relative flex-1 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-[#FDFBF7] via-[#F3EDE2] to-[#E9DEC8] overflow-hidden">
          {/* Subtle Ambient Steaming Coffee Loops */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#C68B59] blur-3xl animate-pulse" />
            <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-[#795548] blur-3xl" />
          </div>

          {/* Top Brand Banner */}
          <div className="w-full text-center pt-8 z-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#C68B59]">
              Campus Cafe & Specialty Brews
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-[#3E2723] mt-1">
              Welcome to BBGL Coffee
            </h1>
          </div>

          {/* Center Mascot & Steaming Coffee Hero */}
          <div className="flex flex-col items-center justify-center my-auto z-10 text-center max-w-sm">
            <div className="relative p-6 rounded-full bg-[#FDFBF7]/80 backdrop-blur-sm shadow-xl border border-[#C68B59]/20 mb-8 transform hover:scale-105 transition-transform duration-300">
              <BbglLogo size={190} animatedSteam={true} />
              <div className="absolute -bottom-2 bg-[#3E2723] text-[#FDFBF7] text-xs font-bold px-4 py-1 rounded-full shadow-md">
                Freshly Brewed On Campus
              </div>
            </div>

            <p className="font-display text-3xl font-extrabold text-[#3E2723] leading-tight">
              Fuel Your Day With The Friendly Bear
            </p>
            <p className="text-sm text-[#795548] mt-3 max-w-xs leading-relaxed">
              Touch the screen below to order signature espresso drinks, tiger boba, and our famous Filipino spaghetti!
            </p>

            {/* Big High-Contrast CTA Button */}
            <button
              onClick={() => setCurrentScreen('menu')}
              className="mt-8 w-full max-w-xs py-5 px-8 bg-[#3E2723] hover:bg-[#2E1C18] text-[#FDFBF7] font-display text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-[#C68B59]"
            >
              <span>Tap to Order</span>
              <ChevronRight className="w-6 h-6 stroke-[3] text-[#C68B59]" />
            </button>
          </div>

          {/* Bottom Secondary Loyalty Link */}
          <div className="w-full text-center pb-6 z-10">
            <button
              onClick={() => setIsLoyaltyModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs text-[#795548] hover:text-[#3E2723] font-medium border-b border-dotted border-[#C68B59] pb-0.5 transition-colors"
            >
              <Award className="w-4 h-4 text-[#C68B59]" />
              <span>Returning Student? Tap for Loyalty / E-Receipts (Phone/Email OTP, No Password required)</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN A2: MENU & ORDERING CATALOG
         ======================================================== */}
      {currentScreen === 'menu' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FDFBF7]">
          {/* Kiosk Top Header Bar */}
          <header className="px-6 py-4 bg-[#FDFBF7] border-b border-[#3E2723]/10 flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-3">
              <BbglLogo size={42} />
              <div>
                <h2 className="font-display font-bold text-lg text-[#3E2723] leading-none">BBGL Coffee</h2>
                <span className="text-[11px] text-[#795548]">Self-Service Campus Kiosk #01</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {studentVerified && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#2E7D32]/10 border border-[#2E7D32]/30 rounded-full text-xs font-semibold text-[#2E7D32]">
                  <Award className="w-3.5 h-3.5" />
                  <span>Student 10% Active</span>
                </div>
              )}

              <button
                onClick={() => setCurrentScreen('attract')}
                className="px-3 py-1.5 text-xs font-semibold text-[#795548] hover:text-[#3E2723] border border-[#3E2723]/20 rounded-lg hover:bg-[#F3EDE2]"
              >
                Cancel / Exit
              </button>
            </div>
          </header>

          {/* Category Tabs */}
          <div className="px-6 py-3 bg-[#F3EDE2]/60 border-b border-[#3E2723]/10 flex items-center gap-2 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#3E2723] text-[#FDFBF7] shadow-sm'
                  : 'bg-[#FDFBF7] text-[#795548] border border-[#3E2723]/15 hover:bg-[#FDFBF7]/80'
              }`}
            >
              All Items ({MENU_PRODUCTS.length})
            </button>
            <button
              onClick={() => setActiveCategory('coffee')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === 'coffee'
                  ? 'bg-[#3E2723] text-[#FDFBF7] shadow-sm'
                  : 'bg-[#FDFBF7] text-[#795548] border border-[#3E2723]/15 hover:bg-[#FDFBF7]/80'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Espresso & Coffee</span>
            </button>
            <button
              onClick={() => setActiveCategory('milktea')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === 'milktea'
                  ? 'bg-[#3E2723] text-[#FDFBF7] shadow-sm'
                  : 'bg-[#FDFBF7] text-[#795548] border border-[#3E2723]/15 hover:bg-[#FDFBF7]/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C68B59]" />
              <span>Milk Tea</span>
            </button>
            <button
              onClick={() => setActiveCategory('pastries_meals')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === 'pastries_meals'
                  ? 'bg-[#3E2723] text-[#FDFBF7] shadow-sm'
                  : 'bg-[#FDFBF7] text-[#795548] border border-[#3E2723]/15 hover:bg-[#FDFBF7]/80'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Pastries & Meals</span>
            </button>
          </div>

          {/* Product Grid Area (Scrollable Catalog) */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 pb-24">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleOpenProduct(product)}
                  className="group relative bg-[#FDFBF7] border border-[#3E2723]/15 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#C68B59] transition-all cursor-pointer flex flex-col justify-between"
                >
                  {/* Food/Drink Photography Art */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F3EDE2]">
                    <ProductArt artKey={product.imageArtKey} name={product.name} />
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-[#3E2723]/90 text-[#FDFBF7] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-xs">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-3.5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-display font-bold text-sm text-[#3E2723] line-clamp-1 group-hover:text-[#C68B59] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-[#795548] line-clamp-2 mt-1 leading-snug">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#3E2723]/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#795548] font-medium">Base Price</span>
                        <span className="font-mono text-base font-bold text-[#3E2723] tabular-nums">
                          ₱{product.basePrice.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProduct(product);
                        }}
                        className="px-3 py-1.5 bg-[#C68B59] hover:bg-[#A97242] active:scale-95 text-[#FDFBF7] text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
                      >
                        <span>Add</span>
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Bottom Cart Bar */}
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-[#FDFBF7] border-t border-[#3E2723]/15 shadow-xl flex items-center justify-between gap-4 z-20">
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-3 text-left"
            >
              <div className="relative p-2.5 bg-[#3E2723] text-[#FDFBF7] rounded-xl shadow-sm">
                <ShoppingBag className="w-5 h-5" />
                {cartTotalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#C68B59] text-[#FDFBF7] font-mono text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#FDFBF7]">
                    {cartTotalItemsCount}
                  </span>
                )}
              </div>
              <div>
                <span className="text-[11px] text-[#795548] font-medium block">
                  {cartTotalItemsCount === 0 ? 'Tray is empty' : `${cartTotalItemsCount} item(s) in tray`}
                </span>
                <span className="font-mono text-base font-extrabold text-[#3E2723] tabular-nums">
                  ₱{cartSubtotal.toFixed(2)}
                </span>
              </div>
            </button>

            <button
              disabled={cart.length === 0}
              onClick={() => setIsCheckoutOpen(true)}
              className={`px-6 py-3.5 rounded-xl font-display text-sm font-bold shadow-md flex items-center gap-2 transition-all ${
                cart.length > 0
                  ? 'bg-[#2E7D32] hover:bg-[#256629] text-[#FDFBF7] active:scale-95'
                  : 'bg-[#3E2723]/20 text-[#3E2723]/40 cursor-not-allowed'
              }`}
            >
              <span>Review & Pay</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          CUSTOMIZATION MODAL (ON CARD TAP)
         ======================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-[#3E2723]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-[#FDFBF7] rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#3E2723]/20 animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#3E2723]/10 flex items-center justify-between shrink-0 bg-[#F3EDE2]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#3E2723]/10">
                  <ProductArt artKey={selectedProduct.imageArtKey} name={selectedProduct.name} aspectRatio="1/1" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#3E2723]">{selectedProduct.name}</h3>
                  <span className="font-mono text-xs text-[#795548] tabular-nums">Base: ₱{selectedProduct.basePrice.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-[#795548] hover:text-[#3E2723] rounded-full hover:bg-[#3E2723]/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customization Options Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Drink Sizes (Tall, Grande, Venti) */}
              {selectedProduct.isDrink && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#795548] block mb-2">
                    Size Selection
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['tall', 'grande', 'venti'] as DrinkSize[]).map((size) => {
                      const delta = size === 'grande' ? 20 : size === 'venti' ? 40 : 0;
                      return (
                        <button
                          key={size}
                          onClick={() => setCustomSize(size)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            customSize === size
                              ? 'border-[#3E2723] bg-[#3E2723] text-[#FDFBF7] shadow-xs'
                              : 'border-[#3E2723]/20 bg-[#FDFBF7] text-[#3E2723] hover:bg-[#F3EDE2]'
                          }`}
                        >
                          <span className="capitalize font-bold block">{size}</span>
                          <span className="font-mono text-[11px] opacity-80 block tabular-nums">
                            {delta > 0 ? `+₱${delta}` : 'Base'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Temperature Selection */}
              {selectedProduct.allowTemperature && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#795548] block mb-2">
                    Temperature
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCustomTemp('iced')}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                        customTemp === 'iced'
                          ? 'border-[#3E2723] bg-[#3E2723] text-[#FDFBF7]'
                          : 'border-[#3E2723]/20 bg-[#FDFBF7] text-[#3E2723]'
                      }`}
                    >
                      ❄️ Iced (Chilled)
                    </button>
                    <button
                      onClick={() => setCustomTemp('hot')}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                        customTemp === 'hot'
                          ? 'border-[#3E2723] bg-[#3E2723] text-[#FDFBF7]'
                          : 'border-[#3E2723]/20 bg-[#FDFBF7] text-[#3E2723]'
                      }`}
                    >
                      ☕ Hot (Steamed)
                    </button>
                  </div>
                </div>
              )}

              {/* Sugar Level */}
              {selectedProduct.allowSugar && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#795548] block mb-2">
                    Sweetness Level
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(['0%', '25%', '50%', '75%', '100%'] as SugarLevel[]).map((level) => (
                      <button
                        key={level}
                        onClick={() => setCustomSugar(level)}
                        className={`py-2 rounded-lg border text-center font-mono text-xs font-bold transition-all ${
                          customSugar === level
                            ? 'border-[#C68B59] bg-[#C68B59] text-[#FDFBF7]'
                            : 'border-[#3E2723]/15 bg-[#FDFBF7] text-[#3E2723]'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons List */}
              {selectedProduct.availableAddons.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#795548] block mb-2">
                    Customize Add-Ons
                  </label>
                  <div className="space-y-2">
                    {selectedProduct.availableAddons.map((addon) => {
                      const isSelected = selectedAddons.some((a) => a.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => handleToggleAddon(addon)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#2E7D32] bg-[#2E7D32]/10 text-[#3E2723]'
                              : 'border-[#3E2723]/15 bg-[#FDFBF7] text-[#3E2723] hover:bg-[#F3EDE2]/50'
                          }`}
                        >
                          <span className="font-semibold">{addon.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#795548] tabular-nums">+₱{addon.price}</span>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                                isSelected ? 'bg-[#2E7D32] border-[#2E7D32] text-white' : 'border-[#3E2723]/30'
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Instructions Field (max 200 characters) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#795548]">
                    Special Instructions
                  </label>
                  <span className="font-mono text-[10px] text-[#795548]">
                    {specialInstructions.length}/200
                  </span>
                </div>
                <textarea
                  value={specialInstructions}
                  maxLength={200}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Less ice, separate sauce, allergies..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-[#3E2723]/20 bg-white text-xs text-[#3E2723] placeholder-[#795548]/50 focus:outline-hidden focus:border-[#C68B59]"
                />
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="p-4 bg-[#F3EDE2] border-t border-[#3E2723]/10 flex items-center justify-between gap-4 shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#795548] font-medium">Item Subtotal</span>
                <span className="font-mono text-lg font-black text-[#3E2723] tabular-nums">
                  ₱{modalUnitPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-[#3E2723] hover:bg-[#2E1C18] active:scale-95 text-[#FDFBF7] font-display text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <span>Add to Order</span>
                <span className="font-mono text-xs opacity-90 tabular-nums">• ₱{modalUnitPrice.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CART SIDE DRAWER
         ======================================================== */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#3E2723]/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-[#FDFBF7] h-full flex flex-col shadow-2xl border-l border-[#3E2723]/20 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 border-b border-[#3E2723]/10 flex items-center justify-between bg-[#F3EDE2]/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#3E2723]" />
                <h3 className="font-display font-bold text-base text-[#3E2723]">Your Order Tray</h3>
                <span className="text-xs text-[#795548]">({cartTotalItemsCount})</span>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#795548] hover:text-[#3E2723] hover:bg-[#3E2723]/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#795548]">
                  <ShoppingBag className="w-12 h-12 stroke-1 mb-3 opacity-40" />
                  <p className="font-bold text-sm">Your tray is empty</p>
                  <p className="text-xs mt-1">Tap any drink or meal on the menu to customize your order.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3 bg-white border border-[#3E2723]/10 rounded-xl flex gap-3 shadow-xs"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#3E2723]/10 shrink-0">
                      <ProductArt artKey={item.product.imageArtKey} name={item.product.name} aspectRatio="1/1" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="font-display font-bold text-xs text-[#3E2723]">{item.product.name}</h4>
                          <span className="font-mono text-xs font-bold text-[#3E2723] tabular-nums">
                            ₱{item.totalPrice.toFixed(2)}
                          </span>
                        </div>

                        {/* Modifiers breakdown */}
                        <div className="text-[10px] text-[#795548] space-y-0.5 mt-1">
                          {item.product.isDrink && (
                            <div>
                              <span className="capitalize">{item.customization.size}</span> ·{' '}
                              <span className="capitalize">{item.customization.temperature}</span> ·{' '}
                              <span>{item.customization.sugarLevel} Sweet</span>
                            </div>
                          )}
                          {item.customization.selectedAddons.length > 0 && (
                            <div>
                              + {item.customization.selectedAddons.map((a) => a.name).join(', ')}
                            </div>
                          )}
                          {item.customization.specialInstructions && (
                            <div className="italic text-[#C68B59]">
                              "{item.customization.specialInstructions}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#3E2723]/5">
                        <span className="text-[10px] text-[#795548]">Qty</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.cartItemId, -1)}
                            className="w-6 h-6 rounded-md bg-[#F3EDE2] hover:bg-[#E9DEC8] flex items-center justify-center text-[#3E2723]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-bold tabular-nums w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.cartItemId, 1)}
                            className="w-6 h-6 rounded-md bg-[#F3EDE2] hover:bg-[#E9DEC8] flex items-center justify-center text-[#3E2723]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Summary & Checkout Button */}
            {cart.length > 0 && (
              <div className="p-4 bg-[#F3EDE2] border-t border-[#3E2723]/10 space-y-3 shrink-0">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#795548]">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums">₱{cartSubtotal.toFixed(2)}</span>
                  </div>
                  {studentVerified && (
                    <div className="flex justify-between text-[#2E7D32] font-semibold">
                      <span>Student Perk (10%)</span>
                      <span className="font-mono tabular-nums">-₱{(cartSubtotal * 0.1).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-[#3E2723] pt-1 border-t border-[#3E2723]/10">
                    <span>Total Amount</span>
                    <span className="font-mono tabular-nums">
                      ₱{(studentVerified ? cartSubtotal * 0.9 : cartSubtotal).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#256629] text-[#FDFBF7] font-display text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN A3: CHECKOUT & PAYMENT SELECTION MODAL
         ======================================================== */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-[#3E2723]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl overflow-hidden shadow-2xl border border-[#3E2723]/20 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#3E2723]/10 flex items-center justify-between bg-[#F3EDE2]/50">
              <h3 className="font-display font-bold text-lg text-[#3E2723]">Choose Payment Method</h3>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setSelectedPaymentMethod(null);
                }}
                className="p-1.5 rounded-lg text-[#795548] hover:text-[#3E2723]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Total Due Callout */}
              <div className="p-4 rounded-2xl bg-[#F3EDE2] text-center border border-[#3E2723]/10">
                <span className="text-xs text-[#795548] uppercase font-bold tracking-wider">Total Amount Due</span>
                <div className="font-mono text-3xl font-black text-[#3E2723] mt-1 tabular-nums">
                  ₱{(studentVerified ? cartSubtotal * 0.9 : cartSubtotal).toFixed(2)}
                </div>
                <span className="text-[11px] text-[#795548] mt-0.5 block">{cartTotalItemsCount} item(s) in order</span>
              </div>

              {/* Optional E-Receipt Email Input */}
              <div>
                <label className="text-xs font-bold text-[#795548] block mb-1.5">
                  E-Receipt Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#795548] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={receiptEmail}
                    onChange={(e) => setReceiptEmail(e.target.value)}
                    placeholder="student@university.edu.ph"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#3E2723]/20 bg-white text-xs text-[#3E2723] placeholder-[#795548]/50 focus:outline-hidden focus:border-[#C68B59]"
                  />
                </div>
                <label className="flex items-center gap-2 mt-2 cursor-pointer text-[11px] text-[#795548]">
                  <input
                    type="checkbox"
                    checked={saveContact}
                    onChange={(e) => setSaveContact(e.target.checked)}
                    className="rounded text-[#3E2723] focus:ring-[#C68B59]"
                  />
                  <span>Save my contact for future campus orders</span>
                </label>
              </div>

              {/* Split Payment Options or GCash Reference Input Form */}
              {selectedPaymentMethod !== 'gcash' ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {/* Button 1: Cash at Counter */}
                  <button
                    onClick={handleProceedCash}
                    className="p-5 rounded-2xl border-2 border-[#3E2723]/20 hover:border-[#3E2723] bg-white hover:bg-[#F3EDE2]/40 text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="p-3 w-fit rounded-xl bg-[#3E2723]/10 text-[#3E2723] group-hover:bg-[#3E2723] group-hover:text-white transition-colors">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div className="mt-4">
                      <h4 className="font-display font-bold text-sm text-[#3E2723]">Cash at Counter</h4>
                      <p className="text-[10px] text-[#795548] mt-1 leading-snug">
                        Pay cash to the cashier with your holding ticket.
                      </p>
                    </div>
                  </button>

                  {/* Button 2: GCash Online Payment */}
                  <button
                    onClick={handleOpenGcashFlow}
                    className="p-5 rounded-2xl border-2 border-[#007DFE]/30 hover:border-[#007DFE] bg-white hover:bg-[#007DFE]/5 text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="p-3 w-fit rounded-xl bg-[#007DFE]/10 text-[#007DFE] group-hover:bg-[#007DFE] group-hover:text-white transition-colors">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div className="mt-4">
                      <h4 className="font-display font-bold text-sm text-[#007DFE]">GCash QR</h4>
                      <p className="text-[10px] text-[#795548] mt-1 leading-snug">
                        Scan static QR & enter 13-digit reference number.
                      </p>
                    </div>
                  </button>
                </div>
              ) : (
                /* GCash Scan & Input Flow Inside Modal */
                <div className="space-y-4 pt-1">
                  <div className="p-4 bg-[#007DFE]/5 border border-[#007DFE]/20 rounded-2xl flex items-center gap-4">
                    {/* Simulated Static GCash QR Code Graphic */}
                    <div className="w-24 h-24 bg-white p-2 rounded-xl border border-[#007DFE]/30 shrink-0 flex items-center justify-center shadow-xs">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-[#007DFE]">
                        <rect width="100" height="100" fill="#FFFFFF" />
                        <rect x="10" y="10" width="30" height="30" fill="#007DFE" rx="3" />
                        <rect x="16" y="16" width="18" height="18" fill="#FFFFFF" rx="2" />
                        <rect x="20" y="20" width="10" height="10" fill="#007DFE" />
                        <rect x="60" y="10" width="30" height="30" fill="#007DFE" rx="3" />
                        <rect x="66" y="16" width="18" height="18" fill="#FFFFFF" rx="2" />
                        <rect x="70" y="20" width="10" height="10" fill="#007DFE" />
                        <rect x="10" y="60" width="30" height="30" fill="#007DFE" rx="3" />
                        <rect x="16" y="66" width="18" height="18" fill="#FFFFFF" rx="2" />
                        <rect x="20" y="70" width="10" height="10" fill="#007DFE" />
                        {/* Dynamic bits */}
                        <rect x="50" y="45" width="8" height="8" fill="#007DFE" />
                        <rect x="65" y="55" width="12" height="8" fill="#007DFE" />
                        <rect x="45" y="70" width="10" height="10" fill="#007DFE" />
                        <rect x="65" y="75" width="15" height="10" fill="#007DFE" />
                      </svg>
                    </div>

                    <div className="text-xs">
                      <span className="font-bold text-[#007DFE] block">Scan via GCash App</span>
                      <span className="text-[#3E2723] font-medium block mt-0.5">BBGL Campus Cafe</span>
                      <span className="font-mono text-sm font-bold text-[#3E2723] block mt-1 tabular-nums">
                        ₱{(studentVerified ? cartSubtotal * 0.9 : cartSubtotal).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* 13-Digit Reference Number Input */}
                  <div>
                    <label className="text-xs font-bold text-[#3E2723] block mb-1">
                      Enter 13-Digit GCash Reference Number
                    </label>
                    <input
                      type="text"
                      maxLength={13}
                      value={gcashRefInput}
                      onChange={(e) => {
                        setGcashRefInput(e.target.value.replace(/\D/g, ''));
                        setGcashError('');
                      }}
                      placeholder="e.g. 1002938475819"
                      className="w-full px-4 py-3 rounded-xl border border-[#3E2723]/20 bg-white font-mono text-center text-base tracking-widest text-[#3E2723] focus:outline-hidden focus:border-[#007DFE]"
                    />
                    {gcashError ? (
                      <span className="text-[11px] text-[#C62828] font-medium mt-1 block">{gcashError}</span>
                    ) : (
                      <span className="text-[10px] text-[#795548] mt-1 block">
                        Found in your GCash SMS or transaction receipt screenshot.
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setSelectedPaymentMethod(null)}
                      className="px-4 py-3 rounded-xl border border-[#3E2723]/20 text-xs font-semibold text-[#795548]"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitGcashRef}
                      className="flex-1 py-3 bg-[#007DFE] hover:bg-[#006bd8] text-white font-display text-sm font-bold rounded-xl shadow-md"
                    >
                      Submit & Verify Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN A4: SPLIT POST-PAYMENT COMPLETION SCREENS
         ======================================================== */}
      {/* A4-Cash: Large Holding Ticket */}
      {currentScreen === 'completed_cash' && completedOrder && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#FDFBF7] to-[#F3EDE2] text-center">
          <div className="w-full max-w-sm bg-white rounded-3xl border-2 border-[#3E2723]/20 shadow-2xl overflow-hidden p-6 text-[#3E2723] animate-in zoom-in-95">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#C68B59]/20 text-[#C68B59] flex items-center justify-center mb-3">
              <Banknote className="w-7 h-7" />
            </div>

            <span className="text-xs uppercase font-bold tracking-widest text-[#795548]">
              Cash Payment Required
            </span>
            <div className="font-display text-4xl font-black text-[#3E2723] mt-2 mb-1 tracking-tight">
              Ticket #{completedOrder.ticketNumber}
            </div>

            {/* Instruction Callout */}
            <div className="my-4 p-4 rounded-2xl bg-[#F3EDE2] border border-[#3E2723]/10 text-xs text-[#3E2723] leading-relaxed">
              <p className="font-bold mb-1">Please proceed to the cashier counter.</p>
              Tender your cash payment of{' '}
              <strong className="font-mono text-sm text-[#3E2723]">₱{completedOrder.netTotal.toFixed(2)}</strong> to claim your official Order Number and receive your drinks.
            </div>

            {/* Simulated Barcode */}
            <div className="my-4 py-2 border-y border-dashed border-[#3E2723]/20 flex flex-col items-center">
              <div className="h-10 w-48 bg-[repeating-linear-gradient(90deg,#3E2723,#3E2723_2px,transparent_2px,transparent_4px,#3E2723_4px,#3E2723_7px,transparent_7px,transparent_10px)]" />
              <span className="font-mono text-[10px] text-[#795548] mt-1 tracking-widest">
                {completedOrder.id}
              </span>
            </div>

            <div className="text-[11px] text-[#795548]">
              Items ({completedOrder.items.length}):{' '}
              {completedOrder.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
            </div>

            <button
              onClick={handleResetKiosk}
              className="mt-6 w-full py-3.5 bg-[#3E2723] hover:bg-[#2E1C18] text-[#FDFBF7] font-display text-sm font-bold rounded-xl shadow-md"
            >
              Done / Start New Order
            </button>
          </div>
        </div>
      )}

      {/* A4-GCash: Confirmed Order Screen */}
      {currentScreen === 'completed_gcash' && completedOrder && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#FDFBF7] to-[#F3EDE2] text-center">
          <div className="w-full max-w-sm bg-white rounded-3xl border-2 border-[#2E7D32]/30 shadow-2xl overflow-hidden p-6 text-[#3E2723] animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center mb-3">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <span className="text-xs uppercase font-bold tracking-widest text-[#2E7D32]">
              GCash Payment Submitted
            </span>
            <div className="font-display text-4xl font-black text-[#3E2723] mt-2 mb-1 tracking-tight">
              Order #{completedOrder.ticketNumber}
            </div>

            <div className="my-4 p-4 rounded-2xl bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-xs text-[#2E7D32] font-semibold leading-relaxed">
              Order Confirmed! Your Official Order Number is #{completedOrder.ticketNumber}. Watch the barista display screen.
            </div>

            <div className="text-left text-xs bg-[#FDFBF7] p-3 rounded-xl border border-[#3E2723]/10 space-y-1">
              <div className="flex justify-between text-[#795548]">
                <span>GCash Ref:</span>
                <span className="font-mono font-bold text-[#3E2723]">{completedOrder.gcashRefNumber}</span>
              </div>
              <div className="flex justify-between text-[#795548]">
                <span>Amount Paid:</span>
                <span className="font-mono font-bold text-[#3E2723]">₱{completedOrder.netTotal.toFixed(2)}</span>
              </div>
              {completedOrder.customerEmail && (
                <div className="flex justify-between text-[#795548]">
                  <span>Receipt Sent:</span>
                  <span className="truncate max-w-[150px]">{completedOrder.customerEmail}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleResetKiosk}
              className="mt-6 w-full py-3.5 bg-[#3E2723] hover:bg-[#2E1C18] text-[#FDFBF7] font-display text-sm font-bold rounded-xl shadow-md"
            >
              Order Another Drink
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STUDENT LOYALTY / E-RECEIPTS OTP MODAL
         ======================================================== */}
      {isLoyaltyModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#3E2723]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FDFBF7] rounded-3xl p-6 shadow-2xl border border-[#3E2723]/20 text-[#3E2723] animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <BbglLogo size={32} />
                <h3 className="font-display font-bold text-base">Campus Student Loyalty</h3>
              </div>
              <button
                onClick={() => setIsLoyaltyModalOpen(false)}
                className="p-1 text-[#795548] hover:text-[#3E2723]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!studentVerified ? (
              <div className="space-y-4">
                <p className="text-xs text-[#795548]">
                  Enter your mobile number or university email to access automatic 10% student discounts and collect Bear Stamps!
                </p>

                <div>
                  <label className="text-[11px] font-bold text-[#795548] block mb-1">
                    Phone / Student Email
                  </label>
                  <input
                    type="text"
                    value={studentContact}
                    onChange={(e) => setStudentContact(e.target.value)}
                    placeholder="0917XXXXXXX or student@dlsu.edu.ph"
                    className="w-full p-2.5 rounded-xl border border-[#3E2723]/20 bg-white text-xs text-[#3E2723]"
                  />
                </div>

                {!otpSent ? (
                  <button
                    onClick={() => {
                      if (studentContact) setOtpSent(true);
                    }}
                    className="w-full py-2.5 bg-[#3E2723] hover:bg-[#2E1C18] text-white font-display text-xs font-bold rounded-xl"
                  >
                    Send One-Time Passcode (OTP)
                  </button>
                ) : (
                  <div className="space-y-3 pt-1">
                    <div className="p-2.5 rounded-lg bg-[#C68B59]/10 text-[11px] text-[#C68B59] font-medium">
                      Demo OTP Code: <strong>8824</strong> sent to {studentContact}
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#795548] block mb-1">Enter 4-Digit Code</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="8824"
                        className="w-full p-2.5 rounded-xl border border-[#3E2723]/20 bg-white font-mono text-center tracking-widest text-sm"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setStudentVerified(true);
                      }}
                      className="w-full py-2.5 bg-[#2E7D32] text-white font-display text-xs font-bold rounded-xl"
                    >
                      Verify & Activate Student Perk
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-3 py-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-display font-bold text-sm text-[#3E2723]">Student Pass Verified!</h4>
                <div className="p-3 bg-[#F3EDE2] rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>Bear Stamp Card:</span>
                    <span className="font-bold text-[#C68B59]">7 / 10 Cups</span>
                  </div>
                  <div className="w-full bg-[#3E2723]/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#C68B59] h-full w-[70%]" />
                  </div>
                  <span className="text-[10px] text-[#795548] block">3 more cups until a free pastry voucher!</span>
                </div>
                <button
                  onClick={() => {
                    setIsLoyaltyModalOpen(false);
                    setCurrentScreen('menu');
                  }}
                  className="w-full py-2.5 bg-[#3E2723] text-white font-display text-xs font-bold rounded-xl"
                >
                  Proceed to Menu with 10% Discount
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
