

export class Validator {


  userErrors: string[] = [];
  subjectMatter: string = '';
  body: Record<string, any> = {};
  validations: Function[] = [];


  constructor(payload: Record<string, any>, subjectMatter: string){
    this.body = { ...payload } || {};
    this.subjectMatter = subjectMatter || '';
  }


  _addError(message: string) {
    this.userErrors.push(message);
  }

  _validateRequireds() { }

  _validate() {

    this._validateRequireds();

    this._evaluateErrors();

    this.validations.forEach((validation: Function) => {
      validation();
    });

    this._evaluateErrors();

  }

  _evaluateErrors() {
    if (this.userErrors.length) {
      throw {
        userErrors: this.userErrors.map(userError => ({ message: userError })),
        [this.subjectMatter]: null
      }
    }
  }

}