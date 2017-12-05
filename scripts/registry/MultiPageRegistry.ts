import { inject, injectable, interfaces } from "inversify";
import { RegistryEntry, Dictionary, IViewModel, ViewModelContext, ViewModelUtil, IViewModelRegistry, ILogger, LoggingContext } from "ninjagoat";

import { IMultiPageRegistry, IMultiPageRegistryGetter } from "../registry/IMultiPageRegistry";

@injectable()
@LoggingContext("MultiPageRegistry")
export class MultiPageRegistry implements IMultiPageRegistry, IMultiPageRegistryGetter {
    private unregistered: Dictionary<RegistryEntry<any>> = {};
    private pages: Dictionary<Dictionary<RegistryEntry<any>>> = {};
    @inject("ILogger") private logger: ILogger;

    constructor( @inject("IViewModelRegistry") private registry: IViewModelRegistry) { }

    public add<T>(entry: RegistryEntry<T>): IMultiPageRegistry {
        let name = ViewModelUtil.getViewModelName(entry.construct);
        this.unregistered[name] = entry;
        return this;
    };

    public forViewModel(construct: interfaces.Newable<IViewModel<any>>): void {
        let context = this.registry.getEntry(construct);
        if (!context) this.logger.error(`${construct.name} not register yet!`);
        else this.pages[this.keyFor(new ViewModelContext(context.area, context.viewmodel.id))] = this.unregistered;
        this.unregistered = {};
    };

    public pagesFor(context: ViewModelContext): Dictionary<RegistryEntry<any>> {
        return this.pages[this.keyFor(context)];
    };

    private keyFor(context: ViewModelContext): string {
        return `${context.area}:${context.viewmodelId}:Pages`;
    }
}
