import { assert, describe, test, clearStore, beforeAll, afterAll } from 'matchstick-as/assembly/index';
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { ExampleEntity } from '../generated/schema';
import { NewZone } from '../generated/Actions/Actions';
import { handleNewZone } from '../src/handlers/base/actions';
import { createNewZoneEvent } from './actions-utils';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('Describe entity assertions', () => {
    beforeAll(() => {
        let zone = Address.fromString('0x0000000000000000000000000000000000000001');
        let name = 'Example string value';
        let symbol = 'Example string value';
        let lat = BigInt.fromI32(234);
        let lng = BigInt.fromI32(234);
        let newNewZoneEvent = createNewZoneEvent(zone, name, symbol, lat, lng);
        handleNewZone(newNewZoneEvent);
    });

    afterAll(() => {
        clearStore();
    });

    // For more test scenarios, see:
    // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

    test('ExampleEntity created and stored', () => {
        assert.entityCount('ExampleEntity', 1);

        // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
        assert.fieldEquals(
            'ExampleEntity',
            '0xa16081f360e3847006db660bae1c6d1b2e17ec2a',
            'zone',
            '0x0000000000000000000000000000000000000001',
        );
        assert.fieldEquals(
            'ExampleEntity',
            '0xa16081f360e3847006db660bae1c6d1b2e17ec2a',
            'name',
            'Example string value',
        );
        assert.fieldEquals(
            'ExampleEntity',
            '0xa16081f360e3847006db660bae1c6d1b2e17ec2a',
            'symbol',
            'Example string value',
        );
        assert.fieldEquals('ExampleEntity', '0xa16081f360e3847006db660bae1c6d1b2e17ec2a', 'lat', '234');
        assert.fieldEquals('ExampleEntity', '0xa16081f360e3847006db660bae1c6d1b2e17ec2a', 'lng', '234');

        // More assert options:
        // https://thegraph.com/docs/en/developer/matchstick/#asserts
    });
});
