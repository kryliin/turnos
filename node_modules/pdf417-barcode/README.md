# Angular PDF417 Barcode

An Angular component/module that creates a canvas with a PDF417 barcode from a string input.

## Install

Use it in your Angular project by installing with `yarn` or `npm`:

    yarn add pdf417-barcode

## Usage

In a parent or shared module, import the `Pdf417BarcodeModule`, which imports the Component and
Declaration.

```typescript
[...]
import { Pdf417BarcodeModule } from "pdf417-barcode";

@NgModule({
  ...
  imports: [
    ...
    Pdf417BarcodeModule,
  ],
  ...
})
export class AppModule { }
```

Then use it in your own component's template:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h5>Scan Me:</h5>
      <pdf417barcode [text]="text" [opts]="{ pxw: 2, pxh: 2 }"></pdf417barcode>
    </div>
  `,
})
export class AppComponent {
  public text = 'Hello, World!';
}
```

![barcode](https://cloud.githubusercontent.com/assets/11139925/19278474/9c18d700-8fdd-11e6-91c2-84727749e9b4.png)

## Options

The component also accepts an `opts` object with some options:

| key    |  type   | default | description                                              |
| :----- | :-----: | :-----: | :------------------------------------------------------- |
| aspect |  float  |    4    | aspect ratio of the generated barcode                    |
| errlvl | -1 .. 8 |   -1    | error correction level in the barcode, `-1` means `auto` |
| pxw    |  float  |    1    | pixel width                                              |
| pxh    |  float  |    1    | pixel height                                             |

You can use property binding directly like this:

```html
<pdf417barcode [text]="'Hello, World!'" [opts]="{ pxw: 2, pxh: 2 }"></pdf417barcode>
```
