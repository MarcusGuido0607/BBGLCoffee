import React, { useState } from 'react';
import { Order, Product, CartItem, OrderStatus } from '../../types';
import { MENU_PRODUCTS, COMMON_ADDONS } from '../../data/mockData';
import { BbglLogo } from '../brand/BbglLogo';
import { ProductArt } from '../brand/ProductArt';
import { 
  Banknote, 
  QrCode, 
  CheckCircle2, 
  Printer, 
  Trash2, 
  Plus, 
  Minus, 
  Search, 
  Percent, 
  Clock, 
  Send, 
  UserCheck, 
  Mail, 
  Coffee, 
  Sparkles, 
  UtensilsCrossed, 
  AlertCircle,
  FileText,
  X
} from 'lucide-react';

interface CashierPosProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, extraData?: Partial<Order>) => void;
  onAddNewPosOrder: (order: Order) => void;
}

export const CashierPos: React.FC<CashierPosProps> = ({
  orders,
  onUpdateOrderStatus,
  onAddNewPosOrder,
}) => {
  const [activeQueueTab, setActiveQueueTab] = useState<'pending_cash' | 'gcash_verification' | 'kitchen_queue'>('pending_cash');
  const [selectedQueueOrderId, setSelectedQueueOrderId] = useState<string | null>(null);

  // Counter Walk-in Cart State
  const [activeCartItems, setActiveCartItems] = useState<CartItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'coffee' | 'milktea' | 'pastries_meals'>('all');

  // Tender & Discount State
  const [discountType, setDiscountType] = useState<'student' | 'pwd_senior' | 'custom' | null>(null);
  const [customDiscountAmount, setCustomDiscountAmount] = useState<number>(0);
  const [studentIdVerification, setStudentIdVerification] = useState<string>('');
  const [cashReceivedInput, setCashReceivedInput] = useState<string>('');
  const [emailReceiptToggle, setEmailReceiptToggle] = useState<boolean>(true);
  const [customerEmailInput, setCustomerEmailInput] = useState<string>('');
  const [showReceiptModal, setShowReceiptModal] = useState<Order | null>(null);

  // Queue subsets
  const pendingCashOrders = orders.filter((o) => o.status === 'pending_cash');
  const gcashVerifyOrders = orders.filter((o) => o.status === 'gcash_verification');
  const kitchenOrders = orders.filter((o) => ['kitchen_queue', 'preparing', 'ready'].includes(o.status));

  // Determine current active order (either loaded from queue or walk-in)
  const loadedQueueOrder = orders.find((o) => o.id === selectedQueueOrderId) || null;

  // Items to tender: if a queue order is selected, tender that; otherwise tender the counter cart
  const activeItemsToTender = loadedQueueOrder ? loadedQueueOrder.items : activeCartItems;
  const rawSubtotal = activeItemsToTender.reduce((acc, item) => acc + item.totalPrice, 0);

  // Calculate discount according to Non-Negative Floor Rule
  let calculatedDiscount = 0;
  if (loadedQueueOrder && loadedQueueOrder.discountAmount > 0) {
    calculatedDiscount = loadedQueueOrder.discountAmount;
  } else if (discountType === 'student') {
    calculatedDiscount = Math.round(rawSubtotal * 0.2); // 20% Student
  } else if (discountType === 'pwd_senior') {
    calculatedDiscount = Math.round(rawSubtotal * 0.2); // 20% Senior/PWD
  } else if (discountType === 'custom') {
    calculatedDiscount = customDiscountAmount;
  }

  // Non-Negative Floor Rule: Subtotal - Discount can NEVER drop below ₱0.00
  const effectiveDiscount = Math.min(rawSubtotal, Math.max(0, calculatedDiscount));
  const netPayable = Math.max(0, rawSubtotal - effectiveDiscount);

  // Cash change due calculation
  const cashReceivedNum = parseFloat(cashReceivedInput) || 0;
  const changeDue = cashReceivedNum >= netPayable ? cashReceivedNum - netPayable : 0;
  const isExactOrSufficient = cashReceivedNum >= netPayable && netPayable > 0;

  // Add Walk-in Product to POS Register Cart
  const handleAddWalkinItem = (product: Product) => {
    // If a queue order was selected, clear it to start new walk-in or edit
    if (loadedQueueOrder) {
      setSelectedQueueOrderId(null);
    }

    const existingIndex = activeCartItems.findIndex(
      (item) => item.product.id === product.id && item.customization.size === 'tall'
    );

    if (existingIndex > -1) {
      setActiveCartItems((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1, totalPrice: item.unitPrice * (item.quantity + 1) }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        cartItemId: `pos_item_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        product,
        customization: {
          size: 'tall',
          sizePriceDelta: 0,
          temperature: product.allowTemperature ? 'iced' : 'hot',
          sugarLevel: '100%',
          selectedAddons: [],
          specialInstructions: '',
        },
        quantity: 1,
        unitPrice: product.basePrice,
        totalPrice: product.basePrice,
      };
      setActiveCartItems((prev) => [...prev, newItem]);
    }
  };

  const handleUpdateItemQty = (cartItemId: string, delta: number) => {
    setActiveCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            return {
              ...item,
              quantity: nextQty,
              totalPrice: item.unitPrice * nextQty,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Select Ticket from Queue
  const handleSelectQueueTicket = (order: Order) => {
    setSelectedQueueOrderId(order.id);
    setDiscountType(order.discountType || null);
    setStudentIdVerification(order.discountCustomerRef || '');
    setCustomerEmailInput(order.customerEmail || '');
    setCashReceivedInput('');
  };

  // Settle Cash Order (Generates official Order Number #B-XXX & sends to Kitchen Queue)
  const handleSettleCashOrder = () => {
    if (!isExactOrSufficient && netPayable > 0) return;

    const officialSeq = Math.floor(Math.random() * 90) + 105;
    const officialOrderNum = `B-${officialSeq}`;

    if (loadedQueueOrder) {
      // Update existing Kiosk Cash Ticket
      const updatedData: Partial<Order> = {
        ticketNumber: officialOrderNum,
        status: 'kitchen_queue',
        discountType,
        discountAmount: effectiveDiscount,
        discountCustomerRef: studentIdVerification.trim() || undefined,
        netTotal: netPayable,
        cashReceived: cashReceivedNum,
        changeDue,
        customerEmail: customerEmailInput.trim() || loadedQueueOrder.customerEmail,
      };
      onUpdateOrderStatus(loadedQueueOrder.id, 'kitchen_queue', updatedData);

      setShowReceiptModal({
        ...loadedQueueOrder,
        ...updatedData,
      } as Order);
      setSelectedQueueOrderId(null);
    } else {
      // Create Brand New POS Counter Order
      const newOrder: Order = {
        id: `pos_ord_${Date.now()}`,
        ticketNumber: officialOrderNum,
        orderType: 'pos_walkin',
        status: 'kitchen_queue',
        items: [...activeCartItems],
        subtotal: rawSubtotal,
        discountType,
        discountAmount: effectiveDiscount,
        discountCustomerRef: studentIdVerification.trim() || undefined,
        netTotal: netPayable,
        paymentMethod: 'cash',
        cashReceived: cashReceivedNum,
        changeDue,
        customerEmail: customerEmailInput.trim() || undefined,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        placedVia: 'POS Counter',
      };
      onAddNewPosOrder(newOrder);
      setShowReceiptModal(newOrder);
      setActiveCartItems([]);
    }

    // Reset tender inputs
    setCashReceivedInput('');
    setDiscountType(null);
    setStudentIdVerification('');
  };

  // Verify GCash Reference & Send to Barista
  const handleVerifyGcashPayment = (order: Order) => {
    onUpdateOrderStatus(order.id, 'kitchen_queue', {
      customerEmail: customerEmailInput.trim() || order.customerEmail,
    });
    setSelectedQueueOrderId(null);
  };

  // Quick Tender Presets (e.g. ₱100, ₱200, ₱500, ₱1,000, Exact)
  const setExactTender = () => setCashReceivedInput(netPayable.toString());
  const setQuickBill = (amount: number) => setCashReceivedInput(amount.toString());

  return (
    <div className="w-full h-full min-h-[720px] bg-[#F3EDE2] text-[#3E2723] flex flex-col font-sans select-none overflow-hidden">
      {/* POS Top Register Bar */}
      <header className="px-6 py-3 bg-[#3E2723] text-[#FDFBF7] flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <BbglLogo size={36} monochrome={false} />
          <div>
            <h1 className="font-display font-bold text-base leading-none">BBGL Coffee POS Register</h1>
            <span className="text-[11px] text-[#C68B59] font-medium">Terminal #01 · Campus Main Counter · Cashier: Bea Alonzo</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-[#2E1C18] px-3 py-1.5 rounded-lg border border-[#C68B59]/20">
            <Clock className="w-3.5 h-3.5 text-[#C68B59]" />
            <span className="font-mono text-[#FDFBF7] tabular-nums">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#2E7D32] bg-[#2E7D32]/20 border border-[#2E7D32]/30 px-2.5 py-1 rounded-md font-semibold text-[11px]">
            <CheckCircle2 className="w-3 h-3" />
            <span>POS System Online</span>
          </div>
        </div>
      </header>

      {/* Main Split Layout: Left Queue vs Right Register Tender */}
      <div className="flex-1 flex overflow-hidden">
        {/* ========================================================
            SCREEN B1: LEFT PANEL - INCOMING ORDERS QUEUE
           ======================================================== */}
        <div className="w-80 lg:w-96 bg-[#FDFBF7] border-r border-[#3E2723]/15 flex flex-col shrink-0">
          {/* Queue Filter Tabs with Real-Time Badges */}
          <div className="p-3 bg-[#F3EDE2]/60 border-b border-[#3E2723]/10 grid grid-cols-3 gap-1 shrink-0">
            <button
              onClick={() => setActiveQueueTab('pending_cash')}
              className={`p-2 rounded-lg text-center transition-all ${
                activeQueueTab === 'pending_cash'
                  ? 'bg-[#3E2723] text-white shadow-xs font-bold'
                  : 'bg-white text-[#795548] hover:bg-[#F3EDE2] text-xs'
              }`}
            >
              <span className="block text-[11px]">Pending Cash</span>
              <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-[#C68B59] text-white text-[10px] font-mono rounded-full tabular-nums">
                {pendingCashOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveQueueTab('gcash_verification')}
              className={`p-2 rounded-lg text-center transition-all ${
                activeQueueTab === 'gcash_verification'
                  ? 'bg-[#007DFE] text-white shadow-xs font-bold'
                  : 'bg-white text-[#795548] hover:bg-[#F3EDE2] text-xs'
              }`}
            >
              <span className="block text-[11px]">GCash Verify</span>
              <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-[#007DFE] text-white text-[10px] font-mono rounded-full tabular-nums">
                {gcashVerifyOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveQueueTab('kitchen_queue')}
              className={`p-2 rounded-lg text-center transition-all ${
                activeQueueTab === 'kitchen_queue'
                  ? 'bg-[#2E7D32] text-white shadow-xs font-bold'
                  : 'bg-white text-[#795548] hover:bg-[#F3EDE2] text-xs'
              }`}
            >
              <span className="block text-[11px]">Kitchen</span>
              <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-[#2E7D32] text-white text-[10px] font-mono rounded-full tabular-nums">
                {kitchenOrders.length}
              </span>
            </button>
          </div>

          {/* Queue List Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {activeQueueTab === 'pending_cash' && (
              <>
                <div className="flex items-center justify-between text-[11px] text-[#795548] px-1">
                  <span>Awaiting Cash at Counter</span>
                  <span className="font-mono">{pendingCashOrders.length} tickets</span>
                </div>
                {pendingCashOrders.length === 0 ? (
                  <div className="p-8 text-center text-[#795548] text-xs">
                    No pending cash tickets from kiosks.
                  </div>
                ) : (
                  pendingCashOrders.map((order) => {
                    const isSelected = selectedQueueOrderId === order.id;
                    return (
                      <div
                        key={order.id}
                        onClick={() => handleSelectQueueTicket(order)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-md'
                            : 'bg-white text-[#3E2723] border-[#3E2723]/15 hover:border-[#C68B59] hover:bg-[#FDFBF7]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-display font-bold text-sm ${isSelected ? 'text-[#C68B59]' : 'text-[#3E2723]'}`}>
                            Ticket #{order.ticketNumber}
                          </span>
                          <span className="font-mono text-xs font-bold tabular-nums">
                            ₱{order.netTotal.toFixed(2)}
                          </span>
                        </div>
                        <div className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-[#FDFBF7]/80' : 'text-[#795548]'}`}>
                          {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-current/10 text-[10px] opacity-80">
                          <span>Kiosk · {order.createdAt}</span>
                          <span className="font-semibold underline">Click to Tender</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {activeQueueTab === 'gcash_verification' && (
              <>
                <div className="flex items-center justify-between text-[11px] text-[#795548] px-1">
                  <span>Customer Submitted GCash</span>
                  <span className="font-mono">{gcashVerifyOrders.length} pending</span>
                </div>
                {gcashVerifyOrders.length === 0 ? (
                  <div className="p-8 text-center text-[#795548] text-xs">
                    No GCash payments awaiting verification.
                  </div>
                ) : (
                  gcashVerifyOrders.map((order) => {
                    const isSelected = selectedQueueOrderId === order.id;
                    return (
                      <div
                        key={order.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-[#007DFE]/10 border-[#007DFE]'
                            : 'bg-white border-[#007DFE]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-sm text-[#007DFE]">
                            Order #{order.ticketNumber}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#3E2723] tabular-nums">
                            ₱{order.netTotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-2 p-2 rounded-lg bg-[#007DFE]/5 border border-[#007DFE]/10 text-xs">
                          <span className="text-[10px] text-[#795548] block">Submitted GCash Reference:</span>
                          <span className="font-mono font-bold text-sm tracking-wider text-[#007DFE] block">
                            {order.gcashRefNumber || 'Missing Ref'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#795548] mt-2 line-clamp-1">
                          {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                        </div>
                        <button
                          onClick={() => handleVerifyGcashPayment(order)}
                          className="mt-2 w-full py-2 bg-[#007DFE] hover:bg-[#006bd8] text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify & Send to Barista</span>
                        </button>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {activeQueueTab === 'kitchen_queue' && (
              <>
                <div className="flex items-center justify-between text-[11px] text-[#795548] px-1">
                  <span>Barista & Kitchen Orders</span>
                  <span className="font-mono">{kitchenOrders.length} active</span>
                </div>
                {kitchenOrders.length === 0 ? (
                  <div className="p-8 text-center text-[#795548] text-xs">
                    Kitchen queue is currently clear!
                  </div>
                ) : (
                  kitchenOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-3 rounded-xl bg-white border border-[#2E7D32]/20 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-sm text-[#2E7D32]">
                          Order #{order.ticketNumber}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#2E7D32]/10 text-[#2E7D32]">
                          {order.status === 'kitchen_queue' ? 'In Queue' : order.status === 'preparing' ? 'Brewing' : 'Ready'}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-[#3E2723]">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between border-b border-[#3E2723]/5 pb-0.5">
                            <span>
                              <strong>{item.quantity}x</strong> {item.product.name}
                            </span>
                            <span className="text-[10px] text-[#795548]">{item.customization.size}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-[#795548]">{order.createdAt}</span>
                        <div className="flex gap-1.5">
                          {order.status === 'kitchen_queue' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                              className="px-2.5 py-1 bg-[#C68B59] text-white text-[10px] font-bold rounded-md"
                            >
                              Start Brewing
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                              className="px-2.5 py-1 bg-[#2E7D32] text-white text-[10px] font-bold rounded-md"
                            >
                              Mark Ready
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                              className="px-2.5 py-1 bg-[#3E2723] text-white text-[10px] font-bold rounded-md"
                            >
                              Hand Off / Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>

        {/* ========================================================
            SCREEN B1 (RIGHT) + SCREEN B2: REGISTER & TENDER DRAWER
           ======================================================== */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Fast Item Entry Grid (Center Area) */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#F3EDE2]/40 border-r border-[#3E2723]/10">
            {/* Category Filter Pills for Register */}
            <div className="p-3 bg-[#FDFBF7] border-b border-[#3E2723]/10 flex items-center gap-2 overflow-x-auto shrink-0">
              <span className="text-xs font-bold text-[#795548] uppercase tracking-wider mr-2">Quick Add:</span>
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  categoryFilter === 'all' ? 'bg-[#3E2723] text-white' : 'bg-[#F3EDE2] text-[#3E2723]'
                }`}
              >
                All (8)
              </button>
              <button
                onClick={() => setCategoryFilter('coffee')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  categoryFilter === 'coffee' ? 'bg-[#3E2723] text-white' : 'bg-[#F3EDE2] text-[#3E2723]'
                }`}
              >
                Coffee
              </button>
              <button
                onClick={() => setCategoryFilter('milktea')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  categoryFilter === 'milktea' ? 'bg-[#3E2723] text-white' : 'bg-[#F3EDE2] text-[#3E2723]'
                }`}
              >
                Milk Tea
              </button>
              <button
                onClick={() => setCategoryFilter('pastries_meals')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  categoryFilter === 'pastries_meals' ? 'bg-[#3E2723] text-white' : 'bg-[#F3EDE2] text-[#3E2723]'
                }`}
              >
                Meals & Pastries
              </button>
            </div>

            {/* Fast Touch Keypad of Menu Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {MENU_PRODUCTS.filter((p) => categoryFilter === 'all' || p.category === categoryFilter).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddWalkinItem(product)}
                    className="p-3 bg-white rounded-xl border border-[#3E2723]/15 shadow-2xs hover:shadow-sm hover:border-[#C68B59] active:scale-98 text-left flex flex-col justify-between transition-all group"
                  >
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-[#F3EDE2]">
                      <ProductArt artKey={product.imageArtKey} name={product.name} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs text-[#3E2723] line-clamp-1 group-hover:text-[#C68B59]">
                        {product.name}
                      </h4>
                      <span className="font-mono text-xs font-bold text-[#795548] tabular-nums block mt-0.5">
                        ₱{product.basePrice.toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SCREEN B2: TENDER & PAYMENT VERIFICATION DRAWER (Right Area) */}
          <div className="w-full lg:w-96 bg-[#FDFBF7] flex flex-col overflow-y-auto p-4 border-l border-[#3E2723]/10">
            {/* Header of Active Order */}
            <div className="flex items-center justify-between pb-3 border-b border-[#3E2723]/10 shrink-0">
              <div>
                <span className="text-[11px] font-bold text-[#795548] uppercase tracking-wider block">
                  {loadedQueueOrder ? `Tendering Ticket #${loadedQueueOrder.ticketNumber}` : 'Counter Walk-In Order'}
                </span>
                <h3 className="font-display font-bold text-base text-[#3E2723]">Active Order Register</h3>
              </div>
              {(loadedQueueOrder || activeCartItems.length > 0) && (
                <button
                  onClick={() => {
                    setSelectedQueueOrderId(null);
                    setActiveCartItems([]);
                    setDiscountType(null);
                    setCashReceivedInput('');
                  }}
                  className="p-1.5 text-[#C62828] hover:bg-[#C62828]/10 rounded-lg text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Line Items List */}
            <div className="py-3 space-y-2 border-b border-[#3E2723]/10 max-h-48 overflow-y-auto">
              {activeItemsToTender.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#795548]">
                  Select a ticket from the left queue or click items to ring up walk-in.
                </div>
              ) : (
                activeItemsToTender.map((item) => (
                  <div key={item.cartItemId} className="flex items-center justify-between text-xs">
                    <div className="flex-1 pr-2">
                      <div className="font-bold text-[#3E2723]">{item.product.name}</div>
                      <div className="text-[10px] text-[#795548]">
                        {item.customization.size} · {item.customization.sugarLevel || '100%'}
                      </div>
                    </div>
                    {!loadedQueueOrder && (
                      <div className="flex items-center gap-1.5 mr-2">
                        <button
                          onClick={() => handleUpdateItemQty(item.cartItemId, -1)}
                          className="w-5 h-5 rounded bg-[#F3EDE2] text-[#3E2723] flex items-center justify-center"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-mono text-xs tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateItemQty(item.cartItemId, 1)}
                          className="w-5 h-5 rounded bg-[#F3EDE2] text-[#3E2723] flex items-center justify-center"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                    <span className="font-mono font-bold text-[#3E2723] tabular-nums">
                      ₱{item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* DISCOUNT MODULE (Preset buttons, Customer Verification & Non-Negative Floor Rule) */}
            <div className="py-3 border-b border-[#3E2723]/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#795548] uppercase tracking-wider flex items-center gap-1">
                  <Percent className="w-3 h-3 text-[#C68B59]" />
                  <span>Discount Module</span>
                </span>
                {effectiveDiscount > 0 && (
                  <span className="text-[11px] font-mono font-bold text-[#2E7D32] tabular-nums">
                    -₱{effectiveDiscount.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Preset Discount Buttons */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setDiscountType(discountType === 'student' ? null : 'student')}
                  className={`p-2 rounded-lg border text-center text-xs font-bold transition-all ${
                    discountType === 'student'
                      ? 'bg-[#3E2723] text-white border-[#3E2723]'
                      : 'bg-white text-[#3E2723] border-[#3E2723]/20 hover:bg-[#F3EDE2]'
                  }`}
                >
                  Student (20%)
                </button>
                <button
                  onClick={() => setDiscountType(discountType === 'pwd_senior' ? null : 'pwd_senior')}
                  className={`p-2 rounded-lg border text-center text-xs font-bold transition-all ${
                    discountType === 'pwd_senior'
                      ? 'bg-[#3E2723] text-white border-[#3E2723]'
                      : 'bg-white text-[#3E2723] border-[#3E2723]/20 hover:bg-[#F3EDE2]'
                  }`}
                >
                  Senior/PWD (20%)
                </button>
                <button
                  onClick={() => setDiscountType(discountType === 'custom' ? null : 'custom')}
                  className={`p-2 rounded-lg border text-center text-xs font-bold transition-all ${
                    discountType === 'custom'
                      ? 'bg-[#3E2723] text-white border-[#3E2723]'
                      : 'bg-white text-[#3E2723] border-[#3E2723]/20 hover:bg-[#F3EDE2]'
                  }`}
                >
                  Custom (₱)
                </button>
              </div>

              {/* Custom discount amount input */}
              {discountType === 'custom' && (
                <div className="pt-1">
                  <input
                    type="number"
                    min={0}
                    max={rawSubtotal}
                    value={customDiscountAmount || ''}
                    onChange={(e) => setCustomDiscountAmount(parseFloat(e.target.value) || 0)}
                    placeholder="Enter discount in ₱"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#3E2723]/20 bg-white text-xs font-mono"
                  />
                </div>
              )}

              {/* Customer ID Verification Search Bar */}
              <div className="relative pt-1">
                <Search className="w-3.5 h-3.5 text-[#795548] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentIdVerification}
                  onChange={(e) => setStudentIdVerification(e.target.value)}
                  placeholder="Student ID / Senior Card # (e.g. DLSU-2024-0982)"
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#3E2723]/20 bg-white text-xs text-[#3E2723] placeholder-[#795548]/50"
                />
              </div>

              {/* Non-Negative Floor Rule Indicator */}
              <div className="text-[10px] text-[#795548] flex items-center justify-between pt-0.5">
                <span>Non-Negative Floor Rule:</span>
                <span className="font-semibold text-[#2E7D32]">Subtotal - Disc ≥ ₱0.00 (Protected)</span>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="py-3 border-b border-[#3E2723]/10 space-y-1 text-xs">
              <div className="flex justify-between text-[#795548]">
                <span>Gross Subtotal</span>
                <span className="font-mono tabular-nums">₱{rawSubtotal.toFixed(2)}</span>
              </div>
              {effectiveDiscount > 0 && (
                <div className="flex justify-between text-[#2E7D32] font-semibold">
                  <span>Applied Discount</span>
                  <span className="font-mono tabular-nums">-₱{effectiveDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-[#3E2723] pt-1 border-t border-[#3E2723]/10">
                <span>Net Total Payable</span>
                <span className="font-mono tabular-nums">₱{netPayable.toFixed(2)}</span>
              </div>
            </div>

            {/* CASH TENDER MODULE (Cash Received, Change Due & Quick Bill Buttons) */}
            <div className="py-3 space-y-3">
              <label className="text-xs font-bold text-[#795548] uppercase tracking-wider block">
                Cash Tender Settlement
              </label>

              {/* Quick Bill Preset Chips */}
              <div className="grid grid-cols-5 gap-1">
                <button
                  onClick={setExactTender}
                  className="p-1.5 rounded-md bg-[#F3EDE2] hover:bg-[#E9DEC8] text-[#3E2723] font-bold text-[10px] text-center"
                >
                  Exact
                </button>
                <button
                  onClick={() => setQuickBill(100)}
                  className="p-1.5 rounded-md bg-[#F3EDE2] hover:bg-[#E9DEC8] text-[#3E2723] font-mono text-[10px] text-center font-bold"
                >
                  ₱100
                </button>
                <button
                  onClick={() => setQuickBill(200)}
                  className="p-1.5 rounded-md bg-[#F3EDE2] hover:bg-[#E9DEC8] text-[#3E2723] font-mono text-[10px] text-center font-bold"
                >
                  ₱200
                </button>
                <button
                  onClick={() => setQuickBill(500)}
                  className="p-1.5 rounded-md bg-[#F3EDE2] hover:bg-[#E9DEC8] text-[#3E2723] font-mono text-[10px] text-center font-bold"
                >
                  ₱500
                </button>
                <button
                  onClick={() => setQuickBill(1000)}
                  className="p-1.5 rounded-md bg-[#F3EDE2] hover:bg-[#E9DEC8] text-[#3E2723] font-mono text-[10px] text-center font-bold"
                >
                  ₱1,000
                </button>
              </div>

              {/* Input for Cash Received */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-[#795548]">
                  ₱
                </span>
                <input
                  type="number"
                  value={cashReceivedInput}
                  onChange={(e) => setCashReceivedInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#3E2723]/20 bg-white font-mono text-base font-bold text-[#3E2723] focus:outline-hidden focus:border-[#C68B59]"
                />
              </div>

              {/* Change Due Callout */}
              <div className="p-3 rounded-xl bg-[#F3EDE2] border border-[#3E2723]/10 flex items-center justify-between">
                <span className="text-xs font-bold text-[#795548]">Change Due:</span>
                <span className="font-mono text-lg font-black text-[#2E7D32] tabular-nums">
                  ₱{changeDue.toFixed(2)}
                </span>
              </div>

              {/* Receipt Email Toggle Switch */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[#795548] flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailReceiptToggle}
                      onChange={(e) => setEmailReceiptToggle(e.target.checked)}
                      className="rounded text-[#3E2723] focus:ring-[#C68B59]"
                    />
                    <span>Email Receipt to Customer</span>
                  </label>
                </div>
                {emailReceiptToggle && (
                  <input
                    type="email"
                    value={customerEmailInput}
                    onChange={(e) => setCustomerEmailInput(e.target.value)}
                    placeholder="customer@university.edu.ph"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#3E2723]/20 bg-white text-xs text-[#3E2723]"
                  />
                )}
              </div>

              {/* Big Settle Cash CTA */}
              <button
                disabled={activeItemsToTender.length === 0 || !isExactOrSufficient}
                onClick={handleSettleCashOrder}
                className={`w-full py-4 rounded-xl font-display text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all ${
                  activeItemsToTender.length > 0 && isExactOrSufficient
                    ? 'bg-[#2E7D32] hover:bg-[#256629] text-white active:scale-98'
                    : 'bg-[#3E2723]/20 text-[#3E2723]/40 cursor-not-allowed'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span>Tender Cash & Issue Order #</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          THERMAL RECEIPT PRINT PREVIEW MODAL
         ======================================================== */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-[#3E2723]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden p-6 text-[#3E2723] font-mono text-xs animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-[#795548]">OFFICIAL RECEIPT</span>
              <button onClick={() => setShowReceiptModal(null)} className="p-1 text-[#795548] hover:text-[#3E2723]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pb-4 border-b border-dashed border-[#3E2723]/30">
              <BbglLogo size={48} className="mx-auto mb-1" />
              <h2 className="font-display font-black text-sm uppercase text-[#3E2723]">BBGL Coffee</h2>
              <p className="text-[10px] text-[#795548]">Campus Student Center, Level 1</p>
              <p className="text-[10px] text-[#795548]">TIN: 420-160-015-000</p>
              <div className="mt-2 text-sm font-bold bg-[#F3EDE2] py-1 rounded">
                ORDER #{showReceiptModal.ticketNumber}
              </div>
            </div>

            <div className="py-3 border-b border-dashed border-[#3E2723]/30 space-y-1.5">
              <div className="text-[10px] text-[#795548] flex justify-between">
                <span>Date: {showReceiptModal.createdAt}</span>
                <span>Type: {showReceiptModal.orderType}</span>
              </div>
              {showReceiptModal.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{i.quantity}x {i.product.name}</span>
                  <span className="tabular-nums">₱{i.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="py-3 border-b border-dashed border-[#3E2723]/30 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="tabular-nums">₱{showReceiptModal.subtotal.toFixed(2)}</span>
              </div>
              {showReceiptModal.discountAmount > 0 && (
                <div className="flex justify-between text-[#2E7D32]">
                  <span>Discount ({showReceiptModal.discountType}):</span>
                  <span className="tabular-nums">-₱{showReceiptModal.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm pt-1">
                <span>NET TOTAL:</span>
                <span className="tabular-nums">₱{showReceiptModal.netTotal.toFixed(2)}</span>
              </div>
              {showReceiptModal.cashReceived && (
                <>
                  <div className="flex justify-between text-[11px] pt-1">
                    <span>Cash Tendered:</span>
                    <span className="tabular-nums">₱{showReceiptModal.cashReceived.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Change Due:</span>
                    <span className="tabular-nums">₱{(showReceiptModal.changeDue || 0).toFixed(2)}</span>
                  </div>
                </>
              )}
              {showReceiptModal.gcashRefNumber && (
                <div className="flex justify-between text-[11px]">
                  <span>GCash Ref:</span>
                  <span>{showReceiptModal.gcashRefNumber}</span>
                </div>
              )}
            </div>

            <div className="pt-4 text-center space-y-2">
              <p className="text-[10px] text-[#795548]">Thank you for supporting BBGL Coffee! Present this ticket when claiming.</p>
              {showReceiptModal.customerEmail && (
                <div className="text-[10px] text-[#2E7D32]">
                  ✓ E-receipt queued for {showReceiptModal.customerEmail}
                </div>
              )}
              <button
                onClick={() => setShowReceiptModal(null)}
                className="w-full py-2.5 bg-[#3E2723] text-white font-display text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Simulate Print & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
