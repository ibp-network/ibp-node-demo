## IBP Node PoC Demo

1. Import the IBP treasury account using the seed shared in the IBP DAO channel.
2. Create two accounts for the IBP member and monitor on your PJS browser extension, note the seed phrase of the monitor account. Allow use on any chain for both accounts.
4. Go to [IBP Node PJS](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.helikon.io%2Fibp-demo#/accounts) and fund your member & monitor accounts from the treasury account.
5. Go to the [extrinsics tab](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.helikon.io%2Fibp-demo#/extrinsics), and submit an `ibp.registerMember` extrinsic with the member name to register your member account.
6. Submit `ibp.registerMemberService` extrinsic(s) to define your services. For `serviceId`, use `0` for Kusama, `1` for Polkadot and `2` for Westend (you can view defined services by querying the `ibp.services` storage). For address, enter your domain. For port enter `443` for basic SSL. Service path comes from the on-chain service definition.
7. Register your monitor account using the `ibp.registerMonitor` extrinsic. Sign it with your member account, and select your monitor account for the account parameter.
8. Clone this repo `git clone https://github.com/ibp-network/ibp-node-demo.git`.
9. Edit the `MONITOR_SEED_PHRASE` constant in file `src/client/ibp-demo.ts` and set it to your monitor account seed phrase.
10. Run the app with `npm install && npm run dev`, view it at [http://localhost:8080](http://localhost:8080).
11. Click on the monitor button to run the health check on a randomly selected member node.