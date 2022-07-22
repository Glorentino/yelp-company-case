import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
    moveTo: (position: google.maps.LatLngLiteral) => void;
  };


function Notification() {
    
    const notify = () => {

        toast('Basic notification! ')
    }

    return (
        <div>
            <button onClick={notify}> Notify! </button>
            <ToastContainer />
        </div>
    );
}
export default Notification;