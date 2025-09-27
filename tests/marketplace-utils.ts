import { newMockEvent } from 'matchstick-as';
import { ethereum, Address, BigInt } from '@graphprotocol/graph-ts';
import { OrderCancelled, OrderCreated, OrderFulfilled, Paused, Unpaused } from '../generated/Marketplace/Marketplace';

export function createOrderCancelledEvent(orderId: Address): OrderCancelled {
    let orderCancelledEvent = changetype<OrderCancelled>(newMockEvent());

    orderCancelledEvent.parameters = new Array();

    orderCancelledEvent.parameters.push(new ethereum.EventParam('orderId', ethereum.Value.fromAddress(orderId)));

    return orderCancelledEvent;
}

export function createOrderCreatedEvent(
    orderId: Address,
    orderType: i32,
    volume: BigInt,
    shareToken: Address,
    unitAmount: BigInt,
): OrderCreated {
    let orderCreatedEvent = changetype<OrderCreated>(newMockEvent());

    orderCreatedEvent.parameters = new Array();

    orderCreatedEvent.parameters.push(new ethereum.EventParam('orderId', ethereum.Value.fromAddress(orderId)));
    orderCreatedEvent.parameters.push(
        new ethereum.EventParam('orderType', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(orderType))),
    );
    orderCreatedEvent.parameters.push(new ethereum.EventParam('volume', ethereum.Value.fromUnsignedBigInt(volume)));
    orderCreatedEvent.parameters.push(new ethereum.EventParam('shareToken', ethereum.Value.fromAddress(shareToken)));
    orderCreatedEvent.parameters.push(
        new ethereum.EventParam('unitAmount', ethereum.Value.fromUnsignedBigInt(unitAmount)),
    );

    return orderCreatedEvent;
}

export function createOrderFulfilledEvent(orderId: Address): OrderFulfilled {
    let orderFulfilledEvent = changetype<OrderFulfilled>(newMockEvent());

    orderFulfilledEvent.parameters = new Array();

    orderFulfilledEvent.parameters.push(new ethereum.EventParam('orderId', ethereum.Value.fromAddress(orderId)));

    return orderFulfilledEvent;
}

export function createPausedEvent(account: Address): Paused {
    let pausedEvent = changetype<Paused>(newMockEvent());

    pausedEvent.parameters = new Array();

    pausedEvent.parameters.push(new ethereum.EventParam('account', ethereum.Value.fromAddress(account)));

    return pausedEvent;
}

export function createUnpausedEvent(account: Address): Unpaused {
    let unpausedEvent = changetype<Unpaused>(newMockEvent());

    unpausedEvent.parameters = new Array();

    unpausedEvent.parameters.push(new ethereum.EventParam('account', ethereum.Value.fromAddress(account)));

    return unpausedEvent;
}
