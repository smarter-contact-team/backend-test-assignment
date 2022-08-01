import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";

import { RequestService } from "./RequestService";
import { VeriPhoneService } from "./VeriPhoneService";
import { Contacts } from "../storage/entities/Contacts";

export interface IContactService {
    verifyAndUpload(contacts: Array<Contacts>): Promise<Array<Contacts>>;
}

export class ContactService implements IContactService {
    constructor(private readonly dbContext: MikroORM<IDatabaseDriver<Connection>>) { }

    public async verifyAndUpload(contacts: Array<Contacts>): Promise<Array<Contacts>> {

        for await (const contact of contacts) {
            const requestService = new RequestService();
            const veriPhoneService = new VeriPhoneService(requestService, process.env.VERIPHONE_API_KEY ?? "");

            const response = await veriPhoneService.verify(contact.phone);
            contact.isValid = response.phone_valid;

            await this.dbContext.em.persistAndFlush(contacts);
        }

        return await this.dbContext.em.find(Contacts, { isValid: true });
    }
}