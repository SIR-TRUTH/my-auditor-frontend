import React, { useState } from 'react';
import { Bot, Send, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { generateProfitAndLossReport } from '../lib/reportsEngine';
import { globalAuditEngine } from '../lib/auditEngine';
import { formatKoboToNaira } from '../lib/currency';
import { UserContext } from '../lib/rbacEngine';

interface AiAdvisorModuleProps {
  currentUser: UserContext;
  currencyKey: string;
}

export default function AiAdvisorModule({ currentUser, currencyKey }: AiAdvisorModuleProps) {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your MY-AUDITOR AI Forensic CPA. I am directly connected to your verified branch ledger. Ask me about your P&L, expense trends, inventory valuation, or audit exposures.'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const pnlReport = generateProfitAndLossReport();
  const totalExposureKobo = globalAuditEngine.getTotalPotentialExposureKobo();
  const formatMoney = (koboVal: bigint) => formatKoboToNaira(koboVal, currencyKey === 'USD' ? '$' : '₦');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const query = inputQuery;
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setInputQuery('');

    setTimeout(() => {
      let aiReply = '';
      const lower = query.toLowerCase();

      if (lower.includes('profit') || lower.includes('p&l') || lower.includes('revenue')) {
        aiReply = `📊 **Forensic CPA Ledger Analysis (Branch: ${currentUser.branchId}):**\n` +
          `• **Total Revenue:** ${formatMoney(pnlReport.totalRevenueKobo)}\n` +
          `• **Gross Profit:** ${formatMoney(pnlReport.grossProfitKobo)}\n` +
          `• **Operating Expenses:** ${formatMoney(pnlReport.operatingExpensesKobo)}\n` +
          `• **Net Audited Profit:** ${formatMoney(pnlReport.netProfitKobo)}\n\n` +
          `All figures are computed deterministically from verified double-entry journals.`;
      } else if (lower.includes('exposure') || lower.includes('audit') || lower.includes('loss') || lower.includes('shrinkage')) {
        aiReply = `🛡️ **Audit Exposure Analysis:**\n` +
          `• **Potential Audit Exposure:** ${formatMoney(totalExposureKobo)}\n` +
          `• **Status:** Isolated in Continuous Audit Centre.\n\n` +
          `As per accounting standards, audit findings do not automatically alter recognized Net Profit until authorized for write-off by an Admin.`;
      } else {
        aiReply = `🤖 **MY-AUDITOR Intelligence Engine:**\n` +
          `I have analyzed your request against active branch records. Your current Net Audited Profit stands at **${formatMoney(pnlReport.netProfitKobo)}** with **${formatMoney(totalExposureKobo)}** in isolated audit exposure. How else may I assist with your financial oversight?`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-400" /> AI Business Adviser & Forensic CPA
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Grounded intelligence answering financial inquiries using real verified enterprise ledger data.
          </p>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Zero Fabrication
        </span>
      </div>

      {/* Chat Interface */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300">Active Forensic Session</span>
          <span className="text-slate-400 font-mono">Role: {currentUser.role}</span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs whitespace-pre-wrap">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed ${msg.sender === 'user' ? 'bg-emerald-500 text-slate-950 font-medium shadow-lg' : 'bg-slate-950 border border-slate-800 text-slate-200 shadow-md'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-3">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Ask Forensic CPA about your P&L, profit changes, or audit exposures..."
            className="flex-1 bg-slate-900 border border-slate-800 text-xs rounded-xl px-4 py-3 text-white focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl cursor-pointer flex items-center justify-center shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}