import { ensureFactory } from "@zxteam/ensure";
import { IRequestService } from "./RequestService";

interface verify {
    phone: string;
    local_number: string;
    phone_valid: boolean;
    status: string;
}

interface IVeriPhoneService {
    verify(phone: string): Promise<verify>;
}

// TODO: Сan implement to support different API version v1, v2...
export class VeriPhoneService implements IVeriPhoneService {
    // TODO get from config
    private readonly url: string = 'https://api.veriphone.io/v2/';

    constructor(private readonly request: IRequestService, private readonly apiKey: string) {
    }

    public async verify(phone: string): Promise<verify> {
        const parameters = {
            key: this.apiKey,
            phone
        };
        // TODO handle and wrap errors with try catch
        const contactVerify = await this.request.GET(this.url + "verify", parameters, {});

        // TODO checking for correct data and type, and after that you assign internal type.
        const friendlyContactVerify = helper.validate(contactVerify);

        return friendlyContactVerify;
    }
}

export namespace helper {
    export function validate(contact: any): verify {
        const ensure = ensureFactory();

        // checking for correct data and type, and after that you assign internal type.
        const phone = ensure.string(contact.phone, "Wrong value for field 'phone'");
        const local_number = ensure.string(contact.local_number, "Wrong value for field 'local_number'");
        const phone_valid = ensure.boolean(contact.phone_valid, "Wrong value for field 'phone_valid'");
        const status = ensure.string(contact.status, "Wrong value for field 'status'");

        return { phone, local_number, phone_valid, status };
    }
}