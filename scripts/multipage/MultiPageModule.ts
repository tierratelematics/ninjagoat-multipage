import { interfaces } from "inversify";
import { IModule, IViewModelRegistry, IServiceLocator, IViewModelFactoryExtender } from "ninjagoat";

import { MultiPageRegistry } from "../registry/MultiPageRegistry";
import { ParametersUpdater } from "../parameters/ParametersUpdater";
import { IParametersUpdater } from "../parameters/IParametersUpdater";
import { MultiPageFactoryExtender } from "./MultiPageFactoryExtender";
import { IMultiPageRegistry, IPagesRetriever } from "../registry/IMultiPageRegistry";

export class MultiPageModule implements IModule {
    modules(container: interfaces.Container): void {
        container.bind<IParametersUpdater>("IParametersUpdater").to(ParametersUpdater);
        container.bind<MultiPageRegistry>("MultiPageRegistry").to(MultiPageRegistry).inSingletonScope();
        container.bind<IViewModelFactoryExtender>("IViewModelFactoryExtender").to(MultiPageFactoryExtender);
        container.bind<IPagesRetriever>("IPagesRetriever").toDynamicValue(() => container.get<MultiPageRegistry>("MultiPageRegistry"));
        container.bind<IMultiPageRegistry>("IMultiPageRegistry").toDynamicValue(() => container.get<MultiPageRegistry>("MultiPageRegistry"));
    };

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void { };
}
