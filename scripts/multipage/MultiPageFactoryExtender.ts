import { forEach, keys } from "lodash";
import { injectable, inject } from "inversify";
import { IViewModelFactoryExtender, ViewModelContext, IViewModelFactory, IObjectContainer } from "ninjagoat";

import { MultiPageViewModel } from "./MultiPageViewModel";
import { IMultiPageRegistryGetter } from "../registry/IMultiPageRegistry";
import { IMultiPageParametersUpdater } from "../parameters/IMultiPageParametersUpdater";

@injectable()
export class MultiPageFactoryExtender implements IViewModelFactoryExtender {
    private factory: IViewModelFactory;

    constructor( @inject("IMultiPageRegistryGetter") private registry: IMultiPageRegistryGetter,
        @inject("IObjectContainer") private container: IObjectContainer,
        @inject("IMultiPageParametersUpdater") private updater: IMultiPageParametersUpdater) { }

    extend<T>(viewmodel: T & MultiPageViewModel, context: ViewModelContext, source: any) {
        if (!viewmodel.goToPage) return;
        if (!this.factory) this.factory = this.container.get<IViewModelFactory>("IViewModelFactory");

        let pages = {};
        forEach(this.registry.pagesFor(context), (page, id) =>
            pages[id] = this.factory.create(new ViewModelContext(context.area, `${context.viewmodelId}-${id}`, context.parameters), page.construct, page.source));

        viewmodel["setPages"](pages);

        let original = viewmodel.goToPage;
        viewmodel.goToPage = (pageId: string) => {
            original.call(viewmodel, pageId);
            this.updater.update({ pageId: pageId });
        };

        let pageId = context.parameters.pageId;
        viewmodel.goToPage(!pageId || !pages[pageId] ? keys(pages)[0] : pageId);
    }
}
