import chai from "chai";
import mocha from "mocha";

mocha.describe("An example of Unit Test", () => {
	it("Should be less than 100", () => {
		const result = Math.random();
		chai.expect(result).to.lessThan(100);
	});
});
