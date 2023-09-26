import "./ErrorMessage.css";

const ErrorMessage = ({ message, errorType }) => {
  return <div className={`errorMessage ${errorType}`}>Error: {message}</div>;
};

export default ErrorMessage;
