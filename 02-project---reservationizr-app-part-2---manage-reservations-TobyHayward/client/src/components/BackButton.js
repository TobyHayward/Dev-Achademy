import { Link } from 'react-router-dom';

const BackButton = () => {
  return (
    <p className='left'>
      <Link to='/' className='btn btn-center'>
        &larr; Back to reservations
      </Link>
    </p>
  );
};

export default BackButton;
