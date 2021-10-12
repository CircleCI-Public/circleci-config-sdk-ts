import { Component } from '../index';

/**
 * A generic reusable Executor
 * @internal
 */
export abstract class AbstractExecutor extends Component {
  description?: string;
  resourceClass: string;
  constructor(resourceClass: string, description?: string) {
    super();
    this.description = description;
    this.resourceClass = resourceClass;
  }
  abstract generate(): unknown;
}
