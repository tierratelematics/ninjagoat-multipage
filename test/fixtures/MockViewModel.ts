import { ViewModel } from "ninjagoat";
import { MultiPageViewModel } from "../../scripts/multipage/MultiPageViewModel";

@ViewModel("Mock")
export class MockViewModel extends MultiPageViewModel<any> {
    public model: any;
    public refresh = 0;

    onData(model: any): void {
        this.model = model;
    }
}
