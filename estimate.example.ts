import { relaychainUniversalLocation } from "@open-xcm-tools/simple-xcm";
import { Estimator } from "@open-xcm-tools/xcm-estimate";
import { EstimatorResolver } from "@open-xcm-tools/xcm-estimate/estimator";
import {
  AssetId,
  ChainIdentity,
  InteriorLocation,
  Origin,
} from "@open-xcm-tools/xcm-types";
import { compareInteriorLocation } from "@open-xcm-tools/xcm-util";
import { Keyring, WsProvider } from "@polkadot/api";
import { ApiPromise } from "@polkadot/api/promise";
import { stringify } from "@polkadot/util";

// The `Estimator` class provides a comprehensive framework for estimating fees
// and execution effects of XCM programs using Runtime API.

void (async () => {
  const providerRelay = new WsProvider("wss://xnft-relay.unique.network");
  const providerAssetHub = new WsProvider("wss://xnft-assethub.unique.network");

  const relayApi = await ApiPromise.create({ provider: providerRelay });
  const assetHubApi = await ApiPromise.create({ provider: providerAssetHub });

  const keyring = new Keyring({ type: "sr25519" });

  const alice = keyring.addFromUri("//Alice");

  const xcmVersion = 4;
  const chainIdentity = <ChainIdentity>{
    name: "Westend",
    universalLocation: relaychainUniversalLocation("westend"),
  };
  const estimator = new Estimator(relayApi, chainIdentity, xcmVersion);

  // `tx` is the transaction that will trigger XCM interaction with another chain.
  // We will use the `estimator` to estimate the required fees.
  const tx = relayApi.tx.xcmPallet.transferAssets(
    {
      V4: {
        parents: 0,
        interior: { x1: [{ parachain: 1000n }] },
      },
    },
    {
      V4: {
        parents: 0,
        interior: {
          X1: [
            {
              AccountId32: {
                id: alice.addressRaw,
              },
            },
          ],
        },
      },
    },
    {
      V4: [
        {
          id: {
            parents: 0,
            interior: "here",
          },
          fun: {
            Fungible: 5000000000000,
          },
        },
      ],
    },
    0,
    "Unlimited",
  );

  // This account will be used as the origin of the `tx` extrinsic.
  const origin: Origin = { System: { Signed: "5HMqkp4Zo9oYrWAL2jhi93xSbcLFhfakaqzpomuMTwDQUfMz" } }

  // This asset will be used to pay the fees.
  const feeAssetId: AssetId = { parents: 0n, interior: "here" };

  // This function will create an `Estimator` instance based on the `universalLocation`.
  const estimatorResolver: EstimatorResolver = async (universalLocation: InteriorLocation) => {
    if (
        !compareInteriorLocation(universalLocation, <InteriorLocation>{
          x2: [{ globalConsensus: "westend" }, { parachain: 1000n }],
        })
    ) {
      const assetHubXcmVersion = 4;

      return new Estimator(
          assetHubApi,
          {
            name: "AssetHub",
            universalLocation,
          },
          assetHubXcmVersion,
      );
    } else {
      throw Error(`failed to resolve chain api: unknown chain location - ${stringify(universalLocation)}`);
    }
  };

  const estimatedFees = await estimator.tryEstimateExtrinsicFees(
    origin,
    tx,
    feeAssetId,
    { estimatorResolver },
  );

  console.log(`Estimated fee value: ${estimatedFees}`);

  await estimator.disconnect();
})();
