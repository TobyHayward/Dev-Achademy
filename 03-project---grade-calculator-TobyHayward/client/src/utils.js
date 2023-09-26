const getLetterGrade = (gradeScale, mark, scalelevel) => {
  if (!Array.isArray(gradeScale) || !gradeScale.length) {
    throw new Error("Grade scale not provided.");
  }

  const validation = (() => {
    const status = "Error";
    let errorType = null;
    let message = null;

    if (mark < 0 || mark > 100) {
      errorType = "Mark Input";
      message = "Mark must be between 0 and 100";
    } else if (typeof mark !== "number") {
      errorType = "Mark Input";
      message = "Mark must be a number between 0 and 100";
    } else if (typeof scalelevel !== "string") {
      errorType = "Level Input";
      message = "Level must be a string";
    } else if (scalelevel !== "Level 5" && scalelevel !== "Level 6") {
      errorType = "Level Input";
      message = 'Invalid level please select "Level 5" or "Level 6"';
    }
    return { status: status, errorType: errorType, message: message };
  })();

  if (validation.message !== null) {
    return validation;
  }

  const response = gradeScale
    .map(({ minMark, maxMark, grade, level }) => {
      if (scalelevel === level && minMark <= mark && mark <= maxMark) {
        return grade;
      }
      return null;
    })
    .find((responses) => responses != null);

  return { status: "Successful", message: response };
};

module.exports = { getLetterGrade };
//
