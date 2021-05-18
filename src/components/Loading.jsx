import React from 'react';
import ReactLoading from 'react-loading';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const Loading = () => {
    return (
        <div className="spiner">
            <Spinner
                animation="border"
                style={{ width: '3rem', height: '3rem' }}
                role="status">
            </Spinner>
            <span className="sr-only">Loading...</span>
        </div >
    );
};

export default Loading;