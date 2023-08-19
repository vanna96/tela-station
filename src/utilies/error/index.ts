export abstract class FormError {
  public message: string

  constructor(message: string) {
    this.message = message
  }
}

export class FormValidateException extends FormError {
  tap: number

  constructor(message: string, tap: number) {
    super(message)
    this.message = message
    this.tap = tap
  }
}
