import fs from "fs";
import { expect } from "chai";

import { CsvWorker } from "../src/extra/CsvWorker";

describe("CsvWorker Unit Tests", () => {
  it("should convert file to object and check headers fo correct", async () => {
    const csvContent = fs.readFileSync("./example.csv", "utf-8");

    const { headers } = CsvWorker.parse(csvContent);

    expect(headers).to.be.an('array');
    expect(headers).to.have.lengthOf(3);
  });

  it("should convert file to object and check data fo correct", async () => {
    const csvContent = fs.readFileSync("./example.csv", "utf-8");

    const { data } = CsvWorker.parse(csvContent);

    expect(data).to.be.an('array');
    expect(data).to.have.lengthOf(10);
  });

  it("shouldn't convert incorrect string to object", async () => {
    const csvContent = `Name,Email
    Kyra,Lela_Connelly87@hotmail.com,+18133339297`;

    expect(() => { CsvWorker.parse(csvContent) }).to.throw(Error);
  });
});
