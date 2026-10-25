/**
 * MY-AUDITOR Deterministic Financial Reporting Engine
 */

import { Kobo, addKobo, subtractKobo } from './currency';
import { globalAccountingEngine, CHART_OF_ACCOUNTS } from './accountingEngine';

export interface ProfitAndLossReport {
  totalRevenueKobo: Kobo;
  totalCogsKobo: Kobo;
  grossProfitKobo: Kobo;
  operatingExpensesKobo: Kobo;
  recognizedLossesKobo: Kobo;
  netProfitKobo: Kobo;
}

export interface DailyPandLPoint {
  date: string;
  revenueKobo: Kobo;
  cogsKobo: Kobo;
  expensesKobo: Kobo;
  netProfitKobo: Kobo;
}

export function generateProfitAndLossReport(): ProfitAndLossReport {
  const entries = globalAccountingEngine.getJournalEntries();

  let totalRevenueKobo: Kobo = 0n;
  let totalCogsKobo: Kobo = 0n;
  let operatingExpensesKobo: Kobo = 0n;
  let recognizedLossesKobo: Kobo = 0n;

  for (const entry of entries) {
    for (const line of entry.lines) {
      if (line.accountId === CHART_OF_ACCOUNTS.SALES_REVENUE.id) {
        totalRevenueKobo = addKobo(totalRevenueKobo, line.creditKobo);
        totalRevenueKobo = subtractKobo(totalRevenueKobo, line.debitKobo);
      } else if (line.accountId === CHART_OF_ACCOUNTS.COGS.id) {
        totalCogsKobo = addKobo(totalCogsKobo, line.debitKobo);
        totalCogsKobo = subtractKobo(totalCogsKobo, line.creditKobo);
      } else if (line.accountId === CHART_OF_ACCOUNTS.FUEL_EXPENSE.id || line.accountId === CHART_OF_ACCOUNTS.OPERATING_EXPENSE.id) {
        operatingExpensesKobo = addKobo(operatingExpensesKobo, line.debitKobo);
        operatingExpensesKobo = subtractKobo(operatingExpensesKobo, line.creditKobo);
      } else if (line.accountId === CHART_OF_ACCOUNTS.INVENTORY_LOSS.id) {
        recognizedLossesKobo = addKobo(recognizedLossesKobo, line.debitKobo);
        recognizedLossesKobo = subtractKobo(recognizedLossesKobo, line.creditKobo);
      }
    }
  }

  const grossProfitKobo = subtractKobo(totalRevenueKobo, totalCogsKobo);
  const totalDeductionsKobo = addKobo(operatingExpensesKobo, recognizedLossesKobo);
  const netProfitKobo = subtractKobo(grossProfitKobo, totalDeductionsKobo);

  return {
    totalRevenueKobo,
    totalCogsKobo,
    grossProfitKobo,
    operatingExpensesKobo,
    recognizedLossesKobo,
    netProfitKobo,
  };
}

export function generateDailyPandLTrend(): DailyPandLPoint[] {
  const entries = globalAccountingEngine.getJournalEntries();
  const dailyMap = new Map<string, { rev: Kobo; cogs: Kobo; exp: Kobo; loss: Kobo }>();

  for (const entry of entries) {
    const day = entry.date.split('T')[0];
    if (!dailyMap.has(day)) {
      dailyMap.set(day, { rev: 0n, cogs: 0n, exp: 0n, loss: 0n });
    }
    const record = dailyMap.get(day)!;

    for (const line of entry.lines) {
      if (line.accountId === CHART_OF_ACCOUNTS.SALES_REVENUE.id) {
        record.rev = addKobo(record.rev, line.creditKobo - line.debitKobo);
      } else if (line.accountId === CHART_OF_ACCOUNTS.COGS.id) {
        record.cogs = addKobo(record.cogs, line.debitKobo - line.creditKobo);
      } else if (line.accountId === CHART_OF_ACCOUNTS.FUEL_EXPENSE.id || line.accountId === CHART_OF_ACCOUNTS.OPERATING_EXPENSE.id) {
        record.exp = addKobo(record.exp, line.debitKobo - line.creditKobo);
      } else if (line.accountId === CHART_OF_ACCOUNTS.INVENTORY_LOSS.id) {
        record.loss = addKobo(record.loss, line.debitKobo - line.creditKobo);
      }
    }
  }

  const result: DailyPandLPoint[] = [];
  for (const [date, val] of dailyMap.entries()) {
    const gross = subtractKobo(val.rev, val.cogs);
    const deductions = addKobo(val.exp, val.loss);
    const net = subtractKobo(gross, deductions);

    result.push({
      date,
      revenueKobo: val.rev,
      cogsKobo: val.cogs,
      expensesKobo: val.exp,
      netProfitKobo: net,
    });
  }

  return result.sort((a, b) => a.date.localeCompare(b.date));
}