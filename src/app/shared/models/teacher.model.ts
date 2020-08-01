export class Teacher {
  id: string;
  prefix: string;
  name: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;

  constructor(id: string, prefix: string, name: string, lastName: string, phoneNumber: string = ''){
    this.id = id;
    this.prefix = prefix;
    this.name = name;
    this.lastName = lastName;
    this.fullName = `${prefix} ${name} ${lastName}`;
    this.phoneNumber = phoneNumber;
  }
}
