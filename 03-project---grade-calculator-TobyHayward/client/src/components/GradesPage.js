import { useEffect, useState } from "react";
import GradeConverterForm from "./GradeConverterForm";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
const GradesPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [gradeScale, setGradeScale] = useState([]);

  useEffect(() => {
    // We use AbortController (https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
    // to clean up so that we don’t introduce a memory leak
    // (https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup)
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const result = await fetch(
          `${process.env.REACT_APP_API_URL}/grade-scale`
        );
        if (!result.ok) {
          throw new Error("API Error");
        }
        const data = await result.json();
        if (!abortController.signal.aborted) {
          setGradeScale(data);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          setError(true);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => abortController.abort();
  }, []);

  return (
    <main>
      {loading && <Loader />}
      {error && (
        <ErrorMessage
          errorType="mainError"
          message="Error fetching grade scale"
        />
      )}
      <GradeConverterForm gradeScale={gradeScale} />
    </main>
  );
};

export default GradesPage;
