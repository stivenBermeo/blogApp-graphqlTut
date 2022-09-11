import Validator from 'validator';

import { Validator as ValidatorClass } from './validator';
export class UserValidation extends ValidatorClass {

  constructor(payload: Record<string, any>, subjectMatter: string) {
    super(payload, subjectMatter);
  }

  _validateRequireds() {}

  _validateName() {
    const { name } = this.body;
    if (!Validator.isLength(name, { min: 3, max: 30})) {
      this._addError('Name must be 3-30 characters long');
    }
  }

  _validateEmail() {
    const { email } = this.body;
    if (!Validator.isEmail(email)) {
      this._addError('Invalid EMAIL');
    }
  }

  _validateBio() {
    const { bio } = this.body;
    if (!Validator.isLength(bio, { min: 10, max: 500})) {
      this._addError('Bio must be 10-500 characters long');
    }
  }

  _validatePassword() {
    const { password } = this.body;
    if (!Validator.isLength(password, { min: 6, max: 20})) {
      this.userErrors.push('Password must be 6-20 characters long' );
    }
  }

  create() {
    this.validations = [
      this._validatePassword.bind(this),
      this._validateBio.bind(this),
      this._validateName.bind(this),
      this._validateEmail.bind(this),
    ];

    this._validateRequireds = () => {
      const { name, email, password, bio } = this.body;
      if (!name || !email || !password || !bio) {
        this._addError('You must provide NAME, EMAIL, BIO and PASSWORD in order to create a user')
      } 
    }


    this._validate();
  }
  update() {
    this.validations = [
      this._validatePassword.bind(this),
      this._validateBio.bind(this),
      this._validateName.bind(this),
    ];

    this._validateRequireds = () => {
      const { name, password, bio } = this.body;
      if (!name && !password && !bio) {
        this._addError('You must provide either NAME, BIO or PASSWORD in order to update a user')
      } 
    }

    this._validate();
  }

}