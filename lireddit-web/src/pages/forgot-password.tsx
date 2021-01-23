import { withUrqlClient } from 'next-urql';
import React from 'react';
import { createUrqlClient } from '../utilities/createUrqlCLient';

const ForgotPassword = () => {
    return (
        <div>Hello</div>
    )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)