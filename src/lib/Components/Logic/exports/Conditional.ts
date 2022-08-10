import { When } from './When';

/**
  Conditional logic interface.
  @see {@link https://circleci.com/docs/2.0/configuration-reference/#logic-statements}
  {@label STATIC_2.1}
*/
export interface Conditional {
  when?: When;
}
