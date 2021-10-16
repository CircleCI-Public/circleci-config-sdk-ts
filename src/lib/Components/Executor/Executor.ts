import { Component } from '../index';
import { ExecutorSchema } from './Executor.types';

/**
 * A generic reusable Executor
 */
export abstract class AbstractExecutor extends Component {
  description?: string;
  resourceClass: string;
  constructor(resourceClass: string, description?: string) {
    super();
    this.description = description;
    this.resourceClass = resourceClass;
  }
  abstract generate(): ExecutorSchema;
}
