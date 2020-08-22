import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LineService {

  constructor(private http: HttpClient) { }

  SendToLine(imgData: any) {
    // let bodyString = JSON.stringify(imgData);
    return this.http.post('http://localhost:5001/samathi-f1b98/us-central1/sendPlateToLine',
    imgData);
    // let httpOptions = {
    //   'headers': {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Authorization': 'Bearer qXVbCDv67xSLJ19nZiZyOEfS4rjwur0tl9YhJ5VwaXV',
    //     'Access-Control-Allow-Origin': '*'
    //   }
    // };

    // return this.http.post('https://notify-api.line.me/api/notify', 'message=12345', httpOptions);
  }
}
