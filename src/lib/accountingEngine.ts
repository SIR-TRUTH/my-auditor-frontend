/**
 * MY-AUDITOR Double-Entry Accounting Engine
 * Enforces SUM(debits) === SUM(credits) and strictly separates Audit Findings from Financial Statements.
 */

import { Kobo, addKobo, subtractKobo } from './currency';

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE' | 'LOSS';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
}

export interface JournalLine {
  accountId: string;
  debitKobo: Kobo;
  creditKobo: Kobo;
}

export interface JournalEntry {
  id: string;
  businessId: string;
  branchId: string;
  description: string;
  referenceType: 'SALE' | 'PURCHASE' | 'EXPENSE' | 'STOCK_LOSS_WRITEOFF' | 'MANUAL';
  referenceId: string;
  date: string;
  lines: JournalLine[];
  postedAt: string;
}

export const CHART_OF_ACCOUNTS: Record<string, Account> = {
  CASH: { id: 'acc-cash', code: '1010', name: 'Cash on Hand', type: 'ASSET' },
  BANK: { id: 'acc-bank', code: '1020', name: 'Bank Account', type: 'ASSET' },
  POS_CLEARING: { id: 'acc-pos', code: '1030', name: 'POS Clearing Account', type: 'ASSET' },
  ACCOUNTS_RECEIVABLE: { id: 'acc-ar', code: '1100', name: 'Accounts Receivable', type: 'ASSET' },
  INVENTORY: { id: 'acc-inv', code: '1200', name: 'Merchandise Inventory', type: 'ASSET' },
  ACCOUNTS_PAYABLE: { id: 'acc-ap', code: '2010', name: 'Accounts Payable', type: 'LIABILITY' },
  SALES_REVENUE: { id: 'acc-rev', code: '4010', name: 'Sales Revenue', type: 'REVENUE' },
  COGS: { id: 'acc-cogs', code: '5010', name: 'Cost of Goods Sold', type: 'EXPENSE' },
  FUEL_EXPENSE: { id: 'acc-exp-fuel', code: '6010', name: 'Generator Fuel Expense', type: 'EXPENSE' },
  OPERATING_EXPENSE: { id: 'acc-exp-op', code: '6090', name: 'General Operating Expense', type: 'EXPENSE' },
  INVENTORY_LOSS: { id: 'acc-loss-inv', code: '7010', name: 'Confirmed Inventory Loss Write-Off', type: 'LOSS' },
};

export class AccountingEngine {
  private journalEntries: JournalEntry[] = [];

  public postJournalEntry(entry: Omit<JournalEntry, 'id' | 'postedAt'>): JournalEntry {
    let totalDebit: Kobo = 0n;
    let totalCredit: Kobo = 0n;

    for (const line of entry.lines) {
      if (line.debitKobo < 0n || line.creditKobo < 0n) {
        throw new Error('Debit and Credit amounts must be non-negative integer minor units (Kobo).');
      }
      totalDebit = addKobo(totalDebit, line.debitKobo);
      totalCredit = addKobo(totalCredit, line.creditKobo);
    }

    if (totalDebit !== totalCredit) {
      throw new Error(`Unbalanced Journal Entry! Total Debits (${totalDebit}) do not equal Total Credits (${totalCredit}).`);
    }

    const postedEntry: JournalEntry = {
      ...entry,
      id: `je-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      postedAt: new Date().toISOString(),
    };

    this.journalEntries.push(postedEntry);
    return postedEntry;
  }

  public getJournalEntries(): JournalEntry[] {
    return [...this.journalEntries];
  }

  public clear(): void {
    this.journalEntries = [];
  }
}

export const globalAccountingEngine = new AccountingEngine();