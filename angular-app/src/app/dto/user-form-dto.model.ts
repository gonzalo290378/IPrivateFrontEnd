

export class UserFormDTO {
  id?: number;
  username!: string;
  age!: number;
  sex!: string;
  email!: string;
  birthdate!: string; // LocalDate mapeado como string en formato ISO 8601
  registerDate!: string; // LocalDate mapeado como string en formato ISO 8601
  description!: string;
  isEnabled?: boolean;
  password!: string;
  idFreeArea?: number;
  idPrivateArea?: number;
  ageFrom!: number;
  ageTo!: number;
  sexPreference!: string;
  country!: string;
  city!: string;

  // Método para calcular la edad
  getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
