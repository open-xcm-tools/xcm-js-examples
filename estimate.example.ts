import {parachainUniversalLocation} from '@open-xcm-tools/simple-xcm';
import {Estimator} from '@open-xcm-tools/xcm-estimate';
import {
  AssetId,
  ChainIdentity,
  ChainInfo,
  InteriorLocation,
} from '@open-xcm-tools/xcm-types';
import {Keyring, WsProvider} from '@polkadot/api';
import {ApiPromise} from '@polkadot/api/promise';

void (async () => {
  const providerAssetHub = new WsProvider(
    'wss://asset-hub-polkadot-rpc.dwellir.com',
  );
  const assetHubApi = await ApiPromise.create({provider: providerAssetHub});

  const keyring = new Keyring({type: 'sr25519'});

  const alice = keyring.addFromUri('//Alice');

  const xcmVersion = 4;
  const chainIdentity = <ChainIdentity>{
    name: 'AssetHub',
    universalLocation: parachainUniversalLocation('polkadot', 1000n),
  };
  const estimator = new Estimator(assetHubApi, chainIdentity, xcmVersion);

  const tx = assetHubApi.tx.polkadotXcm.transferAssets(
    {
      V4: {
        parents: 1,
        interior: 'here',
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
            interior: {X2: [{PalletInstance: 50}, {GeneralIndex: 3}]},
          },
          fun: {
            Fungible: 100000000,
          },
        },
      ],
    },
    0,
    'Unlimited',
  );

  const estimatedFees = await estimator.estimateExtrinsicFees(
    // needs to be renamed after release to tryEstimateExtrinsicFees
    {System: {Signed: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'}},
    tx,
    <AssetId>{
      parents: 1n,
      interior: {
        x3: [{parachain: 1000n}, {palletInstance: 50n}, {generalIndex: 3n}],
      },
    },
    {
      estimatorResolver: (universalLocation: InteriorLocation) =>
        Estimator.connect(<ChainInfo>{
          identity: chainIdentity,
          endpoints: ['wss://asset-hub-polkadot-rpc.dwellir.com'],
        }),
    },
  );

  console.log(`Estimated fee value: ${estimatedFees}`);
})();