import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'thaidate'
})
export class ThaiDatePipe implements PipeTransform {
  thaiDay = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์']
  shortThaiMonth = [
      'ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.',
      'ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'
      ];
  longThaiMonth = [
      'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
      'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'
      ];
  transform(date: string, format: string): string {

    let inputDate=new Date(date);
    let dataDate = [
        inputDate.getDay(),inputDate.getDate(),inputDate.getMonth(),inputDate.getFullYear()
        ];
    let outputDateFull = [
        'วัน'+this.thaiDay[dataDate[0]]+'ที่',
        dataDate[1],
        this.longThaiMonth[dataDate[2]],
        (dataDate[3]+543)
    ];
    let outputDateShort = [
        dataDate[1],
        this.shortThaiMonth[dataDate[2]],
        dataDate[3]+543
    ];
    let outputDateMedium = [
        dataDate[1],
        this.longThaiMonth[dataDate[2]],
        dataDate[3]+543
    ];
    let returnDate:string;
    returnDate = outputDateMedium.join(" ");
    if(format=='full'){
        returnDate = outputDateFull.join(" ");
    }
    if(format=='medium'){
        returnDate = outputDateMedium.join(" ");
    }
    if(format=='short'){
        returnDate = outputDateShort.join(" ");
    }
    return returnDate;
  }
}
