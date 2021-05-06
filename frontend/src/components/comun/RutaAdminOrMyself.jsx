import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


const RutaAdminOrMyself = ({ component: Component, login, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            login.authenticated && (props.match.params.userID == login.user.id || login.user.isAdmin) ? (<Component {...props} />) : (<Redirect to="/" />)
        }
    />
);

RutaAdminOrMyself.propTypes = {
    login: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    login: state.login
})

export default connect(mapStateToProps)(RutaAdminOrMyself);