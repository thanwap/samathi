export class Teacher {
  id: string;
  prefix: string;
  firstName: string;
  lastName: string;
  fullName: string;
  fullNameForPicture: string;
  phoneNumber: string;
  imagePath: string

  constructor(id: string, prefix: string, firstName: string, lastName: string, phoneNumber: string = '', imagePath: string = '') {
    this.id = id;
    this.prefix = prefix;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = this.getFullName();
    this.fullNameForPicture = this.getFullName(false);
    this.phoneNumber = phoneNumber;
    this.imagePath = imagePath;
  }

  getFullName(withPrefixSpace = true): string {
    let fullName = "";

    if (this.firstName && this.lastName) {
      fullName = `${this.firstName} ${this.lastName}`
    } else if (this.firstName) {
      fullName = `${this.firstName}`
    } else if (this.lastName) {
      fullName = this.lastName
    }

    if (this.prefix) {
      fullName = `${this.prefix}${withPrefixSpace ? ' ' : ''}${fullName}`
    }

    return fullName;
  }
}
