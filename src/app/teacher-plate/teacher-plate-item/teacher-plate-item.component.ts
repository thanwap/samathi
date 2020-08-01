import { ThaiDatePipe } from './../../directives/thaidate.pipe';
import { TeacherPlateService } from '../../services/teacher-plate.service';
import { Component, OnInit, ElementRef, ViewChild, PipeTransform } from '@angular/core';
import html2canvas from 'html2canvas';
import { TeacherPlate } from '../../shared/models/teacher-plate.model';

@Component({
  selector: 'app-teacher-plate-item',
  templateUrl: './teacher-plate-item.component.html',
  styleUrls: ['./teacher-plate-item.component.scss']
})
export class TeacherPlateItemComponent implements OnInit {
  plateInfo: TeacherPlate;

  @ViewChild('plate', {static: false}) plate: ElementRef;
  @ViewChild('plateDummy', {static: false}) plateDummy: ElementRef;
  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  @ViewChild('downloadLink', {static: false}) downloadLink: ElementRef;

  constructor(public teacherPlateService: TeacherPlateService, private pipe: ThaiDatePipe) { }

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
        this.pipe.transform(this.plateInfo.date.toString(),'short')
        + ' ' + this.plateInfo.title + ' ' + this.plateInfo.teacherName + '.png';
      this.downloadLink.nativeElement.click();
    });
  }

}
