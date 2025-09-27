import { assert, describe, test, clearStore, beforeAll, afterAll } from 'matchstick-as/assembly/index';
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { OrderCancelled } from '../generated/schema';
import { OrderCancelled as OrderCancelledEvent } from '../generated/Marketplace/Marketplace';
import { handleOrderCancelled } from '../src/marketplace';
import { createOrderCancelledEvent } from './marketplace-utils';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('Describe entity assertions', () => {
    beforeAll(() => {
        let orderId = Address.fromString('0x0000000000000000000000000000000000000001');
        let newOrderCancelledEvent = createOrderCancelledEvent(orderId);
        handleOrderCancelled(newOrderCancelledEvent);
    });

    afterAll(() => {
        clearStore();
    });

    // For more test scenarios, see:
    // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

    test('OrderCancelled created and stored', () => {
        assert.entityCount('OrderCancelled', 1);

        // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
        assert.fieldEquals(
            'OrderCancelled',
            '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
            'orderId',
            '0x0000000000000000000000000000000000000001',
        );

        // More assert options:
        // https://thegraph.com/docs/en/developer/matchstick/#asserts
    });
});
