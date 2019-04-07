import React, { Component } from 'react';
import Error from 'next/error';

export default class ErrorPage extends Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return {
      statusCode,
      namespacesRequired: ['common']
    };
  }

  render() {
    return (
      <Error statusCode={this.props.statusCode} />
    );
  }
}
