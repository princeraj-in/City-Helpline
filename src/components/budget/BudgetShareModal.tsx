import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { 
  X, MessageCircle, Copy, Check, Share2, 
  Download, IndianRupee, Sparkles
} from 'lucide-react';
import { BudgetCategoryItem } from './BudgetChart';
import { APP_CONFIG } from '../../lib/appConfig';

interface BudgetShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
  totalMonthly: number;
  targetBudget?: number;
  items: BudgetCategoryItem[];
  roomType: string;
  foodPlan: string;
  libraryShift: string;
}

export const BudgetShareModal: React.FC<BudgetShareModalProps> = ({
  isOpen,
  onClose,
  city,
  totalMonthly,
  targetBudget,
  items,
  roomType,
  foodPlan,
  libraryShift
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!isOpen) return null;

  const activeItems = items.filter(i => i.amount > 0);
  const lines = activeItems
    .map(i => `• ${i.name}: ₹${i.amount.toLocaleString('en-IN')} (${i.percentage}%)`)
    .join('\n');

  const shareText = `🎓 *Student Monthly Budget Plan for ${city}*
━━━━━━━━━━━━━━━━━━━━
💰 *Total Monthly Expense:* ₹${totalMonthly.toLocaleString('en-IN')}/month
📍 *Hub:* ${city}

📋 *Itemized Expense Breakdown:*
${lines}

💡 Estimated via Studolink Student Budget Calculator
🔗 Find verified PGs, Mess & Libraries at: ${APP_CONFIG.getSearchUrl(city)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const generatePrintableHtml = () => {
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Monthly Budget - ${city} - Studolink</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    .container {
      max-width: 680px;
      margin: 0 auto;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #00e5ff;
      padding-bottom: 18px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #0284c7;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 13px;
      color: #64748b;
      margin-top: 2px;
    }
    .header-meta {
      text-align: right;
      font-size: 12px;
      color: #64748b;
    }
    .summary-card {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .hub-name {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #15803d;
    }
    .total-price {
      font-size: 34px;
      font-weight: 900;
      color: #0f172a;
      margin: 6px 0;
    }
    .total-period {
      font-size: 14px;
      font-weight: 500;
      color: #64748b;
    }
    .summary-desc {
      font-size: 12px;
      color: #334155;
      margin: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #f8fafc;
      color: #475569;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 14px;
      border-bottom: 2px solid #cbd5e1;
      text-align: left;
    }
    td {
      padding: 12px 14px;
      font-size: 13px;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
    }
    .amount-col {
      text-align: right;
      font-weight: 700;
      font-size: 14px;
      color: #0f172a;
    }
    .percent-col {
      text-align: right;
      color: #64748b;
      font-size: 12px;
    }
    .total-row td {
      font-size: 16px;
      font-weight: 900;
      background: #f8fafc;
      border-top: 2px solid #cbd5e1;
      border-bottom: 2px solid #cbd5e1;
      color: #0284c7;
    }
    .notice-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px;
      font-size: 12px;
      color: #475569;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .footer {
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
    }
    @media print {
      body { padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand-title">🎓 Studolink</div>
        <div class="brand-sub">Student Ecosystem & Living Expense Plan</div>
      </div>
      <div class="header-meta">
        <div><strong>Date:</strong> ${dateStr}</div>
        <div><strong>City Hub:</strong> ${city}</div>
        <div><strong>Status:</strong> Verified Student Estimate</div>
      </div>
    </div>

    <div class="summary-card">
      <div class="hub-name">Target Hub: ${city}</div>
      <div class="total-price">₹${totalMonthly.toLocaleString('en-IN')} <span class="total-period">/ month</span></div>
      <p class="summary-desc">
        Comprehensive monthly budget estimate for accommodation, meals, study library, and student necessities in <strong>${city}</strong>.
      </p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Expense Category</th>
          <th style="text-align: right;">Monthly Amount (₹)</th>
          <th style="text-align: right;">Share</th>
        </tr>
      </thead>
      <tbody>
        ${activeItems.map(item => `
          <tr>
            <td><strong>${item.name}</strong></td>
            <td class="amount-col">₹${item.amount.toLocaleString('en-IN')}</td>
            <td class="percent-col">${item.percentage}%</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td>TOTAL MONTHLY ESTIMATE</td>
          <td class="amount-col">₹${totalMonthly.toLocaleString('en-IN')}</td>
          <td class="percent-col">100%</td>
        </tr>
      </tbody>
    </table>

    <div class="notice-box">
      <strong>Direct & Verified Properties:</strong> Find and contact verified PGs, hostels, tiffin services, and 24x7 study libraries directly in ${city} with 0% brokerage on <strong>${APP_CONFIG.baseUrl}</strong>.
    </div>

    <div class="footer">
      Generated via Studolink (${APP_CONFIG.baseUrl}) • Student Budget Calculator • Save or print this document for parent or room partner records.
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownload = () => {
    try {
      const html = generatePrintableHtml();
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Studolink-Student-Budget-${city.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2500);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg">
        <GlassCard className="p-6 sm:p-8 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,229,255,0.2)]" intensity="high">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-[#00E5FF] flex items-center justify-center border border-cyan-400/30">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Share & Save Budget
                </h3>
                <p className="text-xs text-gray-400">
                  Send to parents or download statement
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preview Card */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 font-sans text-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-cyan-300 tracking-wider">
                Monthly Estimate • {city}
              </span>
              <span className="text-xs text-gray-400">Studolink</span>
            </div>

            <div className="flex items-baseline gap-1 py-1">
              <span className="text-3xl font-black text-white">
                ₹{totalMonthly.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-400">/ month</span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs max-h-48 overflow-y-auto pr-1">
              {activeItems.map(item => (
                <div key={item.id} className="flex justify-between text-gray-300">
                  <span className="flex items-center gap-1.5 truncate pr-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-bold text-white shrink-0">₹{item.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
            >
              {isDownloaded ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download</span>
                </>
              )}
            </button>

            {/* WhatsApp & Copy Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-3 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Text Summary</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
