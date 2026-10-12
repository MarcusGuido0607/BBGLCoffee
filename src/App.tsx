import React, { useState } from 'react';
import { 
  SurfaceType, 
  Order, 
  InventoryItem, 
  StaffMember, 
  AuditLogItem, 
  OrderStatus 
} from './types';
import { 
  INITIAL_ORDERS, 
  INITIAL_INVENTORY, 
  INITIAL_STAFF, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { CustomerKiosk } from './components/kiosk/CustomerKiosk';
import { CashierPos } from './components/pos/CashierPos';
import { AdminHub } from './components/admin/AdminHub';
import { DesignTokensSpec } from './components/design-system/DesignTokensSpec';
import { BbglLogo } from './components/brand/BbglLogo';
import { ImageManagerModal } from './components/media/ImageManagerModal';
import { useImageAssets } from './context/ImageAssetsContext';
import { 
  Tablet, 
  Monitor, 
  Sliders, 
  RefreshCw, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  Bell,
  CheckCircle2,
  Coffee,
  Camera
} from 'lucide-react';

export default function App() {
  const [activeSurface, setActiveSurface] = useState<SurfaceType>('kiosk');
  const [useDeviceFrame, setUseDeviceFrame] = useState<boolean>(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const { activePhotoCount } = useImageAssets();

  // Global Synchronized State
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Sync Notification Banner
  const [syncNotification, setSyncNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSyncNotification(msg);
    setTimeout(() => {
      setSyncNotification(null);
    }, 4000);
  };

  // Kiosk Creates Order Handler
  const handleOrderCreatedFromKiosk = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Add Audit Log
    const logItem: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: 'Just now',
      event: newOrder.paymentMethod === 'cash' ? 'Kiosk Cash Ticket Created' : 'Kiosk GCash Submitted',
      user: 'Customer Kiosk #01',
      details: `Ticket #${newOrder.ticketNumber} created for ₱${newOrder.netTotal.toFixed(2)} (${newOrder.items.length} items).`,
      flaggedReview: false,
      severity: 'info',
    };
    setAuditLogs((prev) => [logItem, ...prev]);

    showNotification(
      `🔔 Kiosk placed Order #${newOrder.ticketNumber}! Synced to POS ${
        newOrder.paymentMethod === 'cash' ? 'Pending Cash' : 'GCash Verification'
      } queue.`
    );
  };

  // POS Updates Order Status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, extraData?: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updated = {
            ...order,
            status: newStatus,
            ...(extraData || {}),
          };

          // If moved to kitchen, deplete inventory
          if (newStatus === 'kitchen_queue' && order.status !== 'kitchen_queue') {
            depleteInventoryForOrder(order);
          }

          return updated;
        }
        return order;
      })
    );

    showNotification(`⚡ Order updated to "${newStatus.replace('_', ' ')}". Admin metrics recalculated.`);
  };

  // POS Adds New Walk-in Order
  const handleAddNewPosOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    depleteInventoryForOrder(newOrder);

    const logItem: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: 'Just now',
      event: 'Walk-In Order Tendered',
      user: 'Bea Alonzo (Cashier)',
      details: `Order #${newOrder.ticketNumber} tendered at counter (Total: ₱${newOrder.netTotal.toFixed(2)}).`,
      flaggedReview: false,
      severity: 'info',
    };
    setAuditLogs((prev) => [logItem, ...prev]);

    showNotification(`☕ Walk-in Order #${newOrder.ticketNumber} sent to kitchen queue!`);
  };

  // Recipe Inventory Depletion Simulation
  const depleteInventoryForOrder = (order: Order) => {
    setInventory((prev) =>
      prev.map((inv) => {
        let deduction = 0;
        order.items.forEach((item) => {
          if (inv.id === 'inv_1' && item.product.isDrink) deduction += 0.02 * item.quantity; // 20g beans
          if (inv.id === 'inv_5' && item.product.isDrink) deduction += 0.2 * item.quantity; // 200ml milk
          if (inv.id === 'inv_2' && item.customization.selectedAddons.some((a) => a.id === 'addon_pearls')) {
            deduction += 0.05 * item.quantity; // 50g boba
          }
          if (inv.id === 'inv_6' && item.product.id === 'prod_bbgl_spaghetti') deduction += 0.15 * item.quantity;
          if (inv.id === 'inv_7' && item.product.id === 'prod_bbgl_spaghetti') deduction += 0.08 * item.quantity;
        });

        if (deduction > 0) {
          return {
            ...inv,
            currentStock: Math.max(0, inv.currentStock - deduction),
          };
        }
        return inv;
      })
    );
  };

  // Reset Demo State
  const handleResetData = () => {
    setOrders(INITIAL_ORDERS);
    setInventory(INITIAL_INVENTORY);
    setStaff(INITIAL_STAFF);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    showNotification('System demo data reset to default campus morning state.');
  };

  return (
    <div className="min-h-screen bg-[#2E1C18] text-[#FDFBF7] flex flex-col font-sans selection:bg-[#C68B59] selection:text-white">
      {/* ========================================================
          TOP GLOBAL CONTROL BAR (SURFACE SWITCHER & VIEWPORT)
         ======================================================== */}
      <nav className="bg-[#1F1310] border-b border-[#3E2723] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-50">
        {/* Brand Wordmark & Tag */}
        <div className="flex items-center gap-2.5">
          <BbglLogo size={28} />
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm tracking-tight text-white">
              BBGL Coffee
            </span>
            <span className="text-[10px] bg-[#C68B59]/20 text-[#C68B59] font-mono px-2 py-0.5 rounded-full font-bold">
              Omni-Channel Suite
            </span>
          </div>
        </div>

        {/* Surface Switcher Buttons */}
        <div className="flex items-center gap-1 bg-[#2E1C18] p-1 rounded-xl border border-[#3E2723]">
          <button
            onClick={() => setActiveSurface('kiosk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSurface === 'kiosk'
                ? 'bg-[#C68B59] text-white shadow-xs font-bold'
                : 'text-[#D7CCC8] hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Surface A: Customer Kiosk (Portrait)</span>
          </button>

          <button
            onClick={() => setActiveSurface('pos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSurface === 'pos'
                ? 'bg-[#C68B59] text-white shadow-xs font-bold'
                : 'text-[#D7CCC8] hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5 rotate-90" />
            <span>Surface B: Cashier POS (Landscape)</span>
            {orders.filter((o) => o.status === 'pending_cash' || o.status === 'gcash_verification').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#C62828] animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveSurface('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSurface === 'admin'
                ? 'bg-[#C68B59] text-white shadow-xs font-bold'
                : 'text-[#D7CCC8] hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Surface C: Admin Back-Office</span>
          </button>

          <button
            onClick={() => setActiveSurface('design_tokens')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSurface === 'design_tokens'
                ? 'bg-[#C68B59] text-white shadow-xs font-bold'
                : 'text-[#D7CCC8] hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Design Tokens Spec</span>
          </button>
        </div>

        {/* Auxiliary Controls: Photo Assets, Device Frame Toggle & Reset */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsImageModalOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-[#C68B59]/40 bg-[#C68B59]/20 hover:bg-[#C68B59] text-white font-bold flex items-center gap-1.5 transition-all shadow-xs"
            title="Open BBGL Real Photo Asset Studio"
          >
            <Camera className="w-3.5 h-3.5 text-[#C68B59] group-hover:text-white" />
            <span>Real Photos ({activePhotoCount}/9)</span>
          </button>

          <button
            onClick={() => setUseDeviceFrame(!useDeviceFrame)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
              useDeviceFrame
                ? 'bg-[#3E2723] border-[#C68B59] text-[#FDFBF7]'
                : 'bg-transparent border-[#3E2723] text-[#A1887F] hover:text-white'
            }`}
            title="Toggle between physical simulated device bezel and responsive full window mode"
          >
            {useDeviceFrame ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            <span className="hidden sm:inline">{useDeviceFrame ? 'Device Frame' : 'Fill Screen'}</span>
          </button>

          <button
            onClick={handleResetData}
            className="p-1.5 rounded-lg text-[#A1887F] hover:text-white hover:bg-[#3E2723] transition-colors"
            title="Reset simulated data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Real-time Ecosystem Sync Notification Toast */}
      {syncNotification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#3E2723] text-white px-4 py-2 rounded-full shadow-2xl border border-[#C68B59] flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-[#C68B59]" />
          <span>{syncNotification}</span>
        </div>
      )}

      {/* ========================================================
          SURFACE VIEWPORT CONTAINER (DEVICE FRAME OR FULL SCREEN)
         ======================================================== */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Surface A: Customer Kiosk (Portrait Totem Frame: 1080 x 1920 scaled) */}
        {activeSurface === 'kiosk' && (
          <div
            className={`transition-all duration-300 w-full flex justify-center items-center h-full ${
              useDeviceFrame
                ? 'max-w-[460px] h-[860px] my-auto'
                : 'max-w-none h-full'
            }`}
          >
            <div
              className={`w-full h-full bg-[#FDFBF7] flex flex-col overflow-hidden ${
                useDeviceFrame
                  ? 'rounded-[40px] border-[12px] border-[#180E0B] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/10 relative'
                  : 'rounded-2xl border border-[#3E2723]/20 shadow-xl'
              }`}
            >
              {/* Simulated Kiosk Hardware Top Bezel (Camera & Ambient Light) */}
              {useDeviceFrame && (
                <div className="h-6 bg-[#180E0B] flex items-center justify-center shrink-0">
                  <div className="w-12 h-1 bg-white/20 rounded-full" />
                </div>
              )}

              {/* Kiosk App Screen */}
              <div className="flex-1 overflow-hidden relative">
                <CustomerKiosk onOrderCreated={handleOrderCreatedFromKiosk} />
              </div>

              {/* Simulated Kiosk Hardware Bottom Chin (Receipt Slot & NFC Tap) */}
              {useDeviceFrame && (
                <div className="h-10 bg-[#180E0B] px-8 flex items-center justify-between shrink-0 text-[9px] text-[#A1887F] font-mono border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
                    <span>NFC TAP READY</span>
                  </div>
                  <div className="h-1.5 w-24 bg-black rounded-full border border-white/10" />
                  <span>RECEIPT PRINTER</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Surface B: Cashier POS Register (Landscape Terminal: 1920 x 1080 scaled) */}
        {activeSurface === 'pos' && (
          <div
            className={`transition-all duration-300 w-full flex justify-center items-center h-full ${
              useDeviceFrame
                ? 'max-w-5xl h-[720px] my-auto'
                : 'max-w-none h-full'
            }`}
          >
            <div
              className={`w-full h-full bg-[#F3EDE2] flex flex-col overflow-hidden ${
                useDeviceFrame
                  ? 'rounded-3xl border-[14px] border-[#180E0B] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/10 relative'
                  : 'rounded-2xl border border-[#3E2723]/20 shadow-xl'
              }`}
            >
              {/* POS App Screen */}
              <div className="flex-1 overflow-hidden relative">
                <CashierPos
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onAddNewPosOrder={handleAddNewPosOrder}
                />
              </div>
            </div>
          </div>
        )}

        {/* Surface C: Admin Back-Office (Desktop Monitor: 1440 x 900 scaled) */}
        {activeSurface === 'admin' && (
          <div
            className={`transition-all duration-300 w-full flex justify-center items-center h-full ${
              useDeviceFrame
                ? 'max-w-6xl h-[780px] my-auto'
                : 'max-w-none h-full'
            }`}
          >
            <div
              className={`w-full h-full bg-[#FDFBF7] flex flex-col overflow-hidden ${
                useDeviceFrame
                  ? 'rounded-2xl border-[8px] border-[#251713] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/10 relative'
                  : 'rounded-2xl border border-[#3E2723]/20 shadow-xl'
              }`}
            >
              <div className="flex-1 overflow-hidden relative">
                <AdminHub
                  orders={orders}
                  inventory={inventory}
                  staff={staff}
                  auditLogs={auditLogs}
                  onUpdateInventory={setInventory}
                  onUpdateStaff={setStaff}
                  onAddAuditLog={(newLog) => setAuditLogs((prev) => [newLog, ...prev])}
                  onOpenImageModal={() => setIsImageModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Design System & Tokens Spec Screen */}
        {activeSurface === 'design_tokens' && (
          <div className="w-full max-w-6xl h-full max-h-[820px] my-auto bg-[#FDFBF7] rounded-3xl border border-[#3E2723]/20 shadow-2xl overflow-hidden flex flex-col">
            <DesignTokensSpec onOpenImageModal={() => setIsImageModalOpen(true)} />
          </div>
        )}
      </main>

      {/* BBGL Real Photo Asset Studio Modal */}
      <ImageManagerModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />
    </div>
  );
}
