import {
  asset,
  convertAssetVersion,
  convertLocationVersion,
  fungible,
  location,
} from '@open-xcm-tools/xcm-util';
import {Asset, Location} from '@open-xcm-tools/xcm-types';

void (() => {
  const locationV4: Location = location(1n, [
    {parachain: 1000n},
    {palletInstance: 50n},
    {generalIndex: 3n},
  ]);

  const locationV2 = convertLocationVersion(2, locationV4);

  console.log(
    `Converted location: ${JSON.stringify(locationV2, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 4)}`,
  );

  const assetV4 = <Asset>{id: locationV4, fun: fungible(10n)};

  const assetV2 = convertAssetVersion(2, assetV4);

  console.log(
    `Converted asset: ${JSON.stringify(assetV2, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 4)}`,
  );
})();
