import { Address, BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { BD_ZERO, BI_ONE, FULFILLED_ORDERS, GENERIC_ENTITY_ID, ONE_DAY, ONE_HOUR } from '../../constants';
import {
    DailyData,
    HourlyData,
    ShareAssetDailyData,
    ShareAssetHourlyData,
    Statistics,
} from '../../../generated/schema';
import { LRShare } from '../../../generated/templates/Zone/LRShare';
import { normalizeByExp } from '../../utils';

export function updateHourlyData(block: ethereum.Block): HourlyData | null {
    const timestamp = block.timestamp.toI32();
    const hourId = Math.floor(timestamp / ONE_HOUR);
    const hourTimestamp = hourId * ONE_HOUR;
    const statistics = Statistics.load(GENERIC_ENTITY_ID);

    if (statistics === null) return null;

    let hourlyData = HourlyData.load(hourId.toString());
    if (hourlyData === null) {
        hourlyData = new HourlyData(hourId.toString());
        hourlyData.timestampInMilliseconds = BigInt.fromI32((hourTimestamp * 1000) as i32);
    }

    hourlyData.totalBuyAmount = statistics.totalBuyAmount;
    hourlyData.totalSellAmount = statistics.totalSellAmount;
    hourlyData.save();
    return hourlyData;
}

export function updateDailyData(block: ethereum.Block): DailyData | null {
    const timestamp = block.timestamp.toI32();
    const dayId = Math.floor(timestamp / ONE_DAY);
    const dayTimestamp = dayId * ONE_DAY;
    const statistics = Statistics.load(GENERIC_ENTITY_ID);

    if (statistics === null) return null;

    let dailyData = DailyData.load(dayId.toString());
    if (dailyData === null) {
        dailyData = new DailyData(dayId.toString());
        dailyData.timestampInMilliseconds = BigInt.fromI32((dayTimestamp * 1000) as i32);
    }

    dailyData.totalBuyAmount = statistics.totalBuyAmount;
    dailyData.totalSellAmount = statistics.totalSellAmount;
    dailyData.save();
    return dailyData;
}

export function updateShareAssetsHourlyData(block: ethereum.Block): string[] {
    const timestamp = block.timestamp.toI32();
    const hourId = Math.floor(timestamp / ONE_HOUR);
    const hourTimestamp = hourId * ONE_HOUR;
    const tracked: Set<string> = new Set();
    const totalBuys: Map<string, BigDecimal> = new Map();
    const totalSells: Map<string, BigDecimal> = new Map();

    for (let i = 0; i < FULFILLED_ORDERS.length; i++) {
        const order = FULFILLED_ORDERS[i];
        const value = order.unitAmount.times(order.volume);
        let buyValue: BigDecimal = totalBuys.get(order.shareAsset) || BD_ZERO;
        let sellValue: BigDecimal = totalSells.get(order.shareAsset) || BD_ZERO;

        if (order.orderType === 'BUY') buyValue = buyValue.plus(value);
        if (order.orderType === 'SELL') sellValue = sellValue.plus(value);

        totalBuys.set(order.shareAsset, buyValue);
        totalSells.set(order.shareAsset, sellValue);

        if (!tracked.has(order.shareAsset)) tracked.add(order.shareAsset);
    }

    const trackedValues = tracked.values();

    for (let i = 0; i < trackedValues.length; i++) {
        const shareId = trackedValues[i];
        const itemId = shareId + '-' + hourId.toString();
        let shareAssetHourlyData = ShareAssetHourlyData.load(itemId);
        if (shareAssetHourlyData === null) {
            shareAssetHourlyData = new ShareAssetHourlyData(itemId);
            shareAssetHourlyData.shareAsset = shareId;
            shareAssetHourlyData.timestampInMilliseconds = BigInt.fromI32((hourTimestamp * 1000) as i32);
        }
        shareAssetHourlyData.totalBuyAmount = totalBuys.get(shareId);
        shareAssetHourlyData.totalSellAmount = totalSells.get(shareId);
        // Price
        const shareContract = LRShare.bind(Address.fromString(shareId));
        const obsLength = shareContract.observationsLength();
        const obs = shareContract.observations(obsLength.minus(BI_ONE));
        const price = normalizeByExp(obs.getCurrentPrice(), shareContract.peggedAssetDecimals() as u8);
        shareAssetHourlyData.price = price;
        shareAssetHourlyData.save();
    }

    return trackedValues;
}

export function updateShareAssetsDailyData(block: ethereum.Block): string[] {
    const timestamp = block.timestamp.toI32();
    const dayId = Math.floor(timestamp / ONE_DAY);
    const dayTimestamp = dayId * ONE_DAY;
    const tracked: Set<string> = new Set();
    const totalBuys: Map<string, BigDecimal> = new Map();
    const totalSells: Map<string, BigDecimal> = new Map();

    for (let i = 0; i < FULFILLED_ORDERS.length; i++) {
        const order = FULFILLED_ORDERS[i];
        const value = order.unitAmount.times(order.volume);
        let buyValue: BigDecimal = totalBuys.get(order.shareAsset) || BD_ZERO;
        let sellValue: BigDecimal = totalSells.get(order.shareAsset) || BD_ZERO;

        if (order.orderType === 'BUY') buyValue = buyValue.plus(value);
        if (order.orderType === 'SELL') sellValue = sellValue.plus(value);

        totalBuys.set(order.shareAsset, buyValue);
        totalSells.set(order.shareAsset, sellValue);

        if (!tracked.has(order.shareAsset)) tracked.add(order.shareAsset);
    }

    const trackedValues = tracked.values();

    for (let i = 0; i < trackedValues.length; i++) {
        const shareId = trackedValues[i];
        const itemId = shareId + '-' + dayId.toString();
        let shareAssetDailyData = ShareAssetDailyData.load(itemId);
        if (shareAssetDailyData === null) {
            shareAssetDailyData = new ShareAssetDailyData(itemId);
            shareAssetDailyData.shareAsset = shareId;
            shareAssetDailyData.timestampInMilliseconds = BigInt.fromI32((dayTimestamp * 1000) as i32);
        }
        shareAssetDailyData.totalBuyAmount = totalBuys.get(shareId);
        shareAssetDailyData.totalSellAmount = totalSells.get(shareId);
        // Price
        const shareContract = LRShare.bind(Address.fromString(shareId));
        const obsLength = shareContract.observationsLength();
        const obs = shareContract.observations(obsLength.minus(BI_ONE));
        const price = normalizeByExp(obs.getCurrentPrice(), shareContract.peggedAssetDecimals() as u8);
        shareAssetDailyData.price = price;
        shareAssetDailyData.save();
    }

    return trackedValues;
}
