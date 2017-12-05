import * as Rx from "rx";
import { map } from "lodash";
import { injectable } from "inversify";
import { ObservableViewModel, Dictionary, Refresh } from "ninjagoat";

@injectable()
export abstract class MultiPageViewModel<T = any> extends ObservableViewModel<T> {
    private currentPageId: string;
    private subscriptions: Rx.IDisposable;
    private pages: Dictionary<ObservableViewModel<any>> = {};

    public get currentPage(): ObservableViewModel<any> {
        return this.pages[this.currentPageId];
    };

    @Refresh
    public goToPage(pageId: string): void {
        this.currentPageId = pageId;
    }

    public isVisible(pageId: string): boolean {
        return this.currentPageId === pageId;
    }

    public dispose() {
        super.dispose();
        this.subscriptions.dispose();
        map(this.pages, p => p.dispose());
    }

    private setPages(pages: Dictionary<ObservableViewModel<any>>): void {
        this.pages = pages;
        this.subscriptions = Rx.Observable.merge(map(pages, (p, id) => Rx.Observable.create<void>(o => p.subscribe(o)).map(() => id)))
            .subscribe(id => id === this.currentPageId ? this.refreshView() : null);
    }

    @Refresh
    private refreshView() { }
}
