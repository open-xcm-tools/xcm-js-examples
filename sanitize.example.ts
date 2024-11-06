import {location, sanitizeLocation} from '@open-xcm-tools/xcm-util';

void (() => {
  let locations = [
    location(1n, [
      {parachain: 1000n},
      {
        accountId32: {
          id: '0x006ddf51db56437ce5c886ab28cd767fc85ad5cc5d4a679376a1f7e71328b501',
        },
      },
    ]),
    location(1n, [
      {parachain: 1000n},
      {accountId32: {id: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'}},
    ]),
    location(0n, [
      {parachain: 1000n},
      {palletInstance: 50n},
      {generalIndex: 2002n},
    ]),
  ];

  locations.forEach(sanitizeLocation);

  console.log(
    `Sorted assets array: ${JSON.stringify(locations, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 4)}`,
  );

  locations = [
    location(1n, [
      {parachain: 1000000000000000n},
      {palletInstance: 50n},
      {generalIndex: 1984n},
    ]),
    location(0n, [
      {parachain: 1000n},
      {palletInstance: 50n},
      {generalIndex: 2002n},
    ]),
  ];

  locations.forEach(sanitizeLocation); /// ERROR
})();
