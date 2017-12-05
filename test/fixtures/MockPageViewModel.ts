import { ViewModel, ObservableViewModel, Refresh } from "ninjagoat";

@ViewModel("Page")
export class MockPageViewModel extends ObservableViewModel<any> {
    public model: any;
    public hasSubscriber: boolean;
    public isDisposed: boolean;

    onData(model: any): void {
        this.model = model;
    }

    dispose() {
        this.isDisposed = true;
    }

    subscribe(...args) {
        this.hasSubscriber = true;
        return super.subscribe(...args);
    }

    @Refresh
    refreshView() { }

    notRefreshView() { }
}

@ViewModel("AnotherPage")
export class AnotherMockPageViewModel extends MockPageViewModel { }
