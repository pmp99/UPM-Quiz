import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


const RouteMyself = ({ component: Component, login, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            login.authenticated && parseInt(props.match.params.userID) === login.user.id ? (<Component {...props} />) : (<Redirect to="/" />)
        }
    />
);

RouteMyself.propTypes = {
    login: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    login: state.login
})

export default connect(mapStateToProps)(RouteMyself);