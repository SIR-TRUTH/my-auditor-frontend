const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery;
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setUserQuery("");

    setTimeout(() => {
      const lower = query.toLowerCase();
      let aiResponse = "";

      // 1. Complex Margin & Profit Analysis
      if (lower.includes('margin') || lower.includes('profit') || lower.includes('net') || lower.includes('gross')) {
        const marginPct = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0';
        aiResponse = `📊 **Live Financial Audit Summary for ${selectedBranch}:**\n` +
          `• **Total Revenue:** ${formatCurrency(totalRevenue)}\n` +
          `• **Gross Profit:** ${formatCurrency(grossProfit)} (${marginPct}% Gross Margin)\n` +
          `• **Total Expenses & Leakage:** ${formatCurrency(totalExpenses + totalShrinkageLoss + anomalyResult.totalDiscrepancyAmount)}\n` +
          `• **Net Audited Profit:** ${formatCurrency(netProfit)}`;
      } 
      // 2. Anomaly & Supplier Risk Audit
      else if (lower.includes('supplier') || lower.includes('anomaly') || lower.includes('spike') || lower.includes('risk') || lower.includes('leakage')) {
        if (anomalyResult.hasAnomaly) {
          aiResponse = `🚨 **AI Audit Alert:** We flagged **${anomalyResult.flaggedItems.length} supplier anomaly(ies)** resulting in an estimated **${formatCurrency(anomalyResult.totalDiscrepancyAmount)}** in price leakage. ` +
            `Review your ingested receipts section to verify unit costs against historical benchmarks.`;
        } else {
          aiResponse = `✅ **Supplier Audit Clean:** All active supplier invoices for ${selectedBranch} are currently aligned with benchmark pricing. Zero price spike anomalies detected!`;
        }
      } 
      // 3. Inventory & Stock Valuation
      else if (lower.includes('inventory') || lower.includes('stock') || lower.includes('catalog') || lower.includes('product')) {
        const totalItems = allVarieties.reduce((sum, v) => sum + v.qty, 0);
        aiResponse = `📦 **Inventory Status for ${selectedBranch}:**\n` +
          `• **Active Varieties:** ${allVarieties.length}\n` +
          `• **Total Stock Units:** ${totalItems} items\n` +
          `• **Catalog Selling Valuation:** ${formatCurrency(inventoryRevenue)}\n` +
          `• **Cost Basis (COGS):** ${formatCurrency(inventoryCOGS)}`;
      } 
      // 4. Shrinkage & Loss Audit
      else if (lower.includes('shrinkage') || lower.includes('theft') || lower.includes('loss') || lower.includes('damage')) {
        aiResponse = `🛡️ **Shrinkage & Loss Report:**\n` +
          `• **Logged Shrinkage Events:** ${shrinkageLogs.length}\n` +
          `• **Total Shrinkage Loss:** ${formatCurrency(totalShrinkageLoss)}\n` +
          `• **Operational Expenses:** ${formatCurrency(totalExpenses)}`;
      } 
      // 5. Default Intelligent Fallback
      else {
        aiResponse = `I have analyzed your **${selectedBranch}** branch metrics! Your current Net Audited Profit is **${formatCurrency(netProfit)}** on **${formatCurrency(totalRevenue)}** in total sales. Ask me about your margins, supplier price spikes, inventory valuation, or shrinkage logs!`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 600);
  };