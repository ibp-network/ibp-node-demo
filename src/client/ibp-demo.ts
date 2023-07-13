import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/api';

const MONITOR_SEED_PHRASE = 'fringe practice two entire patch empty fruit orchard razor diamond almost train';

interface UI {
    services: HTMLElement;
    members: HTMLElement;
    memberServices: HTMLElement;
    checks: HTMLElement;
    checkButton: HTMLElement;
}

class IBPDemo {
    private readonly ui: UI;
    private services: [] = [];
    private members: [] = [];
    private memberServices: [] = [];

    constructor() {
        this.ui = {
            services: <HTMLElement>document.getElementById('services'),
            members: <HTMLElement>document.getElementById('members'),
            memberServices: <HTMLElement>document.getElementById('member-services'),
            checks: <HTMLElement>document.getElementById('checks'),
            checkButton: <HTMLElement>document.getElementById('check-button'),
        };
        this.ui.checkButton.addEventListener('click', async (event) => {
            await this.runHealthCheck();
        });
    }

    async init() {
        const wsProvider = new WsProvider('wss://rpc.helikon.io/ibp-demo');
        const api = await ApiPromise.create({ provider: wsProvider });

        // services
        const serviceCount = (await api.query.ibp.serviceCount()).toJSON();
        var servicesHTML = '';
        if (!serviceCount) {
            servicesHTML = 'No services defined.';
        } else {
            for (var i = 0; i < (serviceCount as number); i++) {
                const service = (await api.query.ibp.services(i)).toHuman();
                // @ts-ignore
                this.services.push(service);
                // @ts-ignore
                servicesHTML += `#${service.id} :: ${service.ty} :: ${service.name}<br>`;
            }
        }
        this.ui.services.innerHTML = servicesHTML;

        // members
        const memberEntries = await api.query.ibp.members.entries();
        var membersHTML = '';
        if (memberEntries.length == 0) {
            membersHTML = 'No members defined.';
        } else {
            for (var i = 0; i < memberEntries.length; i++) {
                const accountId = memberEntries[i][0].toHuman();
                const member = memberEntries[i][1].toHuman();
                // @ts-ignore
                this.members.push(member);
                // @ts-ignore
                membersHTML += `#${member.id} :: ${accountId} :: ${member.name}<br>`;
            }
        }
        this.ui.members.innerHTML = membersHTML;

        // member services
        const memberServiceEntries = await api.query.ibp.memberServices.entries();
        var memberServicesHTML = '';
        if (memberServiceEntries.length == 0) {
            memberServicesHTML = 'No member services defined.';
        } else {
            for (var i = 0; i < memberServiceEntries.length; i++) {
                const key = memberServiceEntries[i][0].toHuman();
                const memberService = memberServiceEntries[i][1].toHuman();
                // @ts-ignore
                this.memberServices.push(memberService);
                // @ts-ignore
                memberServicesHTML += `#${memberService.id} :: ${memberService.name} @ ${memberService.address}:${memberService.port}<br>`;
            }
        }
        this.ui.memberServices.innerHTML = memberServicesHTML;
    }

    public async runHealthCheck() {
        if (this.memberServices.length == 0) {
            this.ui.checks.innerHTML = `-`;
            return;
        }
        const memberService = this.memberServices[Math.floor(Math.random() * this.memberServices.length)];
        // @ts-ignore
        this.ui.checks.innerHTML = `Running random health check for ${memberService.name}.`;
        // @ts-ignore
        const service = this.services.find((service) => service.id == memberService.serviceId);
        // @ts-ignore
        const member = this.members.find((member) => member.id == memberService.memberId);
        // @ts-ignore
        const url = `wss://${memberService.address}:${memberService.port}/${service.urlPath}`;
        // const url = `wss://rpc.helikon.io:${memberService.port}/${service.urlPath}`;
        const serviceProvider = new WsProvider(url);
        const serviceApi = await ApiPromise.create({ provider: serviceProvider });

        const start = new Date().getTime();
        const health = (await serviceApi.rpc.system.health()).toHuman();
        const end = new Date().getTime();
        // @ts-ignore
        var html = `${member.name} :: ${memberService.name} health check:  ${JSON.stringify(health)}.`;
        this.ui.checks.innerHTML = html;

        const wsProvider = new WsProvider('wss://rpc.helikon.io/ibp-demo');
        const api = await ApiPromise.create({ provider: wsProvider });

        const keyring = new Keyring({ type: 'sr25519' });
        const monitor = keyring.addFromUri(MONITOR_SEED_PHRASE);
        const txHash = await api.tx.ibp
            // @ts-ignore
            .submitHealthCheck(memberService.id, start, true, (end - start))
            .signAndSend(monitor);
        html += `<br>Tx submitted with hash ${txHash.toHuman()}`;
        this.ui.checks.innerHTML = html;
    }
}

export { IBPDemo };
