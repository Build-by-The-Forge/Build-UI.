import { Institution, School, Department, AcademicCourse } from '@/types/academic';

export const FUTA_INSTITUTION: Institution = {
  name: 'Federal University of Technology, Akure',
  shortName: 'FUTA',
  schools: [
    {
      code: 'SOC',
      name: 'School of Computing',
      departments: [
        { code: 'CSC', name: 'Computer Science' },
        { code: 'CYS', name: 'Cyber Security' },
        { code: 'IFS', name: 'Information Systems' },
        { code: 'IFT', name: 'Information Technology' },
        { code: 'SEN', name: 'Software Engineering' },
        { code: 'DTS', name: 'Data Science' },
      ],
    },
    {
      code: 'SAAT',
      name: 'School of Agriculture and Agricultural Technology',
      departments: [
        { code: 'AEC', name: 'Agricultural Extension and Communication Technology' },
        { code: 'ARE', name: 'Agricultural Resources Economics' },
        { code: 'APH', name: 'Animal Production and Health' },
        { code: 'CSP', name: 'Crop, Soil and Pest Management' },
        { code: 'EWM', name: 'Ecotourism and Wildlife Management' },
        { code: 'FAT', name: 'Fisheries and Aquaculture Technology' },
        { code: 'FST', name: 'Food Science and Technology' },
        { code: 'FWT', name: 'Forestry and Wood Technology' },
        { code: 'NTD', name: 'Nutrition and Dietetics' },
      ],
    },
    {
      code: 'SIMME',
      name: 'School of Infrastructure, Minerals and Manufacturing Engineering',
      departments: [
        { code: 'AGE', name: 'Agricultural Engineering' },
        { code: 'CVE', name: 'Civil Engineering' },
        { code: 'IPE', name: 'Industrial and Production Engineering' },
        { code: 'MEE', name: 'Mechanical Engineering' },
        { code: 'MNE', name: 'Mining Engineering' },
        { code: 'MME', name: 'Metallurgical and Materials Engineering' },
      ],
    },
    {
      code: 'SET',
      name: 'School of Environmental Technology',
      departments: [
        { code: 'BDG', name: 'Building Technology' },
        { code: 'ESM', name: 'Estate Management' },
        { code: 'IDD', name: 'Industrial Design' },
        { code: 'QSV', name: 'Quantity Surveying' },
        { code: 'URP', name: 'Urban and Regional Planning' },
        { code: 'SVG', name: 'Surveying and Geoinformatics' },
      ],
    },
    {
      code: 'SOA',
      name: 'School of Architecture',
      departments: [
        { code: 'ARC', name: 'Architecture' },
        { code: 'AST', name: 'Architectural Science Technology' },
        { code: 'FUD', name: 'Furniture Design' },
        { code: 'IAD', name: 'Interior Architecture Design' },
        { code: 'LAR', name: 'Landscape Architecture' },
        { code: 'NAR', name: 'Naval Architecture' },
      ],
    },
    {
      code: 'SEMS',
      name: 'School of Earth and Mineral Sciences',
      departments: [
        { code: 'AGY', name: 'Applied Geology' },
        { code: 'AGP', name: 'Applied Geophysics' },
        { code: 'MST', name: 'Marine Science and Technology' },
        { code: 'MCS', name: 'Meteorology and Climate Science' },
        { code: 'RSG', name: 'Remote Sensing and Geoinformatics' },
      ],
    },
    {
      code: 'SLIT',
      name: 'School of Logistics and Innovation Technology',
      departments: [
        { code: 'PMT', name: 'Project Management Technology' },
        { code: 'TMT', name: 'Logistics and Transport Management Technology' },
        { code: 'ENT', name: 'Entrepreneurship Management Technology' },
        { code: 'PRT', name: 'Procurement Management Technology' },
        { code: 'FIN', name: 'Financial Technology' },
      ],
    },
    {
      code: 'SPS',
      name: 'School of Physical Sciences',
      departments: [
        { code: 'IMC', name: 'Industrial Chemistry' },
        { code: 'PHY', name: 'Physics' },
        { code: 'MTS', name: 'Mathematical Sciences' },
        { code: 'STA', name: 'Statistics' },
      ],
    },
    {
      code: 'SLS',
      name: 'School of Life Sciences',
      departments: [
        { code: 'BCH', name: 'Biochemistry' },
        { code: 'BIO', name: 'Biology' },
        { code: 'MCB', name: 'Microbiology' },
        { code: 'BTC', name: 'Biotechnology' },
      ],
    },
    {
      code: 'SESE',
      name: 'School of Electrical and Systems Engineering',
      departments: [
        { code: 'EEE', name: 'Electrical and Electronics Engineering' },
        { code: 'CPE', name: 'Computer Engineering' },
        { code: 'ICE', name: 'Information and Communication Engineering' },
        { code: 'BME', name: 'Biomedical Engineering' },
      ],
    },
    {
      code: 'SSTE',
      name: 'School of Science and Technology Education',
      departments: [
        { code: 'EDT', name: 'Educational Technology' },
        { code: 'LIS', name: 'Library and Information Science' },
        { code: 'ITE', name: 'Industrial and Technology Education' },
      ],
    },
  ],
};

// Curated courses for popular departments across levels
const COURSE_CATALOG: Record<string, Record<string, AcademicCourse[]>> = {
  CSC: {
    '100': [
      { id: 'CSC101', code: 'CSC 101', name: 'Introduction to Computer Science', units: 3, category: 'core', level: '100', departmentCode: 'CSC' },
      { id: 'CSC102', code: 'CSC 102', name: 'Introduction to Problem Solving & Programming', units: 3, category: 'core', level: '100', departmentCode: 'CSC' },
      { id: 'MTS101', code: 'MTS 101', name: 'Elementary Mathematics I (Algebra & Trigonometry)', units: 3, category: 'core', level: '100', departmentCode: 'CSC' },
      { id: 'PHY101', code: 'PHY 101', name: 'General Physics I (Mechanics & Properties of Matter)', units: 3, category: 'core', level: '100', departmentCode: 'CSC' },
      { id: 'PHY107', code: 'PHY 107', name: 'General Physics Practical I', units: 1, category: 'lab', level: '100', departmentCode: 'CSC' },
      { id: 'GNS101', code: 'GNS 101', name: 'Use of English I', units: 2, category: 'core', level: '100', departmentCode: 'CSC' },
    ],
    '200': [
      { id: 'CSC201', code: 'CSC 201', name: 'Computer Programming I (C++/Java)', units: 3, category: 'core', level: '200', departmentCode: 'CSC', tag: 'new' },
      { id: 'CSC203', code: 'CSC 203', name: 'Introduction to Discrete Structures', units: 3, category: 'core', level: '200', departmentCode: 'CSC' },
      { id: 'CSC205', code: 'CSC 205', name: 'Foundations of Sequential Programming', units: 3, category: 'core', level: '200', departmentCode: 'CSC' },
      { id: 'CSC209', code: 'CSC 209', name: 'Computer Hardware & Architecture', units: 3, category: 'core', level: '200', departmentCode: 'CSC' },
      { id: 'STA201', code: 'STA 201', name: 'Statistics for Physical Sciences', units: 3, category: 'elective', level: '200', departmentCode: 'CSC' },
      { id: 'CSC299', code: 'CSC 299', name: 'Programming Laboratory Practical', units: 2, category: 'lab', level: '200', departmentCode: 'CSC' },
    ],
    '300': [
      { id: 'CSC301', code: 'CSC 301', name: 'Data Structures and Algorithms', units: 3, category: 'core', level: '300', departmentCode: 'CSC', tag: 'popular' },
      { id: 'CSC303', code: 'CSC 303', name: 'Database Design & Management Systems', units: 3, category: 'core', level: '300', departmentCode: 'CSC' },
      { id: 'CSC305', code: 'CSC 305', name: 'Operating Systems & System Programming', units: 3, category: 'core', level: '300', departmentCode: 'CSC' },
      { id: 'CSC307', code: 'CSC 307', name: 'Software Engineering Principles', units: 3, category: 'core', level: '300', departmentCode: 'CSC' },
      { id: 'CSC309', code: 'CSC 309', name: 'Theory of Computation & Automata', units: 3, category: 'elective', level: '300', departmentCode: 'CSC' },
      { id: 'CSC311', code: 'CSC 311', name: 'Artificial Intelligence Fundamentals', units: 3, category: 'elective', level: '300', departmentCode: 'CSC', tag: 'new' },
      { id: 'CSC399', code: 'CSC 399', name: 'Students Industrial Work Experience Scheme (SIWES)', units: 6, category: 'lab', level: '300', departmentCode: 'CSC' },
    ],
    '400': [
      { id: 'CSC401', code: 'CSC 401', name: 'Compiler Construction & Design', units: 3, category: 'core', level: '400', departmentCode: 'CSC' },
      { id: 'CSC403', code: 'CSC 403', name: 'Computer Networks & Security Protocols', units: 3, category: 'core', level: '400', departmentCode: 'CSC' },
      { id: 'CSC405', code: 'CSC 405', name: 'Distributed Systems & Cloud Computing', units: 3, category: 'core', level: '400', departmentCode: 'CSC' },
      { id: 'CSC407', code: 'CSC 407', name: 'Human Computer Interaction (HCI)', units: 2, category: 'elective', level: '400', departmentCode: 'CSC' },
      { id: 'CSC409', code: 'CSC 409', name: 'Computer Graphics & Visualization', units: 3, category: 'elective', level: '400', departmentCode: 'CSC' },
      { id: 'CSC499', code: 'CSC 499', name: 'Final Year Research Project', units: 6, category: 'core', level: '400', departmentCode: 'CSC' },
    ],
    '500': [
      { id: 'CSC501', code: 'CSC 501', name: 'Advanced Machine Learning & Deep Learning', units: 3, category: 'core', level: '500', departmentCode: 'CSC' },
      { id: 'CSC503', code: 'CSC 503', name: 'Big Data Analytics & Data Mining', units: 3, category: 'core', level: '500', departmentCode: 'CSC' },
      { id: 'CSC505', code: 'CSC 505', name: 'Cryptography & Cyber Defense Systems', units: 3, category: 'elective', level: '500', departmentCode: 'CSC' },
      { id: 'CSC599', code: 'CSC 599', name: 'Capstone Engineering Project', units: 6, category: 'core', level: '500', departmentCode: 'CSC' },
    ],
  },
  SEN: {
    '100': [
      { id: 'SEN101', code: 'SEN 101', name: 'Introduction to Software Engineering', units: 3, category: 'core', level: '100', departmentCode: 'SEN' },
      { id: 'CSC102', code: 'CSC 102', name: 'Introduction to Problem Solving & Programming', units: 3, category: 'core', level: '100', departmentCode: 'SEN' },
      { id: 'MTS101', code: 'MTS 101', name: 'Elementary Mathematics I', units: 3, category: 'core', level: '100', departmentCode: 'SEN' },
      { id: 'PHY101', code: 'PHY 101', name: 'General Physics I', units: 3, category: 'core', level: '100', departmentCode: 'SEN' },
    ],
    '300': [
      { id: 'SEN301', code: 'SEN 301', name: 'Software Architecture & Design Patterns', units: 3, category: 'core', level: '300', departmentCode: 'SEN', tag: 'popular' },
      { id: 'SEN303', code: 'SEN 303', name: 'Software Testing & Quality Assurance', units: 3, category: 'core', level: '300', departmentCode: 'SEN' },
      { id: 'CSC301', code: 'CSC 301', name: 'Data Structures & Algorithms', units: 3, category: 'core', level: '300', departmentCode: 'SEN' },
      { id: 'CSC303', code: 'CSC 303', name: 'Database Management Systems', units: 3, category: 'core', level: '300', departmentCode: 'SEN' },
      { id: 'SEN305', code: 'SEN 305', name: 'Mobile Application Engineering', units: 3, category: 'elective', level: '300', departmentCode: 'SEN', tag: 'new' },
      { id: 'SEN399', code: 'SEN 399', name: 'Software Lab & Industrial Training', units: 6, category: 'lab', level: '300', departmentCode: 'SEN' },
    ],
  },
  CVE: {
    '100': [
      { id: 'ENG101', code: 'ENG 101', name: 'Engineering Drawing I', units: 2, category: 'core', level: '100', departmentCode: 'CVE' },
      { id: 'MTS101', code: 'MTS 101', name: 'Elementary Mathematics I', units: 3, category: 'core', level: '100', departmentCode: 'CVE' },
      { id: 'PHY101', code: 'PHY 101', name: 'General Physics I', units: 3, category: 'core', level: '100', departmentCode: 'CVE' },
      { id: 'CHM101', code: 'CHM 101', name: 'General Chemistry I', units: 3, category: 'core', level: '100', departmentCode: 'CVE' },
    ],
    '300': [
      { id: 'ENG303', code: 'ENG 303', name: 'Engineering Mathematics III', units: 3, category: 'core', level: '300', departmentCode: 'CVE' },
      { id: 'ENG311', code: 'ENG 311', name: 'Fluid Mechanics', units: 3, category: 'core', level: '300', departmentCode: 'CVE', tag: 'new' },
      { id: 'CEG323', code: 'CEG 323', name: 'Structural Analysis I', units: 3, category: 'core', level: '300', departmentCode: 'CVE' },
      { id: 'ENG331', code: 'ENG 331', name: 'Thermodynamics', units: 3, category: 'core', level: '300', departmentCode: 'CVE' },
      { id: 'CEG341', code: 'CEG 341', name: 'Soil Mechanics & Foundation', units: 3, category: 'core', level: '300', departmentCode: 'CVE' },
      { id: 'STA301', code: 'STA 301', name: 'Statistics for Engineers', units: 3, category: 'core', level: '300', departmentCode: 'CVE' },
      { id: 'CEG351', code: 'CEG 351', name: 'Environmental Engineering', units: 3, category: 'elective', level: '300', departmentCode: 'CVE' },
      { id: 'CEG361', code: 'CEG 361', name: 'Civil Engineering Design & CAD', units: 2, category: 'lab', level: '300', departmentCode: 'CVE' },
    ],
  },
  EEE: {
    '100': [
      { id: 'ENG101', code: 'ENG 101', name: 'Engineering Drawing I', units: 2, category: 'core', level: '100', departmentCode: 'EEE' },
      { id: 'MTS101', code: 'MTS 101', name: 'Elementary Mathematics I', units: 3, category: 'core', level: '100', departmentCode: 'EEE' },
      { id: 'PHY101', code: 'PHY 101', name: 'General Physics I', units: 3, category: 'core', level: '100', departmentCode: 'EEE' },
    ],
    '300': [
      { id: 'EEE301', code: 'EEE 301', name: 'Circuit Theory I', units: 3, category: 'core', level: '300', departmentCode: 'EEE' },
      { id: 'EEE303', code: 'EEE 303', name: 'Electromagnetic Field Theory', units: 3, category: 'core', level: '300', departmentCode: 'EEE' },
      { id: 'EEE305', code: 'EEE 305', name: 'Analogue Electronic Circuits', units: 3, category: 'core', level: '300', departmentCode: 'EEE' },
      { id: 'ENG303', code: 'ENG 303', name: 'Engineering Mathematics III', units: 3, category: 'core', level: '300', departmentCode: 'EEE' },
      { id: 'EEE307', code: 'EEE 307', name: 'Digital Logic & Microprocessors', units: 3, category: 'core', level: '300', departmentCode: 'EEE', tag: 'popular' },
      { id: 'EEE399', code: 'EEE 399', name: 'Electrical Engineering Laboratory', units: 2, category: 'lab', level: '300', departmentCode: 'EEE' },
    ],
  },
};

/**
 * Returns list of all schools in the institution
 */
export function getSchools(): School[] {
  return FUTA_INSTITUTION.schools;
}

/**
 * Returns a school by code
 */
export function getSchoolByCode(schoolCode: string): School | undefined {
  return FUTA_INSTITUTION.schools.find(
    (s) => s.code.toLowerCase() === schoolCode.toLowerCase()
  );
}

/**
 * Returns departments for a given school code
 */
export function getDepartmentsBySchool(schoolCode: string): Department[] {
  const school = getSchoolByCode(schoolCode);
  return school ? school.departments : [];
}

/**
 * Finds a department across all schools by code
 */
export function getDepartmentByCode(deptCode: string): { department: Department; school: School } | undefined {
  for (const school of FUTA_INSTITUTION.schools) {
    const department = school.departments.find(
      (d) => d.code.toLowerCase() === deptCode.toLowerCase()
    );
    if (department) {
      return { department, school };
    }
  }
  return undefined;
}

/**
 * Generates courses dynamically for any department & level if not explicitly hardcoded
 */
export function getCoursesForDepartment(
  deptCode: string,
  level: string = '300'
): AcademicCourse[] {
  const code = deptCode.toUpperCase();
  const numericLevel = level === 'postgrad' ? '500' : level || '300';

  // Return specific curated courses if catalogued
  if (COURSE_CATALOG[code]?.[numericLevel]) {
    return COURSE_CATALOG[code][numericLevel];
  }

  // If department catalog exists for 300 level as fallback
  if (COURSE_CATALOG[code]?.['300']) {
    return COURSE_CATALOG[code]['300'];
  }

  // Fallback: Generate realistic departmental courses dynamically
  const deptInfo = getDepartmentByCode(code);
  const deptName = deptInfo?.department.name || code;
  const levelNum = numericLevel.substring(0, 1);

  return [
    {
      id: `${code}${levelNum}01`,
      code: `${code} ${levelNum}01`,
      name: `Advanced ${deptName} I`,
      units: 3,
      category: 'core',
      level: numericLevel,
      departmentCode: code,
      tag: 'popular',
    },
    {
      id: `${code}${levelNum}02`,
      code: `${code} ${levelNum}02`,
      name: `${deptName} Research Methodology`,
      units: 3,
      category: 'core',
      level: numericLevel,
      departmentCode: code,
    },
    {
      id: `${code}${levelNum}03`,
      code: `${code} ${levelNum}03`,
      name: `Applied ${deptName} Systems`,
      units: 3,
      category: 'core',
      level: numericLevel,
      departmentCode: code,
    },
    {
      id: `${code}${levelNum}05`,
      code: `${code} ${levelNum}05`,
      name: `Computational Methods in ${deptName}`,
      units: 3,
      category: 'elective',
      level: numericLevel,
      departmentCode: code,
      tag: 'new',
    },
    {
      id: `${code}${levelNum}07`,
      code: `${code} ${levelNum}07`,
      name: `Special Topics in ${deptName}`,
      units: 2,
      category: 'elective',
      level: numericLevel,
      departmentCode: code,
    },
    {
      id: `${code}${levelNum}99`,
      code: `${code} ${levelNum}99`,
      name: `${deptName} Practical Laboratory & Project`,
      units: 2,
      category: 'lab',
      level: numericLevel,
      departmentCode: code,
    },
  ];
}
