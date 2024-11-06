import { VersionedAssets } from "@open-xcm-tools/xcm-types";
import { sortAndDeduplicateVersionedAssets } from "@open-xcm-tools/xcm-util";
import { stringify } from "@polkadot/util";

void (() => {
  const assetArray: VersionedAssets = {
    v4: [
      {
        id: {
          parents: 1n,
          interior: {
            x3: [
              { parachain: 2002n },
              { palletInstance: 50n },
              { generalIndex: 1002n },
            ],
          },
        },
        fun: { fungible: 1000000n },
      },
      {
        id: {
          parents: 0n,
          interior: "here",
        },
        fun: { nonFungible: { array4: new Uint8Array([10, 20, 30, 40]) } },
      },
      {
        id: {
          parents: 1n,
          interior: {
            x2: [{ parachain: 2002n }, { generalIndex: 1002n }],
          },
        },
        fun: { nonFungible: "undefined" },
      },
      {
        id: {
          parents: 1n,
          interior: {
            x3: [
              { parachain: 2002n },
              { palletInstance: 50n },
              { generalIndex: 1002n },
            ],
          },
        },
        fun: { fungible: 3000000n },
      },
      {
        id: {
          parents: 1n,
          interior: {
            x2: [{ parachain: 2002n }, { generalIndex: 1002n }],
          },
        },
        fun: { nonFungible: "undefined" },
      },
    ],
  };

  sortAndDeduplicateVersionedAssets(assetArray);
  console.log(`Sorted assets array: ${stringify(assetArray, 2)}`);
})();
