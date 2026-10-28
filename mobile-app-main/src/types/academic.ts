export interface Department {
  code: string;
  name: string;
}

export interface School {
  code: string;
  name: string;
  departments: Department[];
}

export interface Institution {
  name: string;
  shortName: string;
  schools: School[];
}

export interface AcademicCourse {
  id: string;
  code: string;
  name: string;
  units: number;
  category: 'core' | 'elective' | 'lab';
  level: string; // '100' | '200' | '300' | '400' | '500' | 'postgrad'
  departmentCode: string;
  tag?: string | null;
  description?: string;
}
