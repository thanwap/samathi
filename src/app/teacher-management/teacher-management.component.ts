import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../services/teacher.service';
import { Teacher } from '../shared/models/teacher.model';

@Component({
  selector: 'app-teacher-management',
  templateUrl: './teacher-management.component.html',
  styleUrls: ['./teacher-management.component.scss']
})
export class TeacherManagementComponent implements OnInit {

  teachersCsv: any;
  teachers: any;

  constructor(private teacherService: TeacherService) { }
  ngOnInit() {
  }

  fileChangeListener($event: any): void {
    const files = $event.srcElement.files;

    if (this.isCSVFile(files[0])) {
      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = (data) => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);

        this.teacherService.getTeachers().then(teachers => {
          this.teachers = this.getTeachersFromCSVFile(csvRecordsArray);
          this.teacherService.addTeachers(Object.values(this.teachers));
        });
      };

      reader.onerror = () => {
        alert('Unable to read ' + input.files[0]);
      };
    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  getTeachersFromCSVFile(rows: any) {
    let teachers: { [id: string]: Teacher } = {};

    for (let i = 4; i < rows.length; i++) {
      const data = rows[i].split(',');

      if (data.length <= 1) {
        return teachers;
      }

      let teacher = new Teacher('', data[5].trim(), data[6].trim(), data[7].trim(), data[8].trim());

      if (teacher.name !== '' && !teachers[teacher.fullName]) {
        teachers[teacher.fullName] = teacher;
      }
    }

    return teachers;
  }

  isCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  fileReset() {

  }

}
