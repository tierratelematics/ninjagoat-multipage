import "reflect-metadata";
import expect = require("expect.js");

import { MockViewModel } from "./fixtures/MockViewModel";
import { MockPageViewModel, AnotherMockPageViewModel } from "./fixtures/MockPageViewModel";

describe("The MultiPageViewModel", () => {
    let subject: MockViewModel;

    let refresh: number;
    let page: MockPageViewModel;
    let anotherPage: AnotherMockPageViewModel;

    beforeEach(() => {
        page = new MockPageViewModel();
        anotherPage = new AnotherMockPageViewModel();

        subject = new MockViewModel();
    });

    context("when the pages are set", () => {
        beforeEach(() => {
            refresh = 0;
            subject["setPages"]({ "Page": page, "AnotherPage": anotherPage });
            subject.subscribe(() => refresh++);
        });

        it("should subscribe to all of them", () => {
            expect(page.hasSubscriber).to.be.ok();
            expect(anotherPage.hasSubscriber).to.be.ok();
        });

        it("should refresh it only if the current page changes", async () => {
            subject.goToPage("Page");
            expect(refresh).to.be(1);

            page.refreshView();
            expect(refresh).to.be(2);

            page.notRefreshView();
            expect(refresh).to.be(2);

            anotherPage.refreshView();
            expect(refresh).to.be(2);

            subject.goToPage("AnotherPage");
            expect(refresh).to.be(3);

            anotherPage.refreshView();
            expect(refresh).to.be(4);
        });

        context("when go to a page", () => {
            it("should change the current page", () => {
                subject.goToPage("AnotherPage");
                expect(subject.currentPage).to.be.equal(anotherPage);
            });
        });

        context("when is disposed", () => {
            it("should dispose all pages", () => {
                subject.dispose();

                expect(page.isDisposed).to.be.ok();
                expect(anotherPage.isDisposed).to.be.ok();
            });
        });
    });
});
