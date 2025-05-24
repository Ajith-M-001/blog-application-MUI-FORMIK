export const strengthLevels = {
  Weak: { text: 'Weak', color: 'error.main' },
  Medium: { text: 'Medium', color: 'warning.main' },
  Strong: { text: 'Strong', color: 'success.main' },
  Default: { text: '', color: 'transparent' } // Added a default for initial state
};

export const calculatePasswordStrength = (password) => {
  let score = 0;
  const criteriaMet = [];

  if (!password || password.length === 0) {
    return { score, level: 'Default', criteriaMet };
  }

  // Criteria definitions (aligned with common Yup validation)
  const criteria = {
    length: {
      regex: /.{8,}/, // Minimum 8 characters
      message: 'Minimum 8 characters',
    },
    lowercase: {
      regex: /[a-z]/,
      message: 'Includes lowercase letter',
    },
    uppercase: {
      regex: /[A-Z]/,
      message: 'Includes uppercase letter',
    },
    number: {
      regex: /[0-9]/,
      message: 'Includes number',
    },
    specialChar: {
      regex: /[@$!%*?&]/, // Common special characters
      message: 'Includes special character (@$!%*?&)',
    },
  };

  // Check each criterion
  if (criteria.length.regex.test(password)) {
    score++;
    criteriaMet.push(criteria.length.message);
  }
  if (criteria.lowercase.regex.test(password)) {
    score++;
    criteriaMet.push(criteria.lowercase.message);
  }
  if (criteria.uppercase.regex.test(password)) {
    score++;
    criteriaMet.push(criteria.uppercase.message);
  }
  if (criteria.number.regex.test(password)) {
    score++;
    criteriaMet.push(criteria.number.message);
  }
  if (criteria.specialChar.regex.test(password)) {
    score++;
    criteriaMet.push(criteria.specialChar.message);
  }

  // Determine strength level
  let level = 'Default'; // Start with Default
  if (password.length > 0) { // Only evaluate if password is not empty
    if (score <= 2) {
      level = 'Weak';
    } else if (score <= 4) {
      level = 'Medium';
    } else if (score >= 5) {
      level = 'Strong';
    }
  }


  return { score, level, criteriaMet };
};
