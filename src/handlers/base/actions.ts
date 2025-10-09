import { ByteArray, ethereum } from '@graphprotocol/graph-ts';
import { NewZone as NewZoneEvent } from '../../../generated/Actions/Actions';
import { Statistics, Zone } from '../../../generated/schema';
import { Zone as ZoneTemplate } from '../../../generated/templates';

import { BD_ZERO, BI_ONE, BI_ZERO, GENERIC_ENTITY_ID } from '../../constants';
import { normalizeByBNNU } from '../../utils';
import { updateDailyData, updateHourlyData, updateShareAssetsDailyData, updateShareAssetsHourlyData } from '../misc';

export function handleNewZone(event: NewZoneEvent): void {
    const zoneId = event.params.zone.toHex();
    // New zone
    const zone = new Zone(zoneId);
    zone.latitude = normalizeByBNNU(event.params.lat);
    zone.longitude = normalizeByBNNU(event.params.lng);
    zone.symbol = ByteArray.fromHexString(event.params.symbol.toHex()).toString();
    zone.name = ByteArray.fromHexString(event.params.name.toHex()).toString();

    zone.save();

    // Load stats
    let stats = Statistics.load(GENERIC_ENTITY_ID);

    if (stats === null) {
        stats = new Statistics(GENERIC_ENTITY_ID);
        stats.assetsCount = BI_ZERO;
        stats.buyCount = BI_ZERO;
        stats.sellCount = BI_ZERO;
        stats.regionsCount = BI_ZERO;
        stats.totalBuyAmount = BD_ZERO;
        stats.totalSellAmount = BD_ZERO;
        stats.totalTradeAmount = BD_ZERO;
    }

    stats.regionsCount = stats.regionsCount.plus(BI_ONE);
    stats.save();

    ZoneTemplate.create(event.params.zone);
}

export function handleBlockChange(block: ethereum.Block): void {
    updateHourlyData(block);
    updateDailyData(block);
    updateShareAssetsHourlyData(block);
    updateShareAssetsDailyData(block);
}
