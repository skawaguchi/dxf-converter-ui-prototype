import t from 'tcomb';

// from http://emailregex.com/
/* eslint-disable max-len */
const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const testEmail = (email) => emailRegEx.test(email);

export const Email = t.refinement(t.String, testEmail, 'Email');
