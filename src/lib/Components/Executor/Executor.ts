import Component from '../index';
import { ExecutorSchema } from './Executor.types';

/**
 * A generic reusable Executor
 */
export default abstract class Executor extends Component {
  name: string;
  description?: string;
  constructor(name: string, description?: string) {
    super();
    this.name = name;
    this.description = description;
  }
  abstract generate(): ExecutorSchema;
}
