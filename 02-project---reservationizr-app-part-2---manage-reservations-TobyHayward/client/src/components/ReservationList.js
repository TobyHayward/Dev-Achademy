import './ReservationList.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { formatDate } from '../utils/formatDate';

const ReservationDisplay = ({ restaurantName, date, id }) => {
  return (
    <>
      <h2>{restaurantName}</h2>
      <p>{formatDate(date)}</p>
      <Link className='veiwDetailsButton' to={`/reservations/${id}`}>
        View details &#8594;
      </Link>
    </>
  );
};

const ReservationList = () => {
  const [reservationList, setReservationList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      try {
        const fetchUrl = `http://localhost:5001/reservations`;
        let response = await fetch(fetchUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.json();
        result.length === 0 ? setIsEmpty(true) : setIsEmpty(false);
        setReservationList(result);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [getAccessTokenSilently]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isEmpty === true) {
    return (
      <>
        <h1>Upcoming Reservations</h1>
        <p>You don't have any reservations</p>
        <Link className='link' to={`/`}>
          View the restaurants
        </Link>
      </>
    );
  }
  return (
    <>
      <h1>Upcoming Reservations</h1>
      <ul className='reservationList'>
        {reservationList.map((reservation) => {
          return (
            <li class='reservationListItem' key={reservation.id}>
              <ReservationDisplay
                restaurantName={reservation.restaurantName}
                date={reservation.date}
                id={reservation.id}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ReservationList;
