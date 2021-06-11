import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';



@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: './parametro.dialog.html'
})

export class DialogParametroComponent {

    constructor(
        public dialogRef: MatDialogRef<DialogParametroComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}