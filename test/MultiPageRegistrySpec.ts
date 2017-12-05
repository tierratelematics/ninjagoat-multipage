import "reflect-metadata";
import * as Rx from "rx";
import expect = require("expect.js");
import { IMock, Mock, Times, It } from "typemoq";
import { IViewModelRegistry, Screen, RegistryEntry, ViewModelContext } from "ninjagoat";

import { MockViewModel } from "./fixtures/MockViewModel";
import { MockPageViewModel } from "./fixtures/MockPageViewModel";
import { MultiPageRegistry } from "../scripts/registry/MultiPageRegistry";

describe("The MultiPageRegistry", () => {
    let subject: MultiPageRegistry;
    let registry: IMock<IViewModelRegistry>;

    beforeEach(() => {
        registry = Mock.ofType<IViewModelRegistry>();
        registry.setup(r => r.getEntry(It.isValue(MockViewModel))).returns(() => ({ area: "anArea", viewmodel: { id: "aViewmodelId" } as RegistryEntry<any> }));

        subject = new MultiPageRegistry(registry.object);
    });

    context("when a page is register for a viewmodel", () => {
        it("should be stored with the correct association", () => {
            subject.add(Screen.forViewModel(MockPageViewModel)
                .withParameters(":entityId")
                .usingController((c) => Rx.Observable.just(c)))
                .forViewModel(MockViewModel);

            registry.verify(r => r.getEntry(It.isValue(MockViewModel)), Times.once());

            let page = subject.pagesFor(new ViewModelContext("anArea", "aViewmodelId")).Page;

            expect(page.construct).to.be(MockPageViewModel);

        });
    });
});
