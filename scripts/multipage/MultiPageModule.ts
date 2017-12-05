import { interfaces } from "inversify";
import { IModule, IViewModelRegistry, IServiceLocator, IViewModelFactoryExtender } from "ninjagoat";

import { MultiPageRegistry } from "../registry/MultiPageRegistry";
import { MultiPageParametersUpdater } from "../parameters/MultiPageParametersUpdater";
import { IMultiPageParametersUpdater } from "../parameters/IMultiPageParametersUpdater";
import { MultiPageFactoryExtender } from "./MultiPageFactoryExtender";
import { IMultiPageRegistry, IMultiPageRegistryGetter } from "../registry/IMultiPageRegistry";

export class MultiPageModule implements IModule {
    modules(container: interfaces.Container): void {
        container.bind<IMultiPageParametersUpdater>("IMultiPageParametersUpdater").to(MultiPageParametersUpdater);
        container.bind<MultiPageRegistry>("MultiPageRegistry").to(MultiPageRegistry).inSingletonScope();
        container.bind<IViewModelFactoryExtender>("IViewModelFactoryExtender").to(MultiPageFactoryExtender);
        container.bind<IMultiPageRegistryGetter>("IMultiPageRegistryGetter").toDynamicValue(() => container.get<MultiPageRegistry>("MultiPageRegistry"));
        container.bind<IMultiPageRegistry>("IMultiPageRegistry").toDynamicValue(() => container.get<MultiPageRegistry>("MultiPageRegistry"));
    };

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void { };
}
