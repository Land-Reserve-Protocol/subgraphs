import { Order, Statistics } from '../../../generated/schema';
import { Fulfilled as FulfilledEvent, Cancelled as CancelledEvent } from '../../../generated/templates/Order/Order';
import { BI_ONE, FULFILLED_ORDERS, GENERIC_ENTITY_ID } from '../../constants';

export function handleFulfillment(event: FulfilledEvent): void {
    const orderId = event.address.toHex();
    const order = Order.load(orderId) as Order;
    order.status = 'FULFILLED';
    order.conclusionTimestamp = event.params.timestamp;
    order.save();

    // Save in fulfilled orders array
    FULFILLED_ORDERS.push(order);

    // Update statistics
    const stats = Statistics.load(GENERIC_ENTITY_ID) as Statistics;
    const value = order.unitAmount.times(order.volume);

    if (order.orderType === 'BUY') {
        stats.buyCount = stats.buyCount.plus(BI_ONE);
        stats.totalBuyAmount = stats.totalBuyAmount.plus(value);
    }

    if (order.orderType === 'SELL') {
        stats.sellCount = stats.sellCount.plus(BI_ONE);
        stats.totalSellAmount = stats.totalSellAmount.plus(value);
    }

    stats.totalTradeAmount = stats.totalSellAmount.plus(stats.totalBuyAmount);
    stats.save();
}

export function handleCancellation(event: CancelledEvent): void {
    const orderId = event.address.toHex();
    const order = Order.load(orderId) as Order;
    order.status = 'CANCELLED';
    order.conclusionTimestamp = event.params.timestamp;
    order.save();
}
