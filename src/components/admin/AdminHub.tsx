import React, { useState } from 'react';
import { 
  Order, 
  InventoryItem, 
  StaffMember, 
  AuditLogItem, 
  HourlySalesData 
} from '../../types';
import { HOURLY_SALES } from '../../data/mockData';
import { BbglLogo } from '../brand/BbglLogo';
import { 
  BarChart3, 
  Boxes, 
  Users, 
  ShieldAlert, 
  TrendingUp, 
  PackageCheck, 
  AlertTriangle, 
  Plus, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Building2, 
  Truck,
  ArrowUpRight,
  Coffee,
  X,
  Camera
} from 'lucide-react';
import { useImageAssets } from '../../context/ImageAssetsContext';

interface AdminHubProps {
  orders: Order[];
  inventory: InventoryItem[];
  staff: StaffMember[];
  auditLogs: AuditLogItem[];
  onUpdateInventory: (updated: InventoryItem[]) => void;
  onUpdateStaff: (updated: StaffMember[]) => void;
  onAddAuditLog: (log: AuditLogItem) => void;
  onOpenImageModal?: () => void;
}

type AdminTab = 'analytics' | 'inventory' | 'staff' | 'audit_log';

export const AdminHub: React.FC<AdminHubProps> = ({
  orders,
  inventory,
  staff,
  auditLogs,
  onUpdateInventory,
  onUpdateStaff,
  onAddAuditLog,
  onOpenImageModal,
}) => {
  const { activePhotoCount, useRealPhotos } = useImageAssets();
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  // Delivery Receiving Modal State
  const [isReceivingModalOpen, setIsReceivingModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('Benguet Highlands Roast');
  const [selectedIngredientId, setSelectedIngredientId] = useState(inventory[0]?.id || '');
  const [receivedQtyInput, setReceivedQtyInput] = useState('5.0');

  // Staff Permissions Modal State
  const [editingStaffMember, setEditingStaffMember] = useState<StaffMember | null>(null);

  // Audit Log Filter State
  const [auditFilter, setAuditFilter] = useState<'all' | 'flagged' | 'alerts'>('all');

  // Executive KPI Calculations
  const grossSales = orders.reduce((acc, o) => acc + o.subtotal, 0);
  const netSales = orders.reduce((acc, o) => acc + o.netTotal, 0);
  const totalCompleted = orders.filter((o) => ['completed', 'kitchen_queue', 'preparing', 'ready'].includes(o.status)).length;
  const avgTicket = totalCompleted > 0 ? netSales / totalCompleted : 0;

  // Top Selling Items breakdown
  const itemCounts: { [name: string]: { count: number; revenue: number } } = {};
  orders.forEach((ord) => {
    ord.items.forEach((item) => {
      if (!itemCounts[item.product.name]) {
        itemCounts[item.product.name] = { count: 0, revenue: 0 };
      }
      itemCounts[item.product.name].count += item.quantity;
      itemCounts[item.product.name].revenue += item.totalPrice;
    });
  });

  const sortedTopItems = Object.entries(itemCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  const maxItemCount = sortedTopItems[0] ? sortedTopItems[0][1].count : 1;

  // Handle Receiving Delivery
  const handleConfirmReceiving = () => {
    const qty = parseFloat(receivedQtyInput);
    if (!qty || qty <= 0) return;

    const targetIngredient = inventory.find((i) => i.id === selectedIngredientId);
    if (!targetIngredient) return;

    const updated = inventory.map((item) => {
      if (item.id === selectedIngredientId) {
        return {
          ...item,
          currentStock: item.currentStock + qty,
          lastRestocked: new Date().toISOString().split('T')[0],
        };
      }
      return item;
    });

    onUpdateInventory(updated);

    onAddAuditLog({
      id: `log_${Date.now()}`,
      timestamp: 'Just now',
      event: 'Ingredient Stock Received',
      user: 'Marcus Guido (Admin)',
      details: `Received ${qty} ${targetIngredient.unit} of ${targetIngredient.name} from ${selectedSupplier}. New Stock: ${(targetIngredient.currentStock + qty).toFixed(1)} ${targetIngredient.unit}.`,
      flaggedReview: false,
      severity: 'info',
    });

    setIsReceivingModalOpen(false);
  };

  // Handle Toggle Permission
  const handleTogglePermission = (key: keyof StaffMember['permissions']) => {
    if (!editingStaffMember) return;
    const updatedMember: StaffMember = {
      ...editingStaffMember,
      permissions: {
        ...editingStaffMember.permissions,
        [key]: !editingStaffMember.permissions[key],
      },
    };
    setEditingStaffMember(updatedMember);

    const updatedStaffList = staff.map((s) => (s.id === updatedMember.id ? updatedMember : s));
    onUpdateStaff(updatedStaffList);

    onAddAuditLog({
      id: `log_${Date.now()}`,
      timestamp: 'Just now',
      event: 'Staff Permission Modified',
      user: 'Marcus Guido (Admin)',
      details: `Updated ${key} permission for ${updatedMember.name} (${updatedMember.role}).`,
      flaggedReview: false,
      severity: 'info',
    });
  };

  // Filtered Audit Logs
  const filteredLogs = auditLogs.filter((log) => {
    if (auditFilter === 'flagged') return log.flaggedReview;
    if (auditFilter === 'alerts') return log.severity === 'alert';
    return true;
  });

  return (
    <div className="w-full h-full min-h-[780px] bg-[#FDFBF7] text-[#3E2723] flex flex-col font-sans select-none overflow-hidden">
      {/* Top Admin Navigation Header */}
      <header className="px-8 py-4 bg-white border-b border-[#3E2723]/10 flex items-center justify-between shadow-2xs shrink-0">
        <div className="flex items-center gap-3">
          <BbglLogo size={40} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-lg text-[#3E2723] leading-none">
                BBGL Coffee Admin Hub
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#3E2723] text-[#FDFBF7]">
                Back-Office
              </span>
            </div>
            <span className="text-[11px] text-[#795548]">
              Campus Store #101 · Executive Control, Real-Time Inventory & Security Trails
            </span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#F3EDE2] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-[#3E2723] shadow-xs'
                : 'text-[#795548] hover:text-[#3E2723]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#C68B59]" />
            <span>Sales & Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'inventory'
                ? 'bg-white text-[#3E2723] shadow-xs'
                : 'text-[#795548] hover:text-[#3E2723]'
            }`}
          >
            <Boxes className="w-3.5 h-3.5 text-[#C68B59]" />
            <span>Inventory & Stock</span>
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'staff'
                ? 'bg-white text-[#3E2723] shadow-xs'
                : 'text-[#795548] hover:text-[#3E2723]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#C68B59]" />
            <span>Staffing & Roles</span>
          </button>
          <button
            onClick={() => setActiveTab('audit_log')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'audit_log'
                ? 'bg-white text-[#3E2723] shadow-xs'
                : 'text-[#795548] hover:text-[#3E2723]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#C68B59]" />
            <span>Audit & Security</span>
          </button>
        </nav>

        {/* Right Action: Photo Assets */}
        {onOpenImageModal && (
          <button
            type="button"
            onClick={onOpenImageModal}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-[#C68B59]/15 hover:bg-[#C68B59] text-[#3E2723] hover:text-white transition-all border border-[#C68B59]/30 shadow-2xs"
            title="Open BBGL Real Photo Asset Studio"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photo Assets ({activePhotoCount}/9)</span>
          </button>
        )}
      </header>

      {/* Main Admin Content Body */}
      <div className="flex-1 overflow-y-auto p-8 bg-[#FDFBF7]">
        {/* ========================================================
            SCREEN C1: EXECUTIVE SALES & ANALYTICS DASHBOARD
           ======================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 max-w-7xl mx-auto">
            {/* Top KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Gross Sales */}
              <div className="p-5 rounded-2xl bg-white border border-[#3E2723]/10 shadow-xs">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#795548] uppercase tracking-wider">Gross Sales</span>
                  <span className="p-1.5 rounded-lg bg-[#C68B59]/10 text-[#C68B59]">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                </div>
                <div className="font-mono text-2xl font-black text-[#3E2723] mt-2 tabular-nums">
                  ₱{grossSales.toFixed(2)}
                </div>
                <span className="text-[11px] text-[#2E7D32] font-semibold mt-1 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+18.4% vs previous campus weekday</span>
                </span>
              </div>

              {/* Net Sales */}
              <div className="p-5 rounded-2xl bg-white border border-[#3E2723]/10 shadow-xs">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#795548] uppercase tracking-wider">Net Sales (After Disc.)</span>
                  <span className="p-1.5 rounded-lg bg-[#2E7D32]/10 text-[#2E7D32]">
                    <PackageCheck className="w-4 h-4" />
                  </span>
                </div>
                <div className="font-mono text-2xl font-black text-[#2E7D32] mt-2 tabular-nums">
                  ₱{netSales.toFixed(2)}
                </div>
                <span className="text-[11px] text-[#795548] mt-1 block">
                  Discounts deducted: ₱{(grossSales - netSales).toFixed(2)}
                </span>
              </div>

              {/* Total Orders Completed */}
              <div className="p-5 rounded-2xl bg-white border border-[#3E2723]/10 shadow-xs">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#795548] uppercase tracking-wider">Orders Handled</span>
                  <span className="p-1.5 rounded-lg bg-[#3E2723]/10 text-[#3E2723]">
                    <Coffee className="w-4 h-4" />
                  </span>
                </div>
                <div className="font-mono text-2xl font-black text-[#3E2723] mt-2 tabular-nums">
                  {orders.length}
                </div>
                <span className="text-[11px] text-[#795548] mt-1 block">
                  {totalCompleted} fulfilled · {orders.filter((o) => o.status === 'pending_cash').length} pending cash
                </span>
              </div>

              {/* Average Ticket Value */}
              <div className="p-5 rounded-2xl bg-white border border-[#3E2723]/10 shadow-xs">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#795548] uppercase tracking-wider">Average Ticket</span>
                  <span className="p-1.5 rounded-lg bg-[#C68B59]/10 text-[#C68B59]">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                </div>
                <div className="font-mono text-2xl font-black text-[#3E2723] mt-2 tabular-nums">
                  ₱{avgTicket.toFixed(2)}
                </div>
                <span className="text-[11px] text-[#795548] mt-1 block">
                  ~2.1 items per customer ticket
                </span>
              </div>
            </div>

            {/* Visual Charts: Hourly Sales Volume & Top-Selling Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hourly Sales Volume Bar Chart */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#3E2723]/10 shadow-xs">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#3E2723]">Hourly Sales Volume</h3>
                    <p className="text-xs text-[#795548]">
                      Peak hours: 8 AM Morning Coffee Rush, 12 PM Lunch Spaghetti, 3 PM Milk Tea Merienda
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C68B59] bg-[#C68B59]/10 px-2.5 py-1 rounded-lg">
                    Peak: 12 PM (48 orders)
                  </span>
                </div>

                {/* SVG/Bar Chart Container */}
                <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-[#3E2723]/10">
                  {HOURLY_SALES.map((h, idx) => {
                    const heightPercent = (h.orders / 50) * 100;
                    const isPeak = h.hour === '8 AM' || h.hour === '12 PM' || h.hour === '3 PM';
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Hover Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-[#3E2723] text-white text-[10px] py-1 px-2 rounded-md font-mono pointer-events-none whitespace-nowrap shadow-md z-10">
                          {h.orders} orders · ₱{h.sales.toLocaleString()}
                        </div>

                        {/* Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[32px] rounded-t-lg transition-all ${
                            isPeak
                              ? 'bg-[#C68B59] group-hover:bg-[#3E2723]'
                              : 'bg-[#F3EDE2] group-hover:bg-[#C68B59]/70'
                          }`}
                        />
                        <span className="font-mono text-[10px] text-[#795548] mt-1 whitespace-nowrap">
                          {h.hour}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top-Selling Items Ranked */}
              <div className="p-6 rounded-2xl bg-white border border-[#3E2723]/10 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[#3E2723] mb-1">Top-Selling Items</h3>
                  <p className="text-xs text-[#795548] mb-5">Ranked by volume ordered today</p>

                  <div className="space-y-4">
                    {sortedTopItems.map(([name, data], idx) => {
                      const percentage = Math.round((data.count / maxItemCount) * 100);
                      return (
                        <div key={name} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-[#3E2723]">
                              {idx + 1}. {name}
                            </span>
                            <span className="font-mono text-[#795548] tabular-nums">
                              {data.count} sold · ₱{data.revenue.toFixed(0)}
                            </span>
                          </div>
                          <div className="w-full bg-[#F3EDE2] h-2 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${percentage}%` }}
                              className="bg-[#C68B59] h-full rounded-full transition-all"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#3E2723]/10 text-xs text-[#795548] flex justify-between items-center">
                  <span>Beverage / Food ratio:</span>
                  <span className="font-bold text-[#3E2723]">68% Drinks / 32% Food</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN C2: INVENTORY & RECIPE STOCK HUB
           ======================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-[#3E2723]">Ingredient & Recipe Inventory Hub</h2>
                <p className="text-xs text-[#795548]">
                  Track live kitchen stock levels, auto-calculate depleted beans & boba, and receive deliveries.
                </p>
              </div>

              <button
                onClick={() => setIsReceivingModalOpen(true)}
                className="px-4 py-2.5 bg-[#3E2723] hover:bg-[#2E1C18] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 self-start"
              >
                <Truck className="w-4 h-4 text-[#C68B59]" />
                <span>Receive Supplier Delivery</span>
              </button>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-[#3E2723]/10 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F3EDE2]/60 border-b border-[#3E2723]/10 font-bold text-[#795548] uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Ingredient Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Current Stock</th>
                      <th className="py-3.5 px-4">Min. Alert Level</th>
                      <th className="py-3.5 px-4">Stock Status</th>
                      <th className="py-3.5 px-4">Supplier</th>
                      <th className="py-3.5 px-4">Last Restocked</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3E2723]/5">
                    {inventory.map((item) => {
                      const isLowStock = item.currentStock <= item.minStockAlert;
                      return (
                        <tr key={item.id} className="hover:bg-[#FDFBF7] transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#3E2723]">{item.name}</td>
                          <td className="py-3.5 px-4 text-[#795548]">{item.category}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#3E2723] tabular-nums">
                            {item.currentStock.toFixed(1)} {item.unit}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[#795548] tabular-nums">
                            {item.minStockAlert.toFixed(1)} {item.unit}
                          </td>
                          <td className="py-3.5 px-4">
                            {isLowStock ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#C62828]/10 text-[#C62828] border border-[#C62828]/20">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Low Stock / Reorder</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>In Stock</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-[#795548]">{item.supplier}</td>
                          <td className="py-3.5 px-4 font-mono text-[#795548]">{item.lastRestocked}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN C3: STAFFING & ROLE PERMISSIONS MATRIX
           ======================================================== */}
        {activeTab === 'staff' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div>
              <h2 className="font-display font-bold text-xl text-[#3E2723]">Staffing & Role Permissions Matrix</h2>
              <p className="text-xs text-[#795548]">
                Manage active campus shifts, assign role responsibilities, and control POS permission gates.
              </p>
            </div>

            {/* Staff Roster Table */}
            <div className="bg-white rounded-2xl border border-[#3E2723]/10 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F3EDE2]/60 border-b border-[#3E2723]/10 font-bold text-[#795548] uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Staff Member</th>
                      <th className="py-3.5 px-4">Assigned Role</th>
                      <th className="py-3.5 px-4">Contact Phone</th>
                      <th className="py-3.5 px-4">Current Shift</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Active Permissions</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3E2723]/5">
                    {staff.map((member) => (
                      <tr key={member.id} className="hover:bg-[#FDFBF7] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#3E2723]">{member.name}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#3E2723] bg-[#F3EDE2] px-2 py-0.5 rounded-md">
                            {member.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#795548]">{member.contact}</td>
                        <td className="py-3.5 px-4 text-[#795548]">{member.shiftSchedule}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E7D32]">
                            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                            <span>{member.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {member.permissions.allowManualDiscounts && (
                              <span className="px-1.5 py-0.5 rounded bg-[#C68B59]/10 text-[#C68B59] text-[10px] font-semibold">
                                Discounts
                              </span>
                            )}
                            {member.permissions.allowOrderCancellation && (
                              <span className="px-1.5 py-0.5 rounded bg-[#C62828]/10 text-[#C62828] text-[10px] font-semibold">
                                Cancellations
                              </span>
                            )}
                            {member.permissions.exportFinancialReports && (
                              <span className="px-1.5 py-0.5 rounded bg-[#2E7D32]/10 text-[#2E7D32] text-[10px] font-semibold">
                                Reports
                              </span>
                            )}
                            {member.permissions.editMenuPrices && (
                              <span className="px-1.5 py-0.5 rounded bg-[#3E2723]/10 text-[#3E2723] text-[10px] font-semibold">
                                Price Edits
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setEditingStaffMember(member)}
                            className="px-3 py-1 bg-[#F3EDE2] hover:bg-[#E9DEC8] text-[#3E2723] rounded-lg text-xs font-bold transition-colors"
                          >
                            Edit Permissions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN C4: AUDIT LOG & SECURITY TRAIL
           ======================================================== */}
        {activeTab === 'audit_log' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-[#3E2723]">Audit Log & Immutable Security Trail</h2>
                <p className="text-xs text-[#795548]">
                  Event stream tracking price updates, employee actions, order cancellations, and flagged 100% full-value discounts.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-2 self-start">
                <button
                  onClick={() => setAuditFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    auditFilter === 'all' ? 'bg-[#3E2723] text-white' : 'bg-[#F3EDE2] text-[#3E2723]'
                  }`}
                >
                  All Events ({auditLogs.length})
                </button>
                <button
                  onClick={() => setAuditFilter('flagged')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    auditFilter === 'flagged' ? 'bg-[#C62828] text-white' : 'bg-[#F3EDE2] text-[#3E2723]'
                  }`}
                >
                  Review Needed
                </button>
                <button
                  onClick={() => setAuditFilter('alerts')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    auditFilter === 'alerts' ? 'bg-[#C68B59] text-white' : 'bg-[#F3EDE2] text-[#3E2723]'
                  }`}
                >
                  Alerts
                </button>
              </div>
            </div>

            {/* Immutable Event Stream Cards */}
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-4 rounded-2xl bg-white border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    log.flaggedReview
                      ? 'border-[#C62828]/40 bg-[#C62828]/2'
                      : 'border-[#3E2723]/10'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-[#3E2723]">{log.event}</span>
                      {log.flaggedReview && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#C62828] text-white shadow-xs">
                          Review Needed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#795548] leading-relaxed max-w-2xl">{log.details}</p>
                    <div className="text-[11px] text-[#795548]/80 flex items-center gap-3 pt-1">
                      <span>Initiated by: <strong>{log.user}</strong></span>
                      <span>·</span>
                      <span className="font-mono">{log.timestamp}</span>
                    </div>
                  </div>

                  {log.flaggedReview && (
                    <button
                      onClick={() => {
                        alert(`Incident ${log.id} marked as inspected and acknowledged by Admin.`);
                      }}
                      className="px-3 py-1.5 bg-[#C62828]/10 hover:bg-[#C62828]/20 text-[#C62828] text-xs font-bold rounded-lg self-start sm:self-center shrink-0"
                    >
                      Acknowledge Review
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          DELIVERY RECEIVING MODAL
         ======================================================== */}
      {isReceivingModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#3E2723]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-6 shadow-2xl border border-[#3E2723]/20 animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-[#3E2723]">Log Delivery Receiving</h3>
                <span className="text-xs text-[#795548]">Update inventory stock on supplier hand-off</span>
              </div>
              <button onClick={() => setIsReceivingModalOpen(false)} className="p-1 text-[#795548] hover:text-[#3E2723]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#795548] block mb-1">Select Supplier</label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#3E2723]/20 bg-white text-xs font-semibold"
                >
                  <option value="Benguet Highlands Roast">Benguet Highlands Roast (Coffee)</option>
                  <option value="Boba King Corp">Boba King Corp (Tapioca & Syrups)</option>
                  <option value="Sweetcraft Manila">Sweetcraft Manila (Tiger Sugar)</option>
                  <option value="Hacienda Dairy Fresh">Hacienda Dairy Fresh (Milk & Cheese)</option>
                  <option value="Artisan Bakehub">Artisan Bakehub (Croissants & Rolls)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#795548] block mb-1">Select Ingredient Received</label>
                <select
                  value={selectedIngredientId}
                  onChange={(e) => setSelectedIngredientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#3E2723]/20 bg-white text-xs font-semibold"
                >
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Current: {item.currentStock.toFixed(1)} {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#795548] block mb-1">Quantity Received</label>
                <input
                  type="number"
                  step="0.5"
                  value={receivedQtyInput}
                  onChange={(e) => setReceivedQtyInput(e.target.value)}
                  placeholder="e.g. 5.0"
                  className="w-full p-2.5 rounded-xl border border-[#3E2723]/20 bg-white font-mono text-sm font-bold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setIsReceivingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#3E2723]/20 text-xs font-bold text-[#795548]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReceiving}
                  className="flex-1 py-2.5 bg-[#2E7D32] hover:bg-[#256629] text-white font-display text-xs font-bold rounded-xl shadow-xs"
                >
                  Confirm & Update Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STAFF PERMISSION EDITOR MODAL
         ======================================================== */}
      {editingStaffMember && (
        <div className="fixed inset-0 z-50 bg-[#3E2723]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-6 shadow-2xl border border-[#3E2723]/20 animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-[#3E2723]">
                  Edit Permissions: {editingStaffMember.name}
                </h3>
                <span className="text-xs text-[#795548]">Role: {editingStaffMember.role}</span>
              </div>
              <button onClick={() => setEditingStaffMember(null)} className="p-1 text-[#795548] hover:text-[#3E2723]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#3E2723]/10 cursor-pointer">
                <div>
                  <div className="font-bold text-xs text-[#3E2723]">Allow Manual Discounts</div>
                  <div className="text-[10px] text-[#795548]">Permit cashier to apply custom ₱ or % discounts</div>
                </div>
                <input
                  type="checkbox"
                  checked={editingStaffMember.permissions.allowManualDiscounts}
                  onChange={() => handleTogglePermission('allowManualDiscounts')}
                  className="rounded text-[#3E2723]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#3E2723]/10 cursor-pointer">
                <div>
                  <div className="font-bold text-xs text-[#3E2723]">Allow Order Cancellation</div>
                  <div className="text-[10px] text-[#795548]">Permit voiding active or paid orders</div>
                </div>
                <input
                  type="checkbox"
                  checked={editingStaffMember.permissions.allowOrderCancellation}
                  onChange={() => handleTogglePermission('allowOrderCancellation')}
                  className="rounded text-[#3E2723]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#3E2723]/10 cursor-pointer">
                <div>
                  <div className="font-bold text-xs text-[#3E2723]">Export Financial Reports</div>
                  <div className="text-[10px] text-[#795548]">Permit downloading CSV/PDF revenue metrics</div>
                </div>
                <input
                  type="checkbox"
                  checked={editingStaffMember.permissions.exportFinancialReports}
                  onChange={() => handleTogglePermission('exportFinancialReports')}
                  className="rounded text-[#3E2723]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#3E2723]/10 cursor-pointer">
                <div>
                  <div className="font-bold text-xs text-[#3E2723]">Edit Menu Prices</div>
                  <div className="text-[10px] text-[#795548]">Permit altering drink and food base prices</div>
                </div>
                <input
                  type="checkbox"
                  checked={editingStaffMember.permissions.editMenuPrices}
                  onChange={() => handleTogglePermission('editMenuPrices')}
                  className="rounded text-[#3E2723]"
                />
              </label>

              <button
                onClick={() => setEditingStaffMember(null)}
                className="mt-4 w-full py-2.5 bg-[#3E2723] text-white font-display text-xs font-bold rounded-xl"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
