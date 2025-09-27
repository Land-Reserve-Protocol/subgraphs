import { OrderCreated as OrderCreatedEvent } from '../../../generated/Marketplace/Marketplace';
import { Order } from '../../../generated/schema';
import { LRShare } from '../../../generated/templates/Zone/LRShare';
import { Order as OrderTemplate } from '../../../generated/templates';
import { deriveOrderType, normalizeByBNNU, normalizeByExp } from '../../utils';

export function handleOrderCreated(event: OrderCreatedEvent): void {
    const orderId = event.params.orderId.toHex();
    const shareAsset = event.params.shareToken;
    // Share contract
    const shareContract = LRShare.bind(shareAsset);
    // Pegged asset decimals
    const decimals = shareContract.peggedAssetDecimals() as u8;
    // Create new order
    const order = new Order(orderId);
    order.creator = event.transaction.from;
    order.shareAsset = shareAsset.toHex();
    order.status = 'PENDING';
    order.unitAmount = normalizeByExp(event.params.unitAmount, decimals);
    order.orderType = deriveOrderType(event.params.orderType as u32);
    order.volume = normalizeByBNNU(event.params.volume);

    order.save();
    OrderTemplate.create(event.params.orderId);
}
