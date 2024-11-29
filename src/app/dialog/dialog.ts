import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DialogContent {

  //注入 MatDialogRef< class名 > ， 之後可以使用方法將在 Dialog 中的資料留在網站中
  readonly dialogRef = inject(MatDialogRef<DialogContent>);
  // 在要引用的 component 的 TS 可以在.open( class名 ,{data : 'hello'}) 將資料接過來
  readonly data = inject<string>(MAT_DIALOG_DATA);

  Cancel() {
    // 關閉 diaolog 並講 returnData 回傳給引用的 TS 內
    this.dialogRef.close(false)
  }

  OK() {
    // 關閉 diaolog 並講 returnData 回傳給引用的 TS 內
    this.dialogRef.close(true)
  }
}
