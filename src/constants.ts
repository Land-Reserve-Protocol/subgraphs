import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { Order } from '../generated/schema';

export const BASE_NON_NATIVE_UNIT = BigInt.fromI64(10_000);
export const GENERIC_ENTITY_ID = '1';

// BigInts
export const BI_ZERO = BigInt.fromI64(0);
export const BI_ONE = BigInt.fromI64(1);
export const BI_TWO = BigInt.fromI64(2);

// BigDecimals
export const BD_ZERO = BigDecimal.fromString('0');
export const BD_ONE = BigDecimal.fromString('1');
export const BD_TWO = BigDecimal.fromString('2');

// Temporal
export const ONE_HOUR = BigInt.fromI64(3600);
export const ONE_DAY = BigInt.fromI64(86400);

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

// Useful data stores
export const FULFILLED_ORDERS: Array<Order> = new Array();
