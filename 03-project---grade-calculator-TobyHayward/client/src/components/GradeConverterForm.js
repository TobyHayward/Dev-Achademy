import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { getLetterGrade } from "../utils";
import "./GradeConverterForm.css";

const GradeConverterForm = ({ gradeScale }) => {
  const [level, setLevel] = useState("Level 5");
  const [mark, setMark] = useState(0);
  const [grade, setGrade] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [errorType, setErrorType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const { message, errorType, status } = getLetterGrade(
        gradeScale,
        mark,
        level
      );

      if (status === "Error") {
        setErrorType(errorType);
        setFormErrorMessage(message);
      } else {
        setGrade(message);
        setErrorType(null);
        setFormErrorMessage(null);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="getGradeTile">
      <form className="mainForm" onSubmit={handleSubmit}>
        {errorMessage && <ErrorMessage message={errorMessage} />}
        <div className="formInputs">
          <div className="levelDiv">
            {errorType === "Level Input" ? (
              <>
                <ErrorMessage
                  className="formErrorMessage"
                  message={formErrorMessage}
                />
                <br></br>
              </>
            ) : null}
            <label htmlFor="level">Level</label>
            <select
              className="mainFormSelect"
              id="level"
              value={level}
              onChange={(e) => {
                setGrade("");
                setLevel(e.target.value);
              }}
            >
              <option value="Level 5">Level 5</option>
              <option value="Level 6">Level 6</option>
            </select>
          </div>
          <div className="markDiv">
            {errorType === "Mark Input" ? (
              <>
                <ErrorMessage
                  className={"formErrorMessage"}
                  message={formErrorMessage}
                />
                <br></br>
              </>
            ) : null}
            <label htmlFor="mark">Mark</label>
            <input
              className="mainFormNumber"
              id="mark"
              type="number"
              value={mark}
              onChange={(e) => {
                setGrade("");
                setMark(Number(e.target.value));
              }}
            />
          </div>
          <div className="gradeDisplay">
            <p className="gradeTitle"> Grade</p>
            {grade && <p className="gradeText">{grade}</p>}
          </div>
        </div>
        <button className="mainFormButton">Get Grade</button>
      </form>
    </div>
  );
};

export default GradeConverterForm;
