import { interfaces } from "inversify";
import { RegistryEntry, IViewModel, ViewModelContext, Dictionary } from "ninjagoat";

export interface IMultiPageRegistry {
    add<T>(entry: RegistryEntry<T>): IMultiPageRegistry;
    forViewModel(construct: interfaces.Newable<IViewModel<any>>): void;
}

export interface IPagesRetriever {
    pagesFor(context: ViewModelContext): Dictionary<RegistryEntry<any>>;
}
