import {
  Registry,
  parachainUniversalLocation,
  relaychainUniversalLocation,
} from "@open-xcm-tools/simple-xcm";
import { NetworkId } from "@open-xcm-tools/xcm-types";
import {
  asset,
  location,
  nonfungible,
  universalLocation,
} from "@open-xcm-tools/xcm-util/common";

void (async () => {
  const WESTEND_NETWORK_ID: NetworkId = {
    byGenesis:
      '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
  };

  // The `Registry` stores information about chains, currencies, and locations in general.
  // This info is used by the `SimpleXcm` to connect to the chains
  // and compute the locations based on its in-registry name.
  const registry = new Registry()
    .addChain({
      identity: {
        name: "Relay",
        universalLocation: relaychainUniversalLocation(WESTEND_NETWORK_ID),
      },
      endpoints: ["wss://xnft-relay.unique.network"],
    })
    .addChain({
      identity: {
        name: "AssetHub",
        universalLocation: parachainUniversalLocation(WESTEND_NETWORK_ID, 1000n),
      },
      endpoints: ["wss://xnft-assethub.unique.network"],
    })
    .addChain({
      identity: {
        name: "Unique",
        universalLocation: parachainUniversalLocation(WESTEND_NETWORK_ID, 2037n),
      },
      endpoints: ["wss://xnft-unique.unique.network"],
    })
    .addCurrency({
      symbol: "xUSD",
      decimals: 6,
      universalLocation: universalLocation(WESTEND_NETWORK_ID, [
        { parachain: 1000n },
        { palletInstance: 50n },
        { generalIndex: 32n },
      ]),
    })
    .addUniversalLocation(
      "UniqueNftCollection",
      universalLocation(WESTEND_NETWORK_ID, [
        { parachain: 2037n },
        { generalIndex: 3n },
      ]),
    )
    .addRelativeLocation(
      "TestAccount",
      location(0n, [
        {
          accountId32: {
            id: "5HMqkp4Zo9oYrWAL2jhi93xSbcLFhfakaqzpomuMTwDQUfMz",
          },
        },
      ]),
    );

  await registry.addNativeCurrency("Relay");
  await registry.addNativeCurrency("Unique");

  let xcm = await registry.connectXcm("Unique");
  console.log("XCM version:", xcm.xcmVersion);

  // The `transferTx` will contain not only the assets you want to transfer but also the necessary fees.
  // All the in-registry names will be automatically transformed into the corresponding locations
  // The origin location will be converted into the account to form a signed origin.
  let transferTx = await xcm.composeTransfer({
    origin: "TestAccount",
    assets: [
      asset("UniqueNftCollection", nonfungible(2n)),
      xcm.adjustedFungible("UNQ", "20"), // `adjustedFungible` will take into account the decimals to form 20 UNQ.
    ],
    feeAssetId: "UNQ",
    destination: "AssetHub",
    beneficiary: "TestAccount",
  });

  console.log("the composed extrinsic", transferTx.submittableExtrinsic.method.toHex());

  await xcm.finalize();
})();
