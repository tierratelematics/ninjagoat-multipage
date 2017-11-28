# Ninjagoat-multipage

A module to handle different pages in the same view.

## Installation

`
$ npm install ninjagoat-multipage
`

Add this code to the bootstrapper.ts file:

```typescript
import { MultiPageModule } from "ninjagoat-multipage";

application.register(new MultiPageModule());
```

Create a MultiPage viewmodel

```typescript
import { ViewModel } from "ninjagoat";
import { MultiPageViewModel } from "ninjagoat-multipage";

type Model = {counter : number};

@ViewModel("Test")
class TestViewModel extends MultiPageViewModel<Model> {}
```

And its pages viewmodels

```typescript
import { ViewModel, ObservableViewModel } from "ninjagoat";

type Model = {counter : number};

@ViewModel("Page")
class PageViewModel extends MultiPageViewModel<Model> {}

@ViewModel("AnotherPage")
class AnotherPageViewModel extends MultiPageViewModel<Model> {}
```

Register the MultiPage viewmodel and its pages in a module.

```typescript
class AppModule implements IModule {
    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void {
        let pages: IMultiPageRegistry = serviceLocator.get<IMultiPageRegistry>("IMultiPageRegistry");

        registry.add(
            Screen.forViewModel(TestViewModel)
                .usingController(context => Observable.just(context.parameters.id))
                .withParameters(":mainCount(/:pageId)(/:pageCont)"))
            .forArea("multipage");

        pages.add(
            Screen.forViewModel(PageViewModel)
                .usingController(context => Observable.just(context.parameters.pageCont + 1))
            .add(
            Screen.forViewModel(AnotherPageViewModel)
                .usingController(context => Observable.just(context.parameters.pageCont + 10))
            .forViewModel(TestViewModel)
    }
}
```

## Usage

 When all the pages are registered for a viewmodel it's possible access to displayed page with the attribute `currentPage`.

```tsx
export default class Test extends View<TestViewModel> {
    let {currentPage} = this.viewmodel;

    render() {
        return (
            <div>
                {(currentPage as PageViewModel).counter}
            </div>
        );
    }
}
```

And it can be changed with the `goToPage` method.

```tsx
export default class Test extends View<TestViewModel> {

    render() {
        return (
            <div>
                <button onClick={() => this.viewModel.goToPage("Page")}> Go to Page</button>
                <button onClick={() => this.viewModel.goToPage("AnotherPage")}> Go to Another Page</button>
            </div>
        );
    }
}
```

Also with the method `isVisible` can be check if a page is visible or not (e.g. to render different sub-views).

```tsx
export default class Test extends View<TestViewModel> {
    let {currentPage} = this.viewmodel;

    render() {
        return (
            <div>
                <span>Some extra text here</span>
                {this.viewModel.isVisible("Page") ? <PageView viewmodel={currentPage} /> : null }
                {this.viewModel.isVisible("AnotherPage") ? <AnotherPageView viewmodel={currentPage} /> : null }
            </div>
        );
    }
}
```

## License

Copyright 2016 Tierra SpA

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.