import { Pipe, PipeTransform } from '@angular/core';
import { PolicySummary } from '../../models/policy/policy-summary';

@Pipe({ name: 'esLapsed' })
export class PolicyLapsedPipe implements PipeTransform {
  transform(value: any, arg = true) {
    if (value) {
      return value.filter((policy: PolicySummary) => {
        return policy.lapsed === arg;
      });
    }
    return value;
  }
}
