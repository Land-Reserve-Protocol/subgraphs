import { NFT, ShareAsset, Statistics } from '../../../generated/schema';
import { Mint as MintEvent, Transfer as TransferEvent } from '../../../generated/templates/Zone/Zone';
import { LRShare } from '../../../generated/templates/Zone/LRShare';
import { ADDRESS_ZERO, BI_ONE, GENERIC_ENTITY_ID } from '../../constants';
import { deriveAssetType } from '../../utils';

export function handleMint(event: MintEvent): void {
    const zoneId = event.address.toHex();
    const tokenId = zoneId + '-' + event.params.tokenId.toString();
    // New NFT
    const nft = new NFT(tokenId);
    nft.zone = zoneId;
    nft.metadataURI = event.params.metadataURI;
    nft.isActive = true;

    nft.save();

    // Share token
    const shareAssetId = event.params.shareToken.toHex();
    const shareAssetContract = LRShare.bind(event.params.shareToken); //  Bind contract
    const shareAsset = new ShareAsset(shareAssetId);
    shareAsset.asset = tokenId;
    shareAsset.name = shareAssetContract.name();
    shareAsset.symbol = shareAssetContract.symbol();
    shareAsset.peggedAsset = shareAssetContract.peggedAsset().toHex();
    shareAsset.currentTradeIndex = shareAssetContract.observationsLength().minus(BI_ONE);
    shareAsset.assetType = deriveAssetType(shareAssetContract.categoryMultiplierDelta());

    shareAsset.save();

    // Statistics
    const stats = Statistics.load(GENERIC_ENTITY_ID) as Statistics; // Won't be null
    stats.assetsCount = stats.assetsCount.plus(BI_ONE);
    stats.save();
}

export function handleTransfer(event: TransferEvent): void {
    const to = event.params.to.toHex();
    const isBurn = to === ADDRESS_ZERO;
    // We only care about the burn event
    if (!isBurn) return;

    const zoneId = event.address.toHex();
    const tokenId = zoneId + '-' + event.params.tokenId.toString();
    const nft = NFT.load(tokenId) as NFT; // Won't be null;
    nft.isActive = false;

    nft.save();

    // Update stats
    const stats = Statistics.load(GENERIC_ENTITY_ID) as Statistics;
    stats.assetsCount = stats.assetsCount.minus(BI_ONE);
    stats.save();
}
