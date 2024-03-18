import _ from 'lodash';
import Requests from './requests.js';
import SearchCache from './search-cache.js';
import StaticOptions from './static-options.js';

// check data against the current static data (updated whenever onCustomersChange is called)
const isCurrentData = data => {
  const staticData = _.get(StaticOptions.getOptions(), 'data');
  return _.isEqual(staticData, data);
};

const noAgentCodeOption = {
  label: 'No agency code found',
  value: ''
};

// return a list of agent codes based on:
//    - provisioning entity OR
//    - amalgamation of customer/contact related agent codes
export const getAgentCodes = ({ data, state }, options) => {
  let agentCodes = [];
  let currentAgentCode = state.agent_code.selectedValue;

  const url = `${data.urls.api}rea/agents/`;
  const agentRequests = new Requests({
    allowEarlierRequests: true,
    url,
    options,
    data
  });
  StaticOptions.setOptions({ data });
  const currData = _.cloneDeep(data);

  const pendingRequests = [];
  const customerData = _.get(data, 'customers.0', {});
  const contacts = _.get(data, 'contacts', []);

  // get provisioning entity agent
  const opportunityID = customerData.selectedOpportunity;
  const opportunity = _.find(
    customerData.opportunity_set,
    opp => opp.id === opportunityID
  );
  const provisioningEntity = _.get(
    opportunity,
    'profile.provisioning_entity',
    null
  );

  if (provisioningEntity) {
    // return provisioning entity
    SearchCache.add(url, provisioningEntity);
    const { code, agency_name } = provisioningEntity;

    return {
      state: {
        agent_code: {
          selectedValue: code,
          options: [
            {
              label: `${code} - ${agency_name}`,
              value: code
            }
          ],
          disabled: true
        }
      }
    };
  }

  // no provisioning entity, use customer/contact to fetch agent code list
  if (!_.isEmpty(customerData)) {
    // use customer ID to fetch agent codes
    pendingRequests.push({
      customer: customerData.id,
      per_page: 1000
    });
  }

  if (!_.isEmpty(contacts)) {
    // use contact IDs to fetch agent codes
    _.each(contacts, contact => {
      pendingRequests.push({
        contact: contact.id,
        per_page: 1000
      });
    });
  }

  return Promise.all(
    _.map(pendingRequests, query => agentRequests.get({ query }))
  )
    .then(results => {
      // check if data has changed since request was sent
      if (!isCurrentData(currData)) {
        // don't update anything
        return {};
      }

      _.each(results, result => {
        if (Array.isArray(result)) {
          SearchCache.add(url, result);
          const codes = _.map(result, entry => ({
            label: `${entry.code} - ${entry.agency_name}`,
            value: entry.code
          }));
          agentCodes = _.unionWith(agentCodes, codes, _.isEqual);
        }
      });

      if (!agentCodes.length) {
        agentCodes.push(noAgentCodeOption);
      }

      const newSelection =
        _.find(agentCodes, code => code.value === currentAgentCode) ||
        agentCodes[0];

      return {
        state: {
          agent_code: {
            options: agentCodes,
            selectedValue: newSelection.value,
            disabled: agentCodes.length < 2
          }
        }
      };
    })
    .catch(error => {
      // check if data has changed since request was sent
      if (!isCurrentData(currData)) {
        // don't update anything
        return {};
      }

      if (!agentCodes.length) {
        agentCodes.push(noAgentCodeOption);
      }
      const newSelection =
        _.find(agentCodes, code => code.value === currentAgentCode) ||
        agentCodes[0];
      return {
        state: {
          agent_code: {
            options: agentCodes,
            selectedValue: newSelection.value,
            disabled: agentCodes.length < 2
          }
        }
      };
    });
};
