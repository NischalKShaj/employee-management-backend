// file to handle the validation for the data

// for performing the validation for username
const nameValidation = (username) => {
  // for name
  const nameRegex = /^[A-Za-z ]{3,}$/;
  if (!nameRegex.test(username)) {
    return "Username must be at least 3 characters and contain only alphabets.";
  }
  return null;
};

// for age
const ageValidation = (age) => {
  if (isNaN(age) || age <= 0) {
    return "Age must be a valid number.";
  }
  return null;
};

// for gender
const genderValidation = (gender) => {
  if (gender !== "male" && gender !== "female") {
    return "Gender must be 'male' or 'female'.";
  }
  return null;
};

// for email
const emailValidation = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }
  return null;
};

// for role
const roleValidation = (role) => {
  const validRoles = [
    "Developer",
    "Manager",
    "HR",
    "Tester",
    "DevOps",
    "Sales",
  ];
  if (!validRoles.includes(role)) {
    return "Role must be one of the following: Developer, Manager, HR, Tester, DevOps, Sales.";
  }
  return null;
};

// for password
const passwordValidation = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(password)) {
    return "Password must contain at least one uppercase letter, one number, one symbol, and be at least 6 characters long.";
  }
  return null;
};

export default {
  nameValidation,
  ageValidation,
  genderValidation,
  emailValidation,
  roleValidation,
  passwordValidation,
};
