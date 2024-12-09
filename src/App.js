import './App.css';
import { useEffect, useState } from 'react';

const TOTAL_SEATS_NUMBER = 80;
const SEATS_IN_A_ROWS = 7;

function App() {
  const [numberInput, setNumberInput] = useState('');
  const [seatsArray, setSeatsArray] = useState([])
  const [bookedTill, setBookedTill] = useState({
    row: null,
    col: null
  })

  useEffect(() => {
    buildSeatsArray()
  },[])

  const onSubmit = () => {
    if (bookedTill.row !== null && bookedTill.col !== null) {
      const totalBookedSeats = (bookedTill.row * SEATS_IN_A_ROWS) + bookedTill.col + 1;
      
      if (totalBookedSeats + +numberInput > TOTAL_SEATS_NUMBER) {
        if (TOTAL_SEATS_NUMBER - totalBookedSeats === 0) {
          alert('No Seat Remaining to Book')
        } else {
          alert(`Only ${TOTAL_SEATS_NUMBER - totalBookedSeats} seats remaining to Book`)
        }
        return;
      }
    }
    if (numberInput > 7 || numberInput < 1) {
      alert(`${numberInput} seats cannot be booked`)
      return
    }
    let seatsAlloted = 0;
    if (bookedTill.row === null) {
      for (let i = 0; i < seatsArray.length; i++) {
        for (let j = 0; j < seatsArray[i].length; j++) {
          if (seatsAlloted === +numberInput) {
            setNumberInput('')
            return;
          }
          if (!seatsArray[i][j].booked) {
            seatsArray[i][j].booked = true;
            setBookedTill({
              row: i,
              col: j
            })
            seatsAlloted = seatsAlloted+1
          }
        }
      }
    } else {
      let temp_j = bookedTill.col;
      if (SEATS_IN_A_ROWS === bookedTill.col + 1) {
        temp_j = 0
      }
      for (let i = bookedTill.row; i < seatsArray.length; i++) {
        for (let j = temp_j; j < seatsArray[i].length ; j++) {
          if (seatsAlloted === +numberInput) {
            setNumberInput('')
            return;
          }
          if (!seatsArray[i][j].booked) {
            seatsArray[i][j].booked = true;
            setBookedTill({
              row: i,
              col: j
            })
            seatsAlloted = seatsAlloted+1
            if (j === seatsArray[i].length - 1) {
              temp_j = 0
            }
          }
        }
      }
    }
  }

  const buildSeatsArray = () => {
    let currentSeatsArray = []
    let add_new_row = true
    let curr_array = []
    let curr_row = 0;
    for (let i = 0; i < TOTAL_SEATS_NUMBER; i++) {
      if (add_new_row) {
        curr_array = [];
        curr_array.push({
          row: curr_row,
          col: i % SEATS_IN_A_ROWS,
          booked: false
        })
        add_new_row = false
      } else {
        curr_array.push({
          row: curr_row,
          col: i % SEATS_IN_A_ROWS,
          booked: false
        })
        if (i % SEATS_IN_A_ROWS == SEATS_IN_A_ROWS - 1 || i === TOTAL_SEATS_NUMBER - 1) {
          add_new_row = true
          curr_row = curr_row + 1
          currentSeatsArray.push(curr_array)
        }
      }
    }
    setSeatsArray(currentSeatsArray)
  }

  return (
    <div className="App">
      <div className="seatsArrayContainer">
        <div className="trainReservationHead">
          <h3>Train Reservation Chart</h3>
        </div>
        <div className="seatsHeadContainer">
          <div className='seatsVerificationContainer'>
            <p>Booked Seats: </p>
            <div className={`seatStyles bookedSeat`}></div>
          </div>
          <div className='seatsVerificationContainer'>
            <p>Available Seats: </p>
            <div className={`seatStyles availableSeat`}></div>
          </div>
        </div>
        {
          seatsArray.map((seatRow, rowIndex) => {
            return <div className='seatRowStyling'>
              {seatRow.map((seatCol,colIndex) => {
                return <SingleSeat row={rowIndex} col={colIndex} seatsArray={seatsArray} bookedTill={bookedTill} numberInput={numberInput} />
              })}
            </div>
          })
        }
      </div>
      <div className="inputBoxContainer">
        <input type='number' className="inputBox" onChange={(e)=>setNumberInput(e.target.value)} placeholder="Type seat numbers..." value={numberInput} />
        <div className='buttonsContainer'>
          <button onClick={onSubmit} className='submitButton'>Book Now</button>
        </div>
      </div>
    </div>
  );
}


const SingleSeat = ({row,col,bookedTill,seatsArray,numberInput}) => {
  const [currentCss, setCurrentCss] = useState('availableSeat')
  // 'bookedSeat'
  useEffect(() => {
    const getSeatStatus = (row,col) => {
      if (seatsArray[row][col].booked) {
        setCurrentCss('bookedSeat')
      } else {
        setCurrentCss('availableSeat')
      }
    }
    getSeatStatus(row,col)
  },[bookedTill.row,bookedTill.col,numberInput,col,row,seatsArray])

  return <div className={`seatStyles ${currentCss}`}></div>
}

export default App;
