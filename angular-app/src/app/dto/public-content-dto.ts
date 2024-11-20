export class PublicContentDTO {
    id?: number;
    date!: string; // LocalDate se mapea como string en TypeScript (ISO 8601 format)
    description!: string;
    contentUrl!: string;
    like!: number;
  }
  