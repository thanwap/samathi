import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {
  public teachers: any;
  public displayedColumns: string[] = ['index', 'fullName', 'phoneNumber', 'actions'];

  form = new FormGroup({
    name: new FormControl(''),
    nickName: new FormControl('')
  });
  constructor(private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router) { }

  async ngOnInit() {
    this.teachers = await this.teacherService.getTeachers();

  }

  async find() {
    this.teachers = await this.teacherService.findTeachers(this.form.get('name').value, '');
  }

  addTeacher() {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

  editTeacher(id) {
    this.router.navigate(['../teacher/' + id], { relativeTo: this.route });
  }

  deleteTeacher(id) {

  }

}
