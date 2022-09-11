import { Autoloader } from "autoloader-ts";
import _ from "lodash";

export async function loadGraphqlSchema() {
    const loader = await Autoloader.dynamicImport();
    await loader.fromGlob(__dirname + "/../modules/**/*.schema.(ts|js)");
    const exports = loader.getResult().exports;

    return exports;
}

export async function loadGraphqlResolver() {
    const loader = await Autoloader.dynamicImport();
    await loader.fromGlob(__dirname + "/../modules/**/*.resolver.(ts|js)");
    const exports = loader.getResult().exports;

    return _.reduce(
        exports,
        (pre, value) => {
            return _.merge(pre, value);
        },
        {} as any
    );
}
