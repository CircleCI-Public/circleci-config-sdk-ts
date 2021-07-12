import Component from '../index';
import Job from '../Job';
import { WorkflowJobParameters, WorkflowJobSchema } from './Workflow';

/**
 * Assign Parameters and Filters to a Job within a Workflow
 */
export class WorkflowJob extends Component {
  job: Job;
  parameters?: WorkflowJobParameters;
  constructor(job: Job, parameters?: WorkflowJobParameters) {
    super();
    this.job = job;
    if (parameters) {
      this.parameters = parameters;
    }
  }
  generate(): WorkflowJobSchema {
    let result;
    if (this.parameters) {
      result = {
        [this.job.name]: this.parameters,
      };
    } else {
      result = {
        [this.job.name]: {},
      };
    }
    return result;
  }
}
