import { getLetterGrade } from "./utils";

const badTestData = [
  {
    mark: -100,
    expectedError: "Mark must be between 0 and 100",
    expectedErrorType: "Mark Input",
  },
  {
    mark: 1002,
    expectedError: "Mark must be between 0 and 100",
    expectedErrorType: "Mark Input",
  },
  {
    mark: "string",
    expectedError: "Mark must be a number between 0 and 100",
    expectedErrorType: "Mark Input",
  },
  {
    mark: null,
    expectedError: "Mark must be a number between 0 and 100",
    expectedErrorType: "Mark Input",
  },
  {
    level: 6,
    expectedError: "Level must be a string",
    expectedErrorType: "Level Input",
  },

  {
    level: "",
    expectedError: 'Invalid level please select "Level 5" or "Level 6"',
    expectedErrorType: "Level Input",
  },
  {
    level: null,
    expectedError: "Level must be a string",
    expectedErrorType: "Level Input",
  },
];

const gradeScale = [
  {
    level: "Level 5",
    minMark: 90,
    maxMark: 100,
    grade: "A+",
  },
  {
    level: "Level 5",
    minMark: 85,
    maxMark: 89,
    grade: "A",
  },
  {
    level: "Level 5",
    minMark: 80,
    maxMark: 84,
    grade: "A-",
  },
  {
    level: "Level 5",
    minMark: 75,
    maxMark: 79,
    grade: "B+",
  },
  {
    level: "Level 5",
    minMark: 70,
    maxMark: 74,
    grade: "B",
  },
  {
    level: "Level 5",
    minMark: 65,
    maxMark: 69,
    grade: "B-",
  },
  {
    level: "Level 5",
    minMark: 60,
    maxMark: 64,
    grade: "C+",
  },
  {
    level: "Level 5",
    minMark: 55,
    maxMark: 59,
    grade: "C",
  },
  {
    level: "Level 5",
    minMark: 50,
    maxMark: 54,
    grade: "C-",
  },
  {
    level: "Level 5",
    minMark: 40,
    maxMark: 49,
    grade: "D",
  },
  {
    level: "Level 5",
    minMark: 0,
    maxMark: 39,
    grade: "E",
  },
  {
    level: "Level 6",
    minMark: 92,
    maxMark: 100,
    grade: "A+",
  },
  {
    level: "Level 6",
    minMark: 85,
    maxMark: 91,
    grade: "A",
  },
  {
    level: "Level 6",
    minMark: 80,
    maxMark: 84,
    grade: "A-",
  },
  {
    level: "Level 6",
    minMark: 75,
    maxMark: 79,
    grade: "B+",
  },
  {
    level: "Level 6",
    minMark: 70,
    maxMark: 74,
    grade: "B",
  },
  {
    level: "Level 6",
    minMark: 65,
    maxMark: 69,
    grade: "B-",
  },
  {
    level: "Level 6",
    minMark: 60,
    maxMark: 64,
    grade: "C+",
  },
  {
    level: "Level 6",
    minMark: 55,
    maxMark: 59,
    grade: "C",
  },
  {
    level: "Level 6",
    minMark: 50,
    maxMark: 54,
    grade: "C-",
  },
  {
    level: "Level 6",
    minMark: 40,
    maxMark: 49,
    grade: "D",
  },
  {
    level: "Level 6",
    minMark: 0,
    maxMark: 39,
    grade: "E",
  },
];

describe("getLetterfunction", () => {
  describe("Happy Tests", () => {
    describe.each(gradeScale)(`%s`, (singleGradeScale) => {
      const { minMark, maxMark, level, grade } = singleGradeScale;
      const middleMark = parseInt((minMark + maxMark) / 2);
      test.each([[minMark], [maxMark], [middleMark]])(
        "Testing mark %s",
        (mark) => {
          // Arrange
          const expectedStatus = "Successful";
          const expectedMessage = grade;
          // Act
          const { message, status } = getLetterGrade(gradeScale, mark, level);
          // Assert
          expect(message).toEqual(expectedMessage);
          expect(status).toEqual(expectedStatus);
        }
      );
    });
  });

  describe("Negative Tests", () => {
    it.each(badTestData)(`Testing for %s`, (testData) => {
      // Arrange
      const { expectedError, expectedErrorType } = testData;
      const expectedStatus = "Error";
      let { minMark, maxMark, level } = gradeScale[1];
      let mark = parseInt((minMark + maxMark) / 2);

      const badParaName = Object.keys(testData).find((_, index) => index === 0);

      // Updates level or mark to the badParam
      switch (badParaName) {
        case "mark":
          mark = testData.mark;
          break;
        case "level":
          level = testData.level;
          break;
        default:
      }

      // Act
      const response = getLetterGrade(gradeScale, mark, level);
      const { message, status, errorType } = response;
      console.log(response);
      // Assert
      expect(message).toBe(expectedError);
      expect(status).toBe(expectedStatus);
      expect(errorType).toBe(expectedErrorType);
    });
  });

  test("Throws an error for invalid gradeScale", () => {
    const corruptGradeScale = {};
    const mark = 70;
    const level = "Level 5";
    expect(() => getLetterGrade(corruptGradeScale, mark, level)).toThrow(
      "Grade scale not provided."
    );
  });
});
