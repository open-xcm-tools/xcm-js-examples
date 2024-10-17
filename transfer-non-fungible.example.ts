import {Registry, parachainUniversalLocation, relaychainUniversalLocation} from '@open-xcm-tools/simple-xcm';
import {asset, location, nonfungible, universalLocation} from '@open-xcm-tools/xcm-util/common';

void (async () => {
  const registry = new Registry()
  .addChain({
    identity: {
      name: 'Relay',
      universalLocation: relaychainUniversalLocation('westend'),
    },
    endpoints: ['wss://xnft-relay.unique.network'],
  })
  .addChain({
    identity: {
      name: 'AssetHub',
      universalLocation: parachainUniversalLocation('westend', 1000n),
    },
    endpoints: ['wss://xnft-assethub.unique.network'],
  })
  .addChain({
    identity: {
      name: 'Unique',
      universalLocation: parachainUniversalLocation('westend', 2037n),
    },
    endpoints: ['wss://xnft-unique.unique.network'],
  })
  .addCurrency({
    symbol: 'xUSD',
    decimals: 6,
    universalLocation: universalLocation('westend', [
      {parachain: 1000n},
      {palletInstance: 50n},
      {generalIndex: 32n},
    ]),
  })
  .addUniversalLocation(
    'AssetHubNftCollection',
    universalLocation('westend', [
      {parachain: 1000n},
      {palletInstance: 51n},
      {generalIndex: 21n},
    ]),
  )
  .addRelativeLocation(
    'TestAccount',
    location(0n, [
      {
        accountId32: {
          id: '5HMqkp4Zo9oYrWAL2jhi93xSbcLFhfakaqzpomuMTwDQUfMz',
        },
      },
    ]),
  );

  await registry.addNativeCurrency('Relay');
  await registry.addNativeCurrency('Unique');

  let xcm = await registry.connectXcm('AssetHub');
  console.log('XCM version:', xcm.xcmVersion);

  let transferTx = await xcm.composeTransfer({
    origin: 'TestAccount',
    assets: [
      asset('AssetHubNftCollection', nonfungible(111n)),
      xcm.adjustedFungible('xUSD', '10'),
    ],
    feeAssetId: 'xUSD',
    destination: 'Unique',
    beneficiary: 'TestAccount',
  });

  console.log('the composed extrinsic', transferTx.method.toHex());

  await xcm.disconnect();
})();

