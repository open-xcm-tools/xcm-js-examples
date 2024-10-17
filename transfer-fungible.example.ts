import {Registry, parachainUniversalLocation, relaychainUniversalLocation} from '@open-xcm-tools/simple-xcm';
import {location, universalLocation} from '@open-xcm-tools/xcm-util/common';

const BDK_URL = process.env.BDK_URL!;
  
void (async () => {
    const registry = new Registry()
      .addChain({
        identity: {
          name: 'Polkadot',
          universalLocation: relaychainUniversalLocation('westend'),
        },
        endpoints: [`${BDK_URL}/relay/`],
      })
      .addChain({
        identity: {
          name: 'AssetHubA',
          universalLocation: parachainUniversalLocation('westend', 2001n),
        },
        endpoints: [`${BDK_URL}/relay-assethubA/`],
      })
      .addChain({
        identity: {
          name: 'AssetHubB',
          universalLocation: parachainUniversalLocation('westend', 2002n),
        },
        endpoints: [`${BDK_URL}/relay-assethubB/`],
      })
      .addChain({
        identity: {
          name: 'AssetHubC',
          universalLocation: parachainUniversalLocation('westend', 2003n),
        },
        endpoints: [`${BDK_URL}/relay-assethubC/`],
      })
      .addCurrency({
        symbol: 'AHST',
        decimals: 6,
        universalLocation: universalLocation('westend', [
          {parachain: 2001n},
          {palletInstance: 50n},
          {generalIndex: 1984n},
        ]),
      })
      .addRelativeLocation(
        'Alice',
        location(0n, [
          {
            accountId32: {
              id: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
            },
          },
        ]),
      );

    await registry.addNativeCurrency('Polkadot');

    let xcm = await registry.connectXcm('AssetHubA');
    console.log('XCM version:', xcm.xcmVersion);

    let transferTx = await xcm.composeTransfer({
      origin: 'Alice',
      assets: [
        xcm.adjustedFungible('AHST', '30'),
      ],
      feeAssetId: 'AHST',
      destination: 'AssetHubB',
      beneficiary: 'Alice',
    });

    console.log(transferTx.method.toHex());

    await xcm.disconnect();

    xcm = await registry.connectXcm('AssetHubB');
    console.log('XCM version:', xcm.xcmVersion);

    transferTx = await xcm.composeTransfer({
      origin: 'Alice',
      assets: [
        xcm.adjustedFungible('AHST', '10'),
      ],
      feeAssetId: 'AHST',
      destination: 'AssetHubC',
      beneficiary: 'Alice',
    });

    console.log(transferTx.method.toHex());

})();
  