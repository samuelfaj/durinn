"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("../src/typescript");
const path = require("path");
const functions = {
    hello: {
        handler: 'my-folder/hello.handler',
        package: {
            include: [],
            exclude: []
        }
    },
    world: {
        handler: 'my-folder/my-subfolder/world.handler',
        package: {
            include: [],
            exclude: []
        }
    },
    create: {
        handler: 'create.create',
        package: {
            include: [],
            exclude: []
        }
    },
};
describe('extractFileName', () => {
    it('get function filenames from serverless service for a non-google provider', () => {
        expect(typescript_1.extractFileNames(process.cwd(), 'aws', functions)).toEqual([
            'my-folder/hello.ts',
            'my-folder/my-subfolder/world.ts',
            'create.ts',
        ]);
    });
    it('get function filename from serverless service for a google provider', () => {
        expect(typescript_1.extractFileNames(path.join(process.cwd(), 'example'), 'google')).toEqual([
            'handler.ts'
        ]);
    });
});
//# sourceMappingURL=typescript.extractFileName.test.js.map