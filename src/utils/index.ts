import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { BASE_NON_NATIVE_UNIT, BD_ZERO } from '../constants';

export function normalizeByBNNU(num: BigInt): BigDecimal {
    // Convert to BigDecimal
    const numBD = num.toBigDecimal();
    const bnnuBD = BASE_NON_NATIVE_UNIT.toBigDecimal();
    return numBD.div(bnnuBD);
}

export function normalizeByExp(num: BigInt, exp: u8 | BigInt = BigInt.fromI64(18)): BigDecimal {
    if (typeof exp !== 'number') exp = parseInt(exp.toHex(), 16) as u8;
    // Convert to BigDecimal
    const numBD = num.toBigDecimal();
    const pow = BigInt.fromI64(10).pow(exp);
    return numBD.div(pow.toBigDecimal());
}

export function deriveAssetType(cmd: BigInt): string {
    let assetType = 'Residential';
    const cmdNormalized = normalizeByBNNU(cmd);

    if (cmdNormalized.equals(BD_ZERO)) assetType = 'Residential';
    if (cmdNormalized.equals(BigDecimal.fromString('0.4'))) assetType = 'Commercial';
    if (cmdNormalized.equals(BigDecimal.fromString('0.6'))) assetType = 'Industrial';
    if (cmdNormalized.equals(BigDecimal.fromString('0.1'))) assetType = 'Agricultural';

    return assetType;
}

export function deriveOrderType(typ: number): string {
    switch (typ) {
        case 0:
            return 'BUY';
        case 1:
            return 'SELL';
        default:
            return 'BUY';
    }
}
