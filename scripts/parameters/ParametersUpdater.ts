import { stringify, parse } from "qs";
import { merge } from "lodash";
import { injectable } from "inversify";
import { IParametersUpdater } from "./IParametersUpdater";

@injectable()
export class ParametersUpdater implements IParametersUpdater {
    update(parameters: any): void {
        let { protocol, host, pathname, search } = location;
        let url = `${protocol}//${host}${pathname}?${stringify(merge({}, parse(search.substring(1)), parameters))}`;
        history.pushState(null, null, url);
    }
}
