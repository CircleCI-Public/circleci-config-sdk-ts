import { When } from './When';

/**
  Conditional logic interface.
  
  https://circleci.com/docs/2.0/configuration-reference/#logic-statements
*/
export interface Conditional {
  when?: When;
}
