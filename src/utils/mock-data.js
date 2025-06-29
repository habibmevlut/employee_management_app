// Mock data generator for initial employee records
export const generateMockEmployees = (count = 15) => {
  const firstNames = [
    'Ahmet', 'Mehmet', 'Ali', 'Ayşe', 'Fatma', 'Zeynep', 'Mustafa', 'Hasan', 'Hüseyin', 'İbrahim',
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Jennifer',
    'Carlos', 'Maria', 'Juan', 'Ana', 'Pedro', 'Sofia', 'Luis', 'Carmen', 'Diego', 'Isabella'
  ];

  const lastNames = [
    'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç',
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Garcia', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres'
  ];

  const departments = [
    'IT', 'HR', 'Marketing', 'Sales', 'Finance', 'Operations', 'Engineering', 'Design', 'Product', 'Support'
  ];

  const positions = {
    'IT': ['Software Developer', 'System Administrator', 'DevOps Engineer', 'QA Engineer', 'Data Analyst'],
    'HR': ['HR Manager', 'Recruiter', 'HR Specialist', 'Training Coordinator', 'Benefits Administrator'],
    'Marketing': ['Marketing Manager', 'Digital Marketing Specialist', 'Content Creator', 'SEO Specialist', 'Brand Manager'],
    'Sales': ['Sales Manager', 'Sales Representative', 'Account Executive', 'Sales Engineer', 'Business Development'],
    'Finance': ['Financial Analyst', 'Accountant', 'Controller', 'Treasury Analyst', 'Budget Manager'],
    'Operations': ['Operations Manager', 'Project Manager', 'Process Analyst', 'Supply Chain Specialist', 'Logistics Coordinator'],
    'Engineering': ['Senior Engineer', 'Lead Engineer', 'Architect', 'Technical Lead', 'Engineering Manager'],
    'Design': ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Visual Designer', 'Design Lead'],
    'Product': ['Product Manager', 'Product Owner', 'Business Analyst', 'Product Analyst', 'Product Lead'],
    'Support': ['Support Specialist', 'Technical Support', 'Customer Success Manager', 'Support Lead', 'Help Desk']
  };

  const domains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com', 'tech.com', 'business.com'
  ];

  const employees = [];

  // Helper to convert Turkish chars to ASCII
  function toAscii(str) {
    return str
      .toLowerCase()
      .replace(/ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/ı/g, 'i')
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/ğ/g, 'g')
      .replace(/[^a-z0-9]/g, '');
  }

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[department][Math.floor(Math.random() * positions[department].length)];
    
    // Generate realistic dates
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - Math.floor(Math.random() * 40) - 20; // 20-60 years old
    const employmentYear = currentYear - Math.floor(Math.random() * 10); // 0-10 years employed
    
    const dateOfBirth = `${birthYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
    const dateOfEmployment = `${employmentYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
    
    // Generate phone number (regex: /^\+\d+ \d+ \d+ \d+$/)
    const phonePrefix = `+${Math.floor(Math.random()*90+10)}`;
    const phone = `${phonePrefix} ${Math.floor(Math.random()*900+100)} ${Math.floor(Math.random()*90+10)} ${Math.floor(Math.random()*90+10)}`;
    
    // Generate email (ASCII only)
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const email = `${toAscii(firstName)}.${toAscii(lastName)}@${domain}`;

    employees.push({
      id: `${Date.now()}_${i}_${Math.floor(Math.random()*10000)}`,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      dateOfEmployment,
      department,
      position
    });
  }

  return employees;
};

// Check if this is the first time the app is loaded
export const isFirstTimeLoad = () => {
  return !localStorage.getItem('employees_initialized');
};

// Mark the app as initialized
export const markAsInitialized = () => {
  localStorage.setItem('employees_initialized', 'true');
}; 