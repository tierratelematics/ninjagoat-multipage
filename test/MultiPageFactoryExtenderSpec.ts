import "reflect-metadata";
import expect = require("expect.js");
import { IMock, Mock, Times, It } from "typemoq";
import { ViewModelContext, ObservableViewModel, Dictionary, IViewModelFactory, RegistryEntry, Screen, IObjectContainer } from "ninjagoat";

import { MockViewModel } from "./fixtures/MockViewModel";
import { IMultiPageRegistryGetter } from "scripts/registry/IMultiPageRegistry";
import { MultiPageFactoryExtender } from "../scripts/multipage/MultiPageFactoryExtender";
import { MockPageViewModel, AnotherMockPageViewModel } from "./fixtures/MockPageViewModel";
import { IMultiPageParametersUpdater } from "scripts/parameters/IMultiPageParametersUpdater";

describe("The MultiPageFactoryExtender", () => {
    let subject: MultiPageFactoryExtender;
    let registry: IMock<IMultiPageRegistryGetter>;
    let factory: IMock<IViewModelFactory>;
    let container: IMock<IObjectContainer>;
    let updater: IMock<IMultiPageParametersUpdater>;
    let page: RegistryEntry<any>;
    let anotherPage: RegistryEntry<any>;

    let mainContext: ViewModelContext;

    beforeEach(() => {
        mainContext = new ViewModelContext("anArea", "aViewmodelId", { entityId: null, pageId: "Page" });

        page = Screen.forViewModel(MockPageViewModel);
        anotherPage = Screen.forViewModel(AnotherMockPageViewModel);

        registry = Mock.ofType<IMultiPageRegistryGetter>();
        registry.setup(r => r.pagesFor(It.isValue(mainContext))).returns(() => ({
            "Page": page,
            "AnotherPage": anotherPage
        }));

        factory = Mock.ofType<IViewModelFactory>();
        factory.setup(f => f.create(It.isValue(new ViewModelContext("anArea", "aViewmodelId-Page", mainContext.parameters)), MockPageViewModel, It.isAny()))
            .returns(() => new MockPageViewModel());
        factory.setup(f => f.create(It.isValue(new ViewModelContext("anArea", "aViewmodelId-AnotherPage", mainContext.parameters)), AnotherMockPageViewModel, It.isAny()))
            .returns(() => new AnotherMockPageViewModel());

        container = Mock.ofType<IObjectContainer>();
        container.setup(c => c.get<any>(It.isAny())).returns(() => factory.object);

        updater = Mock.ofType<IMultiPageParametersUpdater>();

        subject = new MultiPageFactoryExtender(registry.object, container.object, updater.object);
    });

    context("when extend a viewmodel", () => {
        context("when it is a MultiPageViewModel", () => {
            it("should request the registered page for its context", () => {
                let vm = new MockViewModel();
                subject.extend(vm, mainContext, null);

                registry.verify(r => r.pagesFor(It.isValue(mainContext)), Times.once());
            });

            it("should set the pages registered for it", () => {
                let vm = new MockViewModel();
                subject.extend(vm, mainContext, null);

                let { Page, AnotherPage } = vm["pages"] as Dictionary<ObservableViewModel<any>>;

                expect(Page instanceof MockPageViewModel).to.be.ok();
                expect(AnotherPage instanceof AnotherMockPageViewModel).to.be.ok();
            });

            it("should set the current page as the first registered once", () => {
                let vm = new MockViewModel();
                subject.extend(vm, mainContext, null);

                expect(vm.currentPage instanceof MockPageViewModel).to.be.ok();
            });


            it("should decorate the viewmodel goToPage method to update the location", () => {
                let vm = new MockViewModel();
                subject.extend(vm, mainContext, null);

                vm.goToPage("AnotherPage");
                updater.verify(u => u.update(It.isValue({ pageId: "AnotherPage" })), Times.once());
            });
        });

        context("when it is NOT a MultiPageViewModel", () => {
            it("should do nothing", () => {
                let vm = new MockPageViewModel();
                subject.extend(vm as any, mainContext, null);
                expect(vm["pages"]).to.not.be.ok();
            });
        });
    });
});
