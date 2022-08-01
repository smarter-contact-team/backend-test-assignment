import fp from "fastify-plugin";

import { CsvWorker } from "../extra/CsvWorker";
import { Contacts } from "../storage/entities/Contacts";
import { ContactService } from "../services/ContactService";

class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

export default fp(async (server: any, opts: any, next: any) => {
    server.post("/upload", {}, async (request: any, reply: any) => {
        try {
            const data = await request.file();
            const buffer = await data.toBuffer();
            const { headers, data: contacts } = CsvWorker.parse(buffer);
            const friendlyContacts = helper.validation(contacts);

            // use di service
            // const contactServices: IContactService = request.diScope.resolve('contactServices');
            const contactServices = new ContactService(request.mikroORM.orm);
            const validContacts = await contactServices.verifyAndUpload(friendlyContacts);

            void reply.code(200).send({
                headers,
                validContacts: validContacts.map((contact: Contacts) => contact.toJSON()),
            });
        } catch (error: any) {
            request.log.error(error.message);

            if (error instanceof ValidationError) {
                return reply.code(400).send({ message: error.message });
            }

            return reply.code(500).send();
        }
    });

    next();
});

export namespace helper {
    export function validation(contacts: Array<any>): Array<Contacts> {

        const friendlyContacts: Array<Contacts> = contacts.map((c: any) => {
            const dbCont = new Contacts();
            if (!c.Name || !c.Phone || !c.Email) throw new ValidationError("Invalid data, Name, Phone, Email - required value");

            dbCont.name = c.Name;
            dbCont.phone = c.Phone;
            dbCont.email = c.Email;
            dbCont.isValid = false;
            return dbCont;
        });

        return friendlyContacts;
    }
}