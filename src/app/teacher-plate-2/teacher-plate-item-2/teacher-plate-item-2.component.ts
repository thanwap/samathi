import { ThaiDatePipe } from '../../directives/thaidate.pipe';
import { TeacherPlateService } from '../../services/teacher-plate.service';
import { Component, OnInit, ElementRef, ViewChild, PipeTransform } from '@angular/core';
import html2canvas from 'html2canvas';
import { TeacherPlate } from '../../shared/models/teacher-plate.model';
import { LineService } from 'src/app/services/line.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-teacher-plate-item-2',
  templateUrl: './teacher-plate-item-2.component.html',
  styleUrls: ['./teacher-plate-item-2.component.scss']
})
export class TeacherPlateItem2Component implements OnInit {
  plateInfo: TeacherPlate;

  @ViewChild('plate', { static: false }) plate: ElementRef;
  @ViewChild('plateDummy', { static: false }) plateDummy: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('downloadLink', { static: false }) downloadLink: ElementRef;

  constructor(
    public teacherPlateService: TeacherPlateService,
    private pipe: ThaiDatePipe,
    private storage: AngularFireStorage,
    private lineService: LineService) { }

  ngOnInit() {
    this.plateInfo = this.teacherPlateService.getPlateInfo();
  }

  downloadImage() {
    html2canvas(this.plateDummy.nativeElement, {
      scrollY: 0,
      scrollX: 0,
    }).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download =
        this.pipe.transform(this.plateInfo.date.toString(), 'short')
        + ' ' + this.plateInfo.title + ' ' + this.plateInfo.teacherName + '.png';
      this.downloadLink.nativeElement.click();
    });
  }

  sendToLine() {
    let fileName = this.pipe.transform(this.plateInfo.date.toString(), 'short')
      + ' ' + this.plateInfo.title + ' ' + this.plateInfo.teacherName + '.png';
    const body = {
      date: this.pipe.transform(this.plateInfo.date.toString(), 'thaidate'),
      title: this.plateInfo.title,
      teacher: this.plateInfo.teacherName,
      imagePath: ''
    };
    console.log(body);
    html2canvas(this.plateDummy.nativeElement, {
      scrollY: 0,
      scrollX: 0,
    }).then(canvas => {
      canvas.toBlob((file) => {
        const ref = this.storage.ref('Plate/' + fileName);
        const task = ref.put(file).then(x => {
          console.log(x.ref.getDownloadURL().then(imagePath => {
            body.imagePath = imagePath;
            this.lineService.SendToLine(JSON.stringify(body)).subscribe(res => {

            });
          }));
        });
      }, 'image/png');
    });
  }
}
