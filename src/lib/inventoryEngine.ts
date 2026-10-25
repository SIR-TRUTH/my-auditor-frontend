/**
 * MY-AUDITOR Inventory & Weighted Average Costing Engine
 */

import { Kobo, multiplyKoboByQty } from './currency';

export type MovementType = 
  | 'OPENING_BALANCE' 
  | 'PURCHASE_RECEIPT' 
  | 'SALE' 
  | 'ADJUSTMENT_OUT' 
  | 'STOCK_WRITE_OFF';

export interface InventoryMovement {
  id: string;
  businessId: string;
  branchId: string;
  productId: string;
  quantity: number;
  movementType: MovementType;
  unitCostKobo: Kobo;
  totalCostKobo: Kobo;
  referenceType: string;
  referenceId: string;
  createdAt: string;
}

export interface ProductInventoryState {
  productId: string;
  productName: string;
  currentStock: number;
  weightedAverageCostKobo: Kobo;
}

export class InventoryEngine {
  private movements: InventoryMovement[] = [];
  private productsState: Map<string, ProductInventoryState> = new Map();

  public registerProduct(productId: string, productName: string, openingStock: number, openingCostKobo: Kobo): void {
    this.productsState.set(productId, {
      productId,
      productName,
      currentStock: 0,
      weightedAverageCostKobo: openingCostKobo,
    });

    if (openingStock > 0) {
      this.recordMovement({
        businessId: 'biz-1',
        branchId: 'branch-1',
        productId,
        quantity: openingStock,
        movementType: 'OPENING_BALANCE',
        unitCostKobo: openingCostKobo,
        totalCostKobo: multiplyKoboByQty(openingCostKobo, openingStock),
        referenceType: 'OPENING',
        referenceId: `init-${productId}`,
      });
    }
  }

  public recordMovement(movement: Omit<InventoryMovement, 'id' | 'createdAt'>): InventoryMovement {
    const state = this.productsState.get(movement.productId);
    if (!state) {
      throw new Error(`Product ${movement.productId} not registered in inventory engine.`);
    }

    if (movement.quantity < 0 && state.currentStock < Math.abs(movement.quantity)) {
      throw new Error(`Insufficient stock for product ${state.productName}. Available: ${state.currentStock}, Requested: ${Math.abs(movement.quantity)}`);
    }

    const createdMovement: InventoryMovement = {
      ...movement,
      id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };

    if (movement.quantity > 0) {
      const existingTotalValueKobo = multiplyKoboByQty(state.weightedAverageCostKobo, state.currentStock);
      const newInflowValueKobo = movement.totalCostKobo;
      const combinedStock = state.currentStock + movement.quantity;

      if (combinedStock > 0) {
        state.weightedAverageCostKobo = (existingTotalValueKobo + newInflowValueKobo) / BigInt(combinedStock);
      }
    }

    state.currentStock += movement.quantity;
    this.movements.push(createdMovement);
    return createdMovement;
  }

  public getProductState(productId: string): ProductInventoryState | undefined {
    return this.productsState.get(productId);
  }

  public clear(): void {
    this.movements = [];
    this.productsState.clear();
  }
}

export const globalInventoryEngine = new InventoryEngine();