import {
  asset,
  convertAssetVersion,
  convertLocationVersion,
  fungible,
  location,
} from "@open-xcm-tools/xcm-util";
import { Asset, Location } from "@open-xcm-tools/xcm-types";
import { stringify } from "@polkadot/util";

void (() => {
  const locationV4: Location = location(1n, [
    { parachain: 1000n },
    { palletInstance: 50n },
    { generalIndex: 3n },
  ]);

  const locationV2 = convertLocationVersion(2, locationV4);

  console.log(`Converted location: ${stringify(locationV2, 2)}`);

  const assetV4 = <Asset>{ id: locationV4, fun: fungible(10n) };

  const assetV2 = convertAssetVersion(2, assetV4);

  console.log(`Converted asset: ${stringify(assetV2, 2)}`);
})();
