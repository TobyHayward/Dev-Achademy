import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatDate } from '../utils/formatDate';
import './Reservation.css';
import BackButton from './BackButton';
import { useAuth0 } from '@auth0/auth0-react';

const Reservation = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState({});
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:5001/reservations/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok === false) {
        setIsNotFound(true);
        return;
      }

      const data = await response.json();
      setReservation(data);
      setIsLoading(false);
    };

    fetchData();
  }, [id, getAccessTokenSilently]);

  if (isNotFound) {
    return (
      <>
        <p className='error'>Sorry! We can't find that reservation</p>
        <BackButton />
      </>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const DisplayReservation = ({ name, partySize, date }) => {
    return (
      <>
        <div className='reservation'>
          <h2 className='resturantName'>{name}</h2>
          <p>{formatDate(date)}</p>
          <p>
            <strong>Party size:</strong> {partySize}
          </p>
        </div>
        <Link className='backtoRes' to={`/reservations`}>
          &#8592; Back to reservations
        </Link>
      </>
    );
  };

  return (
    <>
      <DisplayReservation
        name={reservation.restaurantName}
        date={reservation.date}
        partySize={reservation.partySize}
      />
    </>
  );
};

export default Reservation;
