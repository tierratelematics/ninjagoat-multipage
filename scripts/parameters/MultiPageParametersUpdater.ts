import { merge } from "lodash";
import { stringify, parse } from "qs";
import { injectable } from "inversify";
import { IMultiPageParametersUpdater } from "./IMultiPageParametersUpdater";

@injectable()
export class MultiPageParametersUpdater implements IMultiPageParametersUpdater {
    update(parameters: any): void {
        let { protocol, host, pathname, search } = location;
        let url = `${protocol}//${host}${pathname}?${stringify(merge({}, parse(search.substring(1)), parameters))}`;
        history.pushState(null, null, url);
    }
}
